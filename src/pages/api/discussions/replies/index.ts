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
			discussionRepliesCollection,
			discussionVotesCollection,
		} = await discussionDb();

		const { apiKey, replyData }: { apiKey: string; replyData: Reply } =
			req.body || req.query;

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

		if (!userData) {
			res.status(500).json({ error: "Invalid user" });
			return;
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

			default: {
				res.status(400).json({ error: "Invalid request method" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
