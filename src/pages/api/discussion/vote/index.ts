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
			discussionVoteId,
			voteType,
		}: {
			apiKey: string;
			discussionVoteData: DiscussionVote;
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
					discussionVoteState: newDiscussionVoteState
						? newDiscussionVoteState.acknowledged
						: false,
				});

				break;
			}

			case "PUT": {
				break;
			}

			case "DELETE": {
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
