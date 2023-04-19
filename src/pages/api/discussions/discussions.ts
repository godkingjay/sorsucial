import discussionDb from "@/lib/db/discussionDb";
import { DiscussionVote } from "./../../../lib/interfaces/discussion";
import { SiteDiscussion } from "@/lib/interfaces/discussion";
import { SiteUser } from "@/lib/interfaces/user";
import { NextApiRequest, NextApiResponse } from "next";
import userDb from "@/lib/db/userDb";
import { DiscussionData } from "@/atoms/discussionAtom";
import { SiteUserAPI } from "@/lib/interfaces/api";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { apiKeysCollection, usersCollection } = await userDb();
		const { discussionsCollection, discussionVotesCollection } =
			await discussionDb();

		const {
			apiKey,
			userId,
			discussionType,
			privacy,
			isOpen,
			fromDate,
		}: {
			apiKey: string;
			userId: string;
			discussionType: SiteDiscussion["discussionType"];
			privacy: SiteDiscussion["privacy"];
			isOpen: boolean | string;
			fromDate: string;
		} = req.body || req.query;

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

		switch (req.method) {
			case "GET": {
				if (!discussionType) {
					res.status(505).json({ error: "No discussion type provided"! });
					return;
				}

				const discussions = fromDate
					? await discussionsCollection
							.find({
								discussionType: discussionType,
								privacy: privacy,
								isOpen: isOpen === "true" ? true : false,
								createdAt: {
									$lt: fromDate,
								},
							})
							.sort({
								createdAt: -1,
							})
							.limit(10)
							.toArray()
					: await discussionsCollection
							.find({
								discussionType: discussionType,
								privacy: privacy,
								isOpen: isOpen === "true" ? true : false,
							})
							.sort({
								createdAt: -1,
							})
							.limit(10)
							.toArray();

				const discussionsData: Partial<DiscussionData>[] = await Promise.all(
					discussions.map(async (discussionDoc) => {
						const discussion = discussionDoc as unknown as SiteDiscussion;
						const creatorData = (await usersCollection.findOne({
							uid: discussion.creatorId,
						})) as unknown as SiteUser;
						const userVoteData = (await discussionVotesCollection.findOne({
							discussionId: discussion.id,
							userId: userId,
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
