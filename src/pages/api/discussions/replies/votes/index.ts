import discussionDb from "@/lib/db/discussionDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { ReplyVote } from "@/lib/interfaces/discussion";
import { SiteUser } from "@/lib/interfaces/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { apiKeysCollection, usersCollection } = await userDb();
		const { discussionRepliesCollection, discussionReplyVotesCollection } =
			await discussionDb();

		const {
			apiKey,
			replyVoteData: rawReplyVoteData,
			discussionId,
			replyId,
			userId,
		}: {
			apiKey: string;
			replyVoteData: string | ReplyVote;
			discussionId: string;
			replyId: string;
			userId: string;
		} = req.body || req.query;

		const replyVoteData: ReplyVote =
			typeof rawReplyVoteData === "string"
				? JSON.parse(rawReplyVoteData)
				: rawReplyVoteData;

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

		if (!discussionRepliesCollection || !discussionReplyVotesCollection) {
			res
				.status(500)
				.json({ error: "Cannot connect with the Discussions Database!" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			res.status(401).json({ error: "Invalid API key" });
			return;
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		if (!userData) {
			res.status(401).json({ error: "Invalid User" });
			return;
		}

		switch (req.method) {
			case "POST": {
				if (!replyVoteData) {
					res.status(400).json({ error: "No reply vote data provided!" });
				}

				const newReplyVoteState = await discussionReplyVotesCollection
					.insertOne(replyVoteData)
					.catch((error) => {
						res.status(500).json({
							error:
								"Mongo(API): Creating new reply vote error\n" + error.message,
						});
					});

				const newDiscussionReplyStateVoted = await discussionRepliesCollection
					.updateOne(
						{ id: replyVoteData.replyId },
						{
							$inc: {
								numberOfVotes: 1,
								numberOfUpVotes: replyVoteData.voteValue === 1 ? 1 : 0,
								numberOfDownVotes: replyVoteData.voteValue === -1 ? 1 : 0,
							},
						}
					)
					.catch((error) => {
						res.status(500).json({
							error:
								"Mongo(API): Updating discussion reply error\n" + error.message,
						});
					});

				res.status(200).json({
					newReplyVoteState,
					newDiscussionReplyStateVoted,
					voteSuccess: newReplyVoteState
						? newReplyVoteState.acknowledged
						: false,
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
