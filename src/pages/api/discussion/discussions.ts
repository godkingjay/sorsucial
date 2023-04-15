import { DiscussionVote } from "./../../../lib/interfaces/discussion";
import { SiteDiscussion } from "@/lib/interfaces/discussion";
import { SiteUser } from "@/lib/interfaces/user";
import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const usersCollection = db.collection("users");
		const discussionsCollection = db.collection("discussions");
		const discussionVotesCollection = db.collection("discussion-votes");

		switch (req.method) {
			case "GET": {
				const { getUserId, getDiscussionType, getFromDate } = req.query;

				if (!getDiscussionType) {
					res.status(505).json({ error: "No discussion type provided"! });
					return;
				}

				const discussions = getFromDate
					? await discussionsCollection
							.find({
								discussionType: getDiscussionType,
								createdAt: {
									$lt: getFromDate,
								},
							})
							.sort({
								createdAt: -1,
							})
							.limit(10)
							.toArray()
					: await discussionsCollection
							.find({
								discussionType: getDiscussionType,
							})
							.sort({
								createdAt: -1,
							})
							.limit(10)
							.toArray();

				const discussionsData = await Promise.all(
					discussions.map(async (discussionDoc) => {
						const discussion = discussionDoc as unknown as SiteDiscussion;
						const creatorData = (await usersCollection.findOne({
							uid: discussion.creatorId,
						})) as unknown as SiteUser;
						const userVoteData = (await discussionVotesCollection.findOne({
							discussionId: discussion.id,
							userId: getUserId,
						})) as unknown as DiscussionVote;

						return {
							discussion,
							creator: creatorData,
							userVote: userVoteData,
						};
					})
				);

				if (discussionsData.length) {
					res.status(200).json({ discussions: discussionsData });
				} else {
					res.status(200).json({ discussions: [] });
				}

				break;
			}

			/**-------------------------------------------------------------------------------------------
			 *
			 * & ██████╗ ███████╗███████╗ █████╗ ██╗   ██╗██╗  ████████╗
			 * & ██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██║  ╚══██╔══╝
			 * & ██║  ██║█████╗  █████╗  ███████║██║   ██║██║     ██║
			 * & ██║  ██║██╔══╝  ██╔══╝  ██╔══██║██║   ██║██║     ██║
			 * & ██████╔╝███████╗██║     ██║  ██║╚██████╔╝███████╗██║
			 * & ╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝
			 *
			 * -------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * -------------------------------------------------------------------------------------------
			 */
			default: {
				res.status(405).json({ error: "Method not allowed!" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
