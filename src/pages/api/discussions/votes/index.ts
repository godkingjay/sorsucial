import discussionDb from "@/lib/db/discussionDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { DiscussionVote } from "@/lib/interfaces/discussion";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { discussionsCollection, discussionVotesCollection } =
			await discussionDb();
		const { apiKeysCollection } = await userDb();

		const {
			apiKey,
			discussionVoteData,
			userId,
			discussionId,
			voteType,
		}: {
			apiKey: string;
			discussionVoteData: Partial<DiscussionVote>;
			userId: string;
			discussionId: string;
			discussionVoteId: string;
			voteType: "upVote" | "downVote";
		} = req.body || req.query;

		if (!apiKey) {
			res.status(500).json({ error: "No API key provided" });
			return;
		}

		if (!discussionsCollection || !discussionVotesCollection) {
			res.status(500).json({ error: "No database connection" });
			return;
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			res.status(500).json({ error: "Invalid API key" });
			return;
		}

		switch (req.method) {
			case "POST": {
				if (!discussionVoteData) {
					res.status(500).json({ error: "No discussion vote data provided" });
				}

				if (discussionVoteData.userId !== userAPI.userId) {
					res.status(500).json({ error: "User ID does not match API key" });
				}

				if (voteType !== "upVote" && voteType !== "downVote") {
					res.status(500).json({ error: "Invalid vote type" });
				}

				const newDiscussionVoteState = await discussionVotesCollection.insertOne(
					discussionVoteData
				);

				if (voteType === "upVote") {
					await discussionsCollection
						.updateOne(
							{
								id: discussionVoteData.discussionId,
							},
							{
								$inc: {
									numberOfVotes: 1,
									numberOfUpVotes: 1,
								},
							}
						)
						.catch((error: any) => {
							res.status(500).json({
								error:
									"Mongo(API): Updating Discussion Document Error:" +
									error.message,
							});
						});
				} else {
					await discussionsCollection
						.updateOne(
							{
								id: discussionVoteData.discussionId,
							},
							{
								$inc: {
									numberOfVotes: 1,
									numberOfDownVotes: 1,
								},
							}
						)
						.catch((error: any) => {
							res.status(500).json({
								error:
									"Mongo(API): Updating Discussion Document Error:" +
									error.message,
							});
						});
				}

				res.status(200).json({
					message: "Discussion vote created",
					voteSuccess: newDiscussionVoteState
						? newDiscussionVoteState.acknowledged
						: false,
				});

				break;
			}

			case "GET": {
				if (!userId || !discussionId) {
					res
						.status(500)
						.json({ error: "No user ID or discussion ID provided" });
				}

				const discussionVote = await discussionVotesCollection.findOne({
					userId,
					discussionId,
				});

				res.status(200).json({
					message: "Discussion vote retrieved",
					userVote: discussionVote,
				});
				break;
			}

			case "PUT": {
				if (!discussionVoteData) {
					res.status(400).json({ error: "No discussion vote data provided" });
				}

				if (discussionVoteData.userId !== userAPI.userId) {
					res.status(401).json({ error: "User ID does not match API key" });
				}

				if (voteType !== "upVote" && voteType !== "downVote") {
					res.status(400).json({ error: "Invalid vote type" });
				}

				const updateDiscussionVoteState =
					await discussionVotesCollection.updateOne(
						{
							userId: discussionVoteData.userId,
							discussionId: discussionVoteData.discussionId,
						},
						{
							$set: discussionVoteData,
						}
					);

				if (voteType === "upVote") {
					await discussionsCollection
						.updateOne(
							{
								id: discussionVoteData.discussionId,
							},
							{
								$set: {
									updatedAt: discussionVoteData.updatedAt,
								},
								$inc: {
									numberOfUpVotes: 1,
									numberOfDownVotes: -1,
								},
							}
						)
						.catch((error: any) => {
							res.status(500).json({
								error:
									"Mongo(API): Updating Discussion Document Error:" +
									error.message,
							});
						});
				} else {
					await discussionsCollection
						.updateOne(
							{
								id: discussionVoteData.discussionId,
							},
							{
								$set: {
									updatedAt: discussionVoteData.updatedAt,
								},
								$inc: {
									numberOfUpVotes: -1,
									numberOfDownVotes: 1,
								},
							}
						)
						.catch((error: any) => {
							res.status(500).json({
								error:
									"Mongo(API): Updating Discussion Document Error:" +
									error.message,
							});
						});
				}

				res.status(200).json({
					message: "Discussion vote updated",
					voteChanged: updateDiscussionVoteState
						? updateDiscussionVoteState.acknowledged
						: false,
				});

				break;
			}

			case "DELETE": {
				if (!discussionId) {
					res.status(500).json({ error: "No discussion ID provided" });
				}

				if (!userId) {
					res.status(500).json({ error: "No user ID provided" });
				}

				if (userId !== userAPI.userId) {
					res.status(500).json({ error: "User ID does not match API key" });
				}

				const discussionVote = (await discussionVotesCollection.findOne({
					discussionId,
					userId,
				})) as unknown as DiscussionVote;

				if (!discussionVote) {
					res.status(500).json({ error: "No discussion vote found" });
				}

				const deleteDiscussionVoteState = await discussionVotesCollection
					.deleteOne({
						discussionId,
						userId,
					})
					.catch((error: any) => {
						res.status(500).json({
							error:
								"Mongo(API): Deleting Discussion Vote Document Error:" +
								error.message,
						});
					});

				if (discussionVote.voteValue === 1) {
					await discussionsCollection
						.updateOne(
							{
								id: discussionVote.discussionId,
							},
							{
								$inc: {
									numberOfVotes: -1,
									numberOfUpVotes: -1,
								},
							}
						)
						.catch((error: any) => {
							res.status(500).json({
								error:
									"Mongo(API): Updating Discussion Document Error:" +
									error.message,
							});
						});
				} else {
					await discussionsCollection
						.updateOne(
							{
								id: discussionVote.discussionId,
							},
							{
								$inc: {
									numberOfVotes: -1,
									numberOfDownVotes: -1,
								},
							}
						)
						.catch((error: any) => {
							res.status(500).json({
								error:
									"Mongo(API): Updating Discussion Document Error:" +
									error.message,
							});
						});
				}

				res.status(200).json({
					message: "Discussion vote deleted",
					voteDeleted: deleteDiscussionVoteState
						? deleteDiscussionVoteState.acknowledged
						: false,
				});

				break;
			}

			default: {
				res.status(500).json({ error: "Invalid request method" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
