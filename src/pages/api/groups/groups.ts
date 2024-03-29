import { GroupData } from "@/atoms/groupAtom";
import {
	APIEndpointGroupsParams,
	QueryGroupsSortBy,
} from "./../../../lib/types/api";
import groupDb from "@/lib/db/groupDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { GroupMember, SiteGroup } from "@/lib/interfaces/group";
import { SiteUser } from "@/lib/interfaces/user";
import { Document, WithId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { apiKeysCollection, usersCollection } = await userDb();

		const { groupsCollection, groupMembersCollection } = await groupDb();

		const {
			apiKey,
			userId,
			privacy = undefined,
			tags = undefined,
			userPageId = undefined,
			creatorId = undefined,
			creator = undefined,
			lastIndex = "-1",
			fromMembers = Number.MAX_SAFE_INTEGER.toString(),
			fromPosts = Number.MAX_SAFE_INTEGER.toString(),
			fromDiscussions = Number.MAX_SAFE_INTEGER.toString(),
			fromDate = new Date().toISOString(),
			sortBy = "latest" as QueryGroupsSortBy,
			limit = "10",
		}: Partial<APIEndpointGroupsParams> = req.body || req.query;

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

		if (!groupsCollection || !groupMembersCollection) {
			return res
				.status(500)
				.json({ error: "Cannot connect with the Groups Database!" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			return res.status(401).json({ error: "Invalid API key!" });
		}

		const userData = (await usersCollection.findOne({
			uid: userId,
		})) as unknown as SiteUser;

		if (!userData) {
			return res.status(401).json({ error: "Invalid user ID!" });
		}

		switch (req.method) {
			case "GET": {
				let groups: WithId<Document>[] = [];
				try {
					switch (sortBy) {
						case "latest": {
							groups = await getSortByLatest({
								creatorId,
								privacy,
								fromDate,
								limit,
							});
							break;
						}

						default: {
							return res.status(400).json({ error: "Invalid sort by!" });
							break;
						}
					}
				} catch (error: any) {
					return res
						.status(500)
						.json({ error: "Error getting groups:\n" + error.message });
				}

				groups = groups || [];

				const groupsData = await Promise.all(
					groups.map(async (groupDoc) => {
						const group = groupDoc as unknown as SiteGroup;
						const userJoinData = (await groupMembersCollection.findOne({
							groupId: group.id,
							userId: userId,
						})) as unknown as GroupMember;
						const creatorData = (await usersCollection.findOne({
							uid: group.creatorId,
						})) as unknown as SiteUser;

						return {
							group,
							creator: creatorData || null,
							userJoin: userJoinData || null,
							index: {
								[sortBy +
								(privacy ? `-${privacy}` : "") +
								(userPageId ? `-${userPageId}` : "") +
								(creatorId ? `-${creatorId}` : "") +
								(creator ? `-${creator}` : "") +
								(tags ? `-${tags}` : "")]:
									(typeof lastIndex === "string"
										? parseInt(lastIndex)
										: lastIndex) +
									groups.indexOf(groupDoc) +
									1,
							},
						} as Partial<GroupData>;
					})
				);

				if (groupsData.length) {
					return res.status(200).json({ groups: groupsData });
				} else {
					return res.status(200).json({ groups: [] });
				}

				break;
			}

			default: {
				return res.status(405).json({ error: "Method not allowed!" });
				break;
			}
		}
	} catch (error: any) {
		return res.status(500).json({ message: error.message, error: error });
	}
}

const getSortByLatest = async ({
	creatorId,
	privacy,
	fromDate,
	limit = 10,
}: Partial<APIEndpointGroupsParams>) => {
	const { groupsCollection } = await groupDb();

	let query: any = {
		createdAt: {
			$lt: typeof fromDate === "string" ? fromDate : fromDate?.toISOString(),
		},
	};

	if (privacy) {
		query.privacy = privacy;
	}

	if (creatorId) {
		query.creatorId = creatorId;
	}

	return groupsCollection
		? await groupsCollection
				.find(query)
				.sort({
					createdAt: -1,
				})
				.limit(typeof limit === "string" ? parseInt(limit) : limit)
				.toArray()
		: [];
};
