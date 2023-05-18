import { DiscussionReplyData } from "@/atoms/discussionAtom";
import discussionDb from "@/lib/db/discussionDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { Reply, ReplyVote } from "@/lib/interfaces/discussion";
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
			userId,
			discussionId,
			replyForId,
			fromVotes = Number.MAX_SAFE_INTEGER.toString(),
			fromReplies = Number.MAX_SAFE_INTEGER.toString(),
			fromDate = new Date().toISOString(),
			limit = "10",
		} = req.body || req.query;

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

		if (!discussionRepliesCollection || !discussionReplyVotesCollection) {
			return res
				.status(500)
				.json({ error: "Cannot connect with the Discussions Database!" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			return res.status(400).json({ error: "Invalid API key!" });
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		if (!userData) {
			return res.status(400).json({ error: "User not found!" });
		}

		if (userData.uid !== userId) {
			return res.status(404).json({ error: "Please use the correct API!" });
		}

		switch (req.method) {
			case "GET": {
				if (!discussionId) {
					return res.status(400).json({ error: "No discussion ID provided!" });
				}

				if (!replyForId) {
					return res
						.status(400)
						.json({ error: "Reply receiver ID not provided!" });
				}

				const replies = await Promise.all(
					fromDate
						? await discussionRepliesCollection
								.find({
									discussionId,
									replyForId,
									numberOfVotes: {
										$lt: parseInt(fromVotes as string),
									},
									numberOfReplies: {
										$lt: parseInt(fromReplies as string),
									},
									createdAt: {
										$lt: fromDate,
									},
								})
								.sort({
									numberOfVotes: -1,
									numberOfReplies: -1,
									createdAt: -1,
								})
								.limit(parseInt(limit as string))
								.toArray()
						: await discussionRepliesCollection
								.find({
									discussionId,
									replyForId,
									numberOfVotes: {
										$lt: parseInt(fromVotes as string),
									},
									numberOfReplies: {
										$lt: parseInt(fromReplies as string),
									},
								})
								.sort({
									numberOfVotes: -1,
									numberOfReplies: -1,
									createdAt: -1,
								})
								.limit(parseInt(limit as string))
								.toArray()
				);

				const repliesData = (await Promise.all(
					replies.map(async (replyDoc) => {
						const reply = replyDoc as unknown as Reply;
						const creator = (await usersCollection.findOne({
							uid: reply.creatorId,
						})) as unknown as SiteUser;
						const userReplyVote = (await discussionReplyVotesCollection.findOne({
							discussionId: reply.discussionId,
							replyId: reply.id,
							userId,
						})) as unknown as ReplyVote;

						return {
							reply,
							creator,
							userReplyVote,
						};
					})
				)) as unknown as DiscussionReplyData[];

				if (replies.length) {
					return res.status(200).json({ repliesData });
				} else {
					return res.status(200).json({ repliesData: [] });
				}

				break;
			}

			default: {
				return res.status(405).json({ error: "Invalid request method!" });
				break;
			}
		}
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
}
