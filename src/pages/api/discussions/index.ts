import { ObjectId } from "mongodb";
import { Reply, SiteDiscussion } from "@/lib/interfaces/discussion";
import { SiteUser } from "@/lib/interfaces/user";
import { NextApiRequest, NextApiResponse } from "next";
import discussionDb from "@/lib/db/discussionDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import tagDb from "@/lib/db/tagDb";
import groupDb from "@/lib/db/groupDb";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { apiKeysCollection, usersCollection } = await userDb();

		const {
			discussionsCollection,
			discussionVotesCollection,
			discussionRepliesCollection,
			discussionReplyVotesCollection,
		} = await discussionDb();

		const { groupsCollection } = await groupDb();

		const { tagsCollection } = await tagDb();

		const {
			apiKey,
			discussionData: rawDiscussionData,
			creator: rawCreator,
		}: {
			apiKey: string;
			discussionData: SiteDiscussion | string;
			creator: SiteUser | string;
		} = req.body || req.query;

		const discussionData: SiteDiscussion =
			typeof rawDiscussionData === "string"
				? JSON.parse(rawDiscussionData)
				: rawDiscussionData;

		const creator: SiteUser =
			typeof rawCreator === "string" ? JSON.parse(rawCreator) : rawCreator;

		if (!apiKey) {
			return res.status(400).json({ error: "No API key provided!" });
		}

		if (!apiKeysCollection) {
			return res
				.status(500)
				.json({ error: "Cannot connect with the API Keys Database!" });
		}

		if (!usersCollection) {
			return res
				.status(500)
				.json({ error: "Cannot connect with the Users Database!" });
		}

		if (
			!discussionsCollection ||
			!discussionVotesCollection ||
			!discussionRepliesCollection ||
			!discussionReplyVotesCollection
		) {
			res
				.status(500)
				.json({ error: "Cannot connect with the Discussions Database!" });
		}

		if (!groupsCollection) {
			res
				.status(500)
				.json({ error: "Cannot connect with the Groups Database!" });
		}

		if (!tagsCollection) {
			return res
				.status(500)
				.json({ error: "Cannot connect with the Tags Database!" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			return res.status(401).json({ error: "Invalid API key" });
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		if (!userData) {
			return res.status(401).json({ error: "Invalid User" });
		}

		switch (req.method) {
			case "POST": {
				if (!discussionData) {
					return res.status(400).json({ error: "No discussion data provided!" });
				}

				if (!creator) {
					return res.status(400).json({ error: "No creator data provided!" });
				}

				if (creator.uid !== userAPI.userId) {
					return res
						.status(400)
						.json({ error: "Creator UID does not match API key!" });
				}

				if (discussionData.creatorId !== creator.uid) {
					return res
						.status(400)
						.json({ error: "Creator ID does not match creator UID!" });
				}

				const objectId = new ObjectId();
				const objectIdString = objectId.toHexString();

				discussionData.id = objectIdString;

				const newDiscussionState = await discussionsCollection
					.insertOne({
						...discussionData,
						_id: objectId,
					})
					.catch((error: any) => {
						return res.status(500).json({
							error: "Mongo: Creating document error: " + error.message,
						});
					});

				if (discussionData.groupId) {
					await groupsCollection.updateOne(
						{
							id: discussionData.groupId,
						},
						{
							$inc: {
								numberOfDiscussions: 1,
							},
							$set: {
								updatedAt: discussionData.createdAt,
							},
						}
					);
				}

				discussionData.discussionTags.map(async (tag) => {
					await tagsCollection.updateOne(
						{
							name: tag,
						},
						{
							$inc: {
								total: 1,
								discussions: 1,
							},
							$setOnInsert: {
								createdAt: new Date(),
							},
						},
						{
							upsert: true,
						}
					);
				});

				return res.status(200).json({
					newDiscussionState,
					newDiscussion: discussionData,
				});
				break;
			}

			case "DELETE": {
				if (!discussionData) {
					return res.status(400).json({ error: "No discussion data provided!" });
				}

				if (userData.uid !== discussionData.creatorId) {
					if (!userData.roles.includes("admin")) {
						return res.status(400).json({
							error: "User is not the creator of the discussion or an admin!",
						});
					}
				}

				const existingDiscussion = (await discussionsCollection.findOne({
					id: discussionData.id,
				})) as unknown as SiteDiscussion;

				if (!existingDiscussion) {
					return res
						.status(200)
						.json({ isDeleted: true, error: "Discussion does not exist!" });
				}

				const deleteReply = async (reply: Reply) => {
					const deleteReplyState = await discussionRepliesCollection.deleteOne({
						id: reply.id,
					});

					const deleteReplyVotesState =
						await discussionReplyVotesCollection.deleteMany({
							discussionId: reply.discussionId,
							replyId: reply.id,
						});

					const nestedReplies = (await discussionRepliesCollection
						.find({
							replyForId: reply.id,
						})
						.toArray()) as unknown as Reply[];

					for (const nestedReply of nestedReplies) {
						await deleteReply(nestedReply);
					}
				};

				const discussionReplies = (await discussionRepliesCollection
					.find({
						replyForId: discussionData.id,
					})
					.toArray()) as unknown as Reply[];

				for (const reply of discussionReplies) {
					await deleteReply(reply);
				}

				const deleteState = await discussionsCollection
					.deleteOne({
						id: discussionData.id,
					})
					.catch((error: any) => {
						return res.status(500).json({
							error: "Mongo(API): Deleting document error: " + error.message,
						});
					});

				const deleteDiscussionVotesState =
					await discussionVotesCollection.deleteMany({
						discussionId: discussionData.id,
					});

				if (discussionData.groupId) {
					await groupsCollection.updateOne(
						{
							id: discussionData.groupId,
						},
						{
							$inc: {
								numberOfDiscussions: -1,
							},
							$set: {
								updatedAt: discussionData.createdAt,
							},
						}
					);
				}

				discussionData.discussionTags.map(async (tag) => {
					await tagsCollection.updateOne(
						{
							name: tag,
						},
						{
							$inc: {
								total: -1,
								discussions: -1,
							},
							$set: {
								updatedAt: new Date(),
							},
						}
					);
				});

				return res.status(200).json({
					isDeleted: deleteState ? deleteState.acknowledged : false,
					deleteDiscussionVotesState,
				});

				break;
			}

			default: {
				return res.status(405).json({ error: "Method not allowed" });
				break;
			}
		}
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
}
