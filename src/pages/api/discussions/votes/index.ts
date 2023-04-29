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
		const { apiKeysCollection } = await userDb();
		const { discussionsCollection, discussionVotesCollection } =
			await discussionDb();

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
			return res.status(400).json({ error: "No API key provided" });
		}

		if (!apiKeysCollection) {
			return res.status(500).json({ error: "Database connection error" });
		}

		if (!discussionsCollection || !discussionVotesCollection) {
			return res.status(500).json({ error: "Database connection error" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			return res.status(401).json({ error: "Invalid API key" });
		}

		switch (req.method) {
			case "POST": {
				if (!discussionVoteData) {
					return res
						.status(400)
						.json({ error: "No discussion vote data provided" });
				}

				if (discussionVoteData.userId !== userAPI.userId) {
					return res
						.status(401)
						.json({ error: "User ID does not match API key" });
				}

				if (voteType !== "upVote" && voteType !== "downVote") {
					return res.status(400).json({ error: "Invalid vote type" });
				}

				const existingDiscussionVote = await discussionVotesCollection.findOne({
					userId: discussionVoteData.userId,
					discussionId: discussionVoteData.discussionId,
				});

				if (existingDiscussionVote) {
					return res
						.status(409)
						.json({ error: "User has already voted on this discussion" });
				}

				try {
					const newDiscussionVoteState =
						await discussionVotesCollection.findOneAndUpdate(
							{
								userId: discussionVoteData.userId,
								discussionId: discussionVoteData.discussionId,
							},
							{
								$set: discussionVoteData,
							},
							{
								upsert: true,
							}
						);

					const update =
						voteType === "upVote"
							? { $inc: { numberOfVotes: 1, numberOfUpVotes: 1 } }
							: { $inc: { numberOfVotes: 1, numberOfDownVotes: 1 } };

					await discussionsCollection.updateOne(
						{
							id: discussionVoteData.discussionId,
						},
						update
					);

					return res.status(201).json({
						message: "Discussion vote created",
						voteSuccess: newDiscussionVoteState
							? newDiscussionVoteState.ok
							: false,
					});
				} catch (error) {
					console.error(error);
					return res.status(500).json({
						error: "An error occurred while processing your request",
					});
				}

				break;
			}

			case "GET": {
				if (!userId || !discussionId) {
					return res
						.status(500)
						.json({ error: "No user ID or discussion ID provided" });
				}

				const discussionVote = await discussionVotesCollection.findOne({
					userId,
					discussionId,
				});

				return res.status(200).json({
					message: "Discussion vote retrieved",
					userVote: discussionVote,
				});
				break;
			}

			case "PUT": {
				if (!discussionVoteData) {
					return res
						.status(400)
						.json({ error: "No discussion vote data provided" });
				}

				if (discussionVoteData.userId !== userAPI.userId) {
					return res
						.status(401)
						.json({ error: "User ID does not match API key" });
				}

				if (voteType !== "upVote" && voteType !== "downVote") {
					return res.status(400).json({ error: "Invalid vote type" });
				}

				const existingDiscussionVote = (await discussionVotesCollection.findOne({
					userId: discussionVoteData.userId,
					discussionId: discussionVoteData.discussionId,
				})) as unknown as DiscussionVote;

				if (!existingDiscussionVote) {
					return res
						.status(500)
						.json({ error: "User has not voted on this discussion" });
				}

				if (discussionVoteData.voteValue === existingDiscussionVote.voteValue) {
					return res.status(500).json({
						error:
							"User has already voted on this discussion with this vote value",
					});
				}

				try {
					const updateDiscussionVoteState =
						await discussionVotesCollection.findOneAndUpdate(
							{
								userId: discussionVoteData.userId,
								discussionId: discussionVoteData.discussionId,
							},
							{
								$set: discussionVoteData,
							}
						);

					if (voteType === "upVote") {
						await discussionsCollection.findOneAndUpdate(
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
						);
					} else {
						await discussionsCollection.findOneAndUpdate(
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
						);
					}

					return res.status(200).json({
						message: "Discussion vote updated",
						voteChanged: updateDiscussionVoteState
							? updateDiscussionVoteState.ok
							: false,
					});
				} catch (error: any) {
					console.error(error);
					return res.status(500).json({
						error: "An error occurred while processing your request",
					});
				}

				break;
			}

			case "DELETE": {
				if (!discussionId) {
					return res.status(400).json({ error: "Discussion ID is missing" });
				}

				if (!userId) {
					return res.status(400).json({ error: "User ID is missing" });
				}

				if (userId !== userAPI.userId) {
					return res
						.status(403)
						.json({ error: "User ID does not match API key" });
				}

				try {
					const discussionVote = await discussionVotesCollection.findOne({
						discussionId,
						userId,
					});

					if (!discussionVote) {
						return res.status(404).json({ error: "Discussion vote not found" });
					}

					const deleteDiscussionVoteState =
						await discussionVotesCollection.deleteOne({
							discussionId,
							userId,
						});

					if (discussionVote.voteValue === 1) {
						await discussionsCollection.updateOne(
							{ id: discussionVote.discussionId },
							{ $inc: { numberOfVotes: -1, numberOfUpVotes: -1 } }
						);
					} else {
						await discussionsCollection.updateOne(
							{ id: discussionVote.discussionId },
							{ $inc: { numberOfVotes: -1, numberOfDownVotes: -1 } }
						);
					}

					return res.status(200).json({
						message: "Discussion vote deleted",
						voteDeleted: deleteDiscussionVoteState.acknowledged,
					});
				} catch (error) {
					console.error(error);
					return res.status(500).json({
						error: "Internal server error",
					});
				}

				break;
			}

			default: {
				return res.status(500).json({ error: "Invalid request method" });
				break;
			}
		}
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
}
