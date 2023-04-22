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
			res.status(401).json({ error: "Invalid API key" });
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		if (!userData) {
			res.status(401).json({ error: "Invalid user" });
		}

		switch (req.method) {
			case "POST": {
				if (!replyData) {
					res.status(400).json({ error: "No reply data provided!" });
				}

				const objectId = new ObjectId();
				const objectIdString = objectId.toHexString();

				replyData.id = objectIdString;

				const newReplyState = await discussionRepliesCollection
					.insertOne({
						_id: objectId,
						...replyData,
					})
					.catch((error: any) => {
						res.status(500).json({
							error: `
                Mongo (API):
                Inserting reply error:
                ${error.message}
              `,
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
					res.status(500).json({
						error: `
              Mongo (API):
              Updating discussion error:
              ${error.message}
            `,
					});
				});

				res.status(200).json({
					newReplyState,
					newReplyData: replyData,
				});
				break;
			}

			case "PUT": {
				if (!replyData) {
					res.status(400).json({ error: "No reply data provided!" });
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
						res.status(500).json({
							error: `Mongo (API):\nUpdating reply error:\n${error.message}`,
						});
					});

				res.status(200).json({
					isUpdated: updatedReplyState ? updatedReplyState.acknowledged : false,
				});

				break;
			}

			case "DELETE": {
				if (!replyData) {
					res.status(400).json({ error: "No reply data provided!" });
				}

				if (userAPI.userId !== replyData.creatorId) {
					if (!userData.roles.includes("admin")) {
						res.status(401).json({ error: "Unauthorized!" });
					}
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

					if (replyData.replyLevel === 0) {
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
								res.status(500).json({
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
								res.status(500).json({
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
						res.status(500).json({
							error: `Mongo (API): Updating discussion error:\n${error.message}`,
						});
					});

				res.status(200).json({
					isDeleted: deleteCount > 0,
					deleteCount: deleteCount,
				});

				break;
			}

			default: {
				res.status(400).json({ error: "Invalid request method" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
