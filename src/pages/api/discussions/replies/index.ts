import discussionDb from "@/lib/db/discussionDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { Reply } from "@/lib/interfaces/discussion";
import { SiteUser } from "@/lib/interfaces/user";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

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

		const {
			apiKey,
			replyData: rawReplyData,
		}: { apiKey: string; replyData: string | Reply } = req.body || req.query;

		const replyData: Reply =
			typeof rawReplyData === "string" ? JSON.parse(rawReplyData) : rawReplyData;

		if (!apiKey) {
			return res.status(401).json({ error: "No API key provided" });
		}

		if (!apiKeysCollection || !usersCollection) {
			return res
				.status(503)
				.json({ error: "Cannot connect with the API or Users Database" });
		}

		if (!discussionsCollection || !discussionVotesCollection) {
			return res
				.status(503)
				.json({ error: "Cannot connect with the Discussions Database" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			return res.status(403).json({ error: "Invalid API key" });
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		if (!userData) {
			return res.status(404).json({ error: "User not found" });
		}

		switch (req.method) {
			case "POST": {
				if (!replyData) {
					return res.status(400).json({ error: "Invalid reply data provided!" });
				}

				const objectId = new ObjectId();
				const objectIdString = objectId.toHexString();

				replyData.id = objectIdString;

				const existingReply = await discussionRepliesCollection.findOne({
					id: replyData.id,
				});

				if (existingReply) {
					return res.status(409).json({ error: "Reply already exists!" });
				}

				const newReplyState = await discussionRepliesCollection
					.insertOne({
						_id: objectId,
						...replyData,
					})
					.catch((error: any) => {
						return res.status(500).json({
							error: `Mongo (API): Inserting reply error:\n${error.message}`,
						});
					});

				await Promise.all([
					replyData.replyLevel === 0
						? await discussionsCollection.updateOne(
								{ id: replyData.discussionId },
								{
									$inc: {
										numberOfReplies: 1,
										numberOfFirstLevelReplies: 1,
									},
								}
						  )
						: await discussionsCollection.updateOne(
								{ id: replyData.discussionId },
								{
									$inc: {
										numberOfReplies: 1,
									},
								}
						  ),
				]).catch((error: any) => {
					return res.status(500).json({
						error: `Mongo (API): Updating discussion error:\n${error.message}`,
					});
				});

				return res.status(200).json({
					newReplyState,
					newReplyData: replyData,
				});
				break;
			}

			case "PUT": {
				if (!replyData || !replyData.id) {
					return res.status(400).json({ error: "No reply data provided!" });
				}

				if (replyData.creatorId !== userAPI.userId) {
					if (!userData.roles.includes("admin")) {
						return res.status(401).json({ error: "Unauthorized!" });
					}
				}

				const existingReply = await discussionRepliesCollection.findOne({
					id: replyData.id,
				});

				if (!existingReply) {
					return res.status(404).json({ error: "Reply not found!" });
				}

				const updatedReplyState = await discussionRepliesCollection
					.updateOne(
						{ id: replyData.id },
						{
							$set: {
								...replyData,
							},
						}
					)
					.catch((error: any) => {
						return res.status(500).json({
							error: `Mongo (API):\nUpdating reply error:\n${error.message}`,
						});
					});

				return res.status(200).json({
					isUpdated: updatedReplyState ? updatedReplyState.acknowledged : false,
				});

				break;
			}

			case "DELETE": {
				if (!replyData) {
					return res.status(400).json({ error: "No reply data provided!" });
				}

				if (userAPI.userId !== replyData.creatorId) {
					if (!userData.roles.includes("admin")) {
						return res.status(401).json({ error: "Unauthorized!" });
					}
				}

				const existingReply = await discussionRepliesCollection.findOne({
					id: replyData.id,
				});

				if (!existingReply) {
					return res.status(404).json({ error: "Reply not found!" });
				}

				let deleteCount = 0;

				const deleteReply = async (reply: Reply) => {
					const deleteReplyState = await discussionRepliesCollection.deleteOne({
						id: reply.id,
					});

					deleteCount += deleteReplyState.deletedCount;

					const deleteReplyVotesState =
						await discussionReplyVotesCollection.deleteMany({
							discussionId: reply.discussionId,
							replyId: reply.id,
						});

					if (reply.replyLevel === 0) {
						await discussionsCollection
							.updateOne(
								{ id: replyData.discussionId },
								{
									$inc: {
										numberOfFirstLevelReplies: -1,
									},
								}
							)
							.catch((error: any) => {
								return res.status(500).json({
									error: `Mongo (API): Updating discussion error:\n${error.message}`,
								});
							});
					} else {
						await discussionRepliesCollection
							.updateOne(
								{ id: reply.replyForId },
								{
									$inc: {
										numberOfReplies: -1,
									},
								}
							)
							.catch((error: any) => {
								return res.status(500).json({
									error: `Mongo (API): Updating reply error:\n${error.message}`,
								});
							});
					}

					const nestedReplies = (await discussionRepliesCollection
						.find({
							replyForId: reply.id,
						})
						.toArray()) as unknown as Reply[];

					for (const nestedReply of nestedReplies) {
						await deleteReply(nestedReply);
					}
				};

				await deleteReply(replyData);

				await discussionsCollection
					.updateOne(
						{ id: replyData.discussionId },
						{
							$inc: {
								numberOfReplies: -deleteCount,
							},
						}
					)
					.catch((error) => {
						return res.status(500).json({
							error: `Mongo (API): Updating discussion error:\n${error.message}`,
						});
					});

				return res.status(200).json({
					isDeleted: deleteCount > 0,
					deleteCount: deleteCount,
				});

				break;
			}

			default: {
				return res.status(400).json({ error: "Invalid request method" });
				break;
			}
		}
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
}
