import discussionDb from "@/lib/db/discussionDb";
import { DiscussionVote } from "./../../../lib/interfaces/discussion";
import { SiteDiscussion } from "@/lib/interfaces/discussion";
import { SiteUser } from "@/lib/interfaces/user";
import { NextApiRequest, NextApiResponse } from "next";
import userDb from "@/lib/db/userDb";
import { DiscussionData } from "@/atoms/discussionAtom";
import { SiteUserAPI } from "@/lib/interfaces/api";
import {
	APIEndpointDiscussionsParams,
	QueryDiscussionsSortBy,
} from "@/lib/types/api";
import { Document, WithId } from "mongodb";

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
			discussionType = "discussion" as SiteDiscussion["discussionType"],
			privacy = "public" as SiteDiscussion["privacy"],
			groupId = undefined,
			tags = undefined,
			creatorId = undefined,
			creator = undefined,
			isOpen = undefined,
			lastIndex = "-1",
			fromVotes = Number.MAX_SAFE_INTEGER.toString(),
			fromUpVotes = Number.MAX_SAFE_INTEGER.toString(),
			fromDownVotes = Number.MAX_SAFE_INTEGER.toString(),
			fromReplies = Number.MAX_SAFE_INTEGER.toString(),
			fromDate = new Date().toISOString(),
			sortBy = "latest",
			limit = "10",
		}: APIEndpointDiscussionsParams = req.body || req.query;

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

		if (!discussionsCollection || !discussionVotesCollection) {
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
			return res.status(401).json({ error: "invalid User" });
		}

		switch (req.method) {
			case "GET": {
				if (!discussionType) {
					return res.status(400).json({ error: "No discussion type provided"! });
				}

				let discussions: WithId<Document>[] = [];

				switch (sortBy) {
					case "latest": {
						discussions = await getSortByLatest({
							discussionType,
							privacy,
							isOpen,
							creatorId,
							groupId,
							fromDate,
							limit,
						});

						break;
					}

					default: {
						return res
							.status(400)
							.json({ error: "Invalid sort by option provided!" });
						break;
					}
				}

				discussions = discussions || [];

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
							index: {
								[sortBy +
								(discussionType ? `-${discussionType}` : "") +
								(privacy ? `-${privacy}` : "") +
								(groupId ? `-${groupId}` : "") +
								(creatorId ? `-${creatorId}` : "") +
								(creator ? `-${creator}` : "") +
								(tags ? `-${tags}` : "") +
								(isOpen !== undefined ? `-${isOpen ? "open" : "close"}` : "")]:
									(typeof lastIndex === "string"
										? parseInt(lastIndex)
										: lastIndex) +
									discussions.indexOf(discussionDoc) +
									1,
							},
						} as Partial<DiscussionData>;
					})
				);

				if (discussionsData.length) {
					return res.status(200).json({ discussions: discussionsData });
				} else {
					return res.status(200).json({ discussions: [] });
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
				return res.status(405).json({ error: "Method not allowed!" });
				break;
			}
		}
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
}

const getSortByLatest = async ({
	discussionType,
	privacy,
	isOpen,
	creatorId,
	groupId,
	fromDate,
	limit = 10,
}: Partial<APIEndpointDiscussionsParams>) => {
	const { discussionsCollection } = await discussionDb();

	let query: any = {
		discussionType: discussionType,
		privacy: privacy,
		createdAt: {
			$lt: fromDate,
		},
	};

	if (isOpen !== undefined) {
		query.isOpen = isOpen;
	}

	if (creatorId) {
		query.creatorId = creatorId;
	}

	if (groupId) {
		query.groupId = groupId;
	}

	return discussionsCollection
		? await discussionsCollection
				.find(query)
				.sort({
					createdAt: -1,
				})
				.limit(typeof limit === "string" ? parseInt(limit) : limit)
				.toArray()
		: [];
};
