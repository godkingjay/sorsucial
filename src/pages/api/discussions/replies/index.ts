import discussionDb from "@/lib/db/discussionDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { Reply, SiteDiscussion } from "@/lib/interfaces/discussion";
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

		const replyData: Reply | undefined =
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

		const discussionData = (await discussionsCollection.findOne({
			id: replyData?.discussionId,
		})) as unknown as SiteDiscussion;

		if (!discussionData) {
			return res.status(404).json({
				discussionDeleted: true,
				replyDeleted: true,
				error: "Discussion not found",
			});
		}

		if (replyData && replyData.replyLevel > 0) {
			const parentReplyData = (await discussionRepliesCollection.findOne({
				id: replyData.replyForId,
			})) as unknown as Reply;

			if (!parentReplyData) {
				return res.status(404).json({
					discussionDeleted: true,
					parentReplyDeleted: true,
					error: "Parent reply not found",
				});
			}
		}

		switch (req.method) {
			case "POST": {
				if (!replyData) {
					return res.status(400).json({ error: "Invalid reply data provided!" });
				}

				if (
					!replyData.creatorId ||
					!replyData.replyText ||
					!replyData.discussionId
				) {
					return res
						.status(400)
						.json({ error: "Reply data are missing some fields!" });
				}

				const objectId = new ObjectId();
				const objectIdString = objectId.toHexString();

				replyData.id = objectIdString;
				(replyData as any).id = objectIdString;

				const existingReply = await discussionRepliesCollection.findOne({
					id: replyData.id,
				});

				if (existingReply) {
					return res.status(409).json({ error: "Reply already exists!" });
				}

				const newReplyState = await discussionRepliesCollection
					.findOneAndUpdate(
						{
							id: replyData.id,
						},
						{
							$set: {
								...replyData,
							},
						},
						{
							upsert: true,
						}
					)
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

				return res.status(201).json({
					newReplyState,
					newReplyData: replyData,
				});
				break;
			}

			case "PUT": {
				if (!replyData || !replyData.id) {
					return res.status(400).json({ error: "No reply data provided!" });
				}

				const existingReply = (await discussionRepliesCollection.findOne({
					id: replyData.id,
				})) as unknown as Reply;

				if (!existingReply) {
					return res.status(404).json({
						replyDeleted: true,
						error: "Reply not found!",
					});
				}

				const { numberOfReplies, ...updatedReply } = replyData;

				const updatedReplyState = await discussionRepliesCollection
					.updateOne(
						{ id: replyData.id },
						{
							$set: updatedReply,
						}
					)
					.catch((error: any) => {
						return res.status(500).json({
							error: `Mongo (API):\nUpdating reply error:\n${error.message}`,
						});
					});

				if (numberOfReplies) {
					await discussionRepliesCollection.findOneAndUpdate(
						{
							id: replyData.id,
						},
						{
							$inc: {
								numberOfReplies: 1,
							},
						}
					);
				}

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
						return res
							.status(401)
							.json({ error: "You are not allowed to delete this reply!" });
					}
				}

				const existingReply = await discussionRepliesCollection.findOne({
					id: replyData.id,
				});

				if (!existingReply) {
					return res.status(404).json({
						replyDeleted: true,
						error: "Reply not found!",
					});
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
				return res.status(405).json({ error: "Invalid request method" });
				break;
			}
		}
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
}
