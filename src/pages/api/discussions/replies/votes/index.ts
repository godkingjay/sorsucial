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
				if (!replyVoteData) {
					return res.status(400).json({ error: "No reply vote data provided!" });
				}

				const existingReplyVote = (await discussionReplyVotesCollection.findOne({
					replyId: replyVoteData.replyId,
					userId: replyVoteData.userId,
					discussionId: replyVoteData.discussionId,
				})) as unknown as ReplyVote;

				if (existingReplyVote) {
					return res.status(400).json({ error: "Reply vote already exists!" });
				}

				const newReplyVoteState = await discussionReplyVotesCollection
					.findOneAndUpdate(
						{
							replyId: replyVoteData.replyId,
							userId: replyVoteData.userId,
							discussionId: replyVoteData.discussionId,
						},
						{ $set: replyVoteData },
						{ upsert: true }
					)
					.catch((error) => {
						return res.status(500).json({
							error:
								"Mongo(API): Creating new reply vote error\n" + error.message,
						});
					});

				const newDiscussionReplyStateVoted = await discussionRepliesCollection
					.updateOne(
						{
							id: replyVoteData.replyId,
						},
						{
							$inc: {
								numberOfVotes: 1,
								numberOfUpVotes: replyVoteData.voteValue === 1 ? 1 : 0,
								numberOfDownVotes: replyVoteData.voteValue === -1 ? 1 : 0,
							},
						}
					)
					.catch((error) => {
						return res.status(500).json({
							error:
								"Mongo(API): Updating discussion reply error\n" + error.message,
						});
					});

				return res.status(200).json({
					newReplyVoteState,
					newDiscussionReplyStateVoted,
					voteSuccess: newReplyVoteState ? newReplyVoteState.ok === 1 : false,
				});

				break;
			}

			case "PUT": {
				if (!replyVoteData) {
					return res.status(400).json({ error: "No reply vote data provided!" });
				}

				if (replyVoteData.userId !== userData.uid) {
					return res.status(401).json({ error: "Unauthorized" });
				}

				if (replyVoteData.voteValue !== 1 && replyVoteData.voteValue !== -1) {
					return res.status(400).json({ error: "Invalid vote value" });
				}

				const existingReplyVote = (await discussionReplyVotesCollection.findOne({
					replyId: replyVoteData.replyId,
					userId: replyVoteData.userId,
					discussionId: replyVoteData.discussionId,
				})) as unknown as ReplyVote;

				if (!existingReplyVote) {
					return res.status(400).json({ error: "Reply vote does not exist!" });
				}

				if (existingReplyVote.voteValue === replyVoteData.voteValue) {
					return res.status(400).json({ error: "Reply vote already exists!" });
				}

				const newReplyVoteState = await discussionReplyVotesCollection
					.findOneAndUpdate(
						{
							userId: replyVoteData.userId,
							replyId: replyVoteData.replyId,
							discussionId: replyVoteData.discussionId,
						},
						{ $set: replyVoteData }
					)
					.catch((error) => {
						return res.status(500).json({
							error: "Mongo(API): Updating reply vote error\n" + error.message,
						});
					});

				const newDiscussionReplyStateVoted = await discussionRepliesCollection
					.updateOne(
						{
							id: replyVoteData.replyId,
						},
						{
							$set: {
								updatedAt: replyVoteData.updatedAt,
							},
							$inc: {
								numberOfUpVotes: replyVoteData.voteValue === 1 ? 1 : -1,
								numberOfDownVotes: replyVoteData.voteValue === -1 ? 1 : -1,
							},
						}
					)
					.catch((error) => {
						return res.status(500).json({
							error:
								"Mongo(API): Updating discussion reply error\n" + error.message,
						});
					});

				return res.status(200).json({
					voteChanged: newReplyVoteState ? newReplyVoteState.ok === 1 : false,
				});

				break;
			}

			case "DELETE": {
				if (!replyVoteData) {
					return res.status(400).json({ error: "No reply vote data provided!" });
				}

				if (userAPI.userId !== replyVoteData.userId) {
					return res.status(401).json({ error: "Unauthorized" });
				}

				const deletedReplyVoteState = await discussionReplyVotesCollection
					.deleteOne({
						userId: replyVoteData.userId,
						replyId: replyVoteData.replyId,
						discussionId: replyVoteData.discussionId,
					})
					.catch((error) => {
						return res.status(500).json({
							error: "Mongo(API): Deleting reply vote error\n" + error.message,
						});
					});

				const updatedDiscussionReplyStateVoted =
					await discussionRepliesCollection
						.updateOne(
							{
								id: replyVoteData.replyId,
							},
							{
								$inc: {
									numberOfVotes: -1,
									numberOfUpVotes: replyVoteData.voteValue === 1 ? -1 : 0,
									numberOfDownVotes: replyVoteData.voteValue === -1 ? -1 : 0,
								},
							}
						)
						.catch((error) => {
							return res.status(500).json({
								error:
									"Mongo(API): Updating discussion reply error\n" +
									error.message,
							});
						});

				return res.status(200).json({
					message: deletedReplyVoteState ? "Vote Deleted" : "Vote Not deleted",
					voteDeleted: deletedReplyVoteState
						? deletedReplyVoteState.acknowledged
						: false,
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
