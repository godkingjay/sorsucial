import { ObjectId } from "mongodb";
import { Reply, SiteDiscussion } from "@/lib/interfaces/discussion";
import { SiteUser } from "@/lib/interfaces/user";
import { NextApiRequest, NextApiResponse } from "next";
import discussionDb from "@/lib/db/discussionDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import tagDb from "@/lib/db/tagDb";

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
			res.status(400).json({ error: "No API key provided!" });
		}

		if (!apiKeysCollection) {
			res
				.status(500)
				.json({ error: "Cannot connect with the API Keys Database!" });
		}

		if (!usersCollection) {
			res.status(500).json({ error: "Cannot connect with the Users Database!" });
		}

		if (!discussionsCollection || !discussionVotesCollection) {
			res
				.status(500)
				.json({ error: "Cannot connect with the Discussions Database!" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			res.status(500).json({ error: "Invalid API key" });
			return;
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		switch (req.method) {
			case "POST": {
				if (!discussionData) {
					res.status(400).json({ error: "No discussion data provided!" });
				}

				if (!creator) {
					res.status(400).json({ error: "No creator data provided!" });
				}

				if (creator.uid !== userAPI.userId) {
					res.status(400).json({ error: "Creator UID does not match API key!" });
				}

				if (discussionData.creatorId !== creator.uid) {
					res
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
						res.status(500).json({
							error: "Mongo: Creating document error: " + error.message,
						});
					});

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

				res.status(200).json({
					newDiscussionState,
					newDiscussion: discussionData,
				});
				break;
			}

			case "DELETE": {
				if (!discussionData) {
					res.status(400).json({ error: "No discussion data provided!" });
				}

				if (userData.uid !== discussionData.creatorId) {
					if (!userData.roles.includes("admin")) {
						res.status(400).json({
							error: "User is not the creator of the discussion or an admin!",
						});
					}
				}

				const existingDiscussion = (await discussionsCollection.findOne({
					id: discussionData.id,
				})) as unknown as SiteDiscussion;

				if (!existingDiscussion) {
					res
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
						res.status(500).json({
							error: "Mongo(API): Deleting document error: " + error.message,
						});
					});

				const deleteDiscussionVotesState =
					await discussionVotesCollection.deleteMany({
						discussionId: discussionData.id,
					});

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

				res.status(200).json({
					isDeleted: deleteState ? deleteState.acknowledged : false,
					deleteDiscussionVotesState,
				});

				break;
			}

			default: {
				res.status(405).json({ error: "Method not allowed" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
