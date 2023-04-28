import { GroupData } from "@/atoms/groupAtom";
import { QueryGroupsSortBy } from "./../../../lib/types/api";
import groupDb from "@/lib/db/groupDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { GroupMember, SiteGroup } from "@/lib/interfaces/group";
import { SiteUser } from "@/lib/interfaces/user";
import { Collection, Document, WithId } from "mongodb";
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
			privacy = "public" as SiteGroup["privacy"],
			lastIndex = "-1",
			fromMember = Number.MAX_SAFE_INTEGER.toString(),
			fromDate = new Date().toISOString(),
			sortBy = "latest" as QueryGroupsSortBy,
			limit = "10",
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

		if (!groupsCollection || !groupMembersCollection) {
			res
				.status(500)
				.json({ error: "Cannot connect with the Groups Database!" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			res.status(401).json({ error: "Invalid API key!" });
		}

		const userData = (await usersCollection.findOne({
			uid: userId,
		})) as unknown as SiteUser;

		if (!userData) {
			res.status(401).json({ error: "Invalid user ID!" });
		}

		switch (req.method) {
			case "GET": {
				let groups: WithId<Document>[] = [];
				try {
					switch (sortBy) {
						case "latest": {
							groups = await getSortByLatest({
								privacy: privacy,
								fromDate:
									typeof fromDate === "string"
										? fromDate
										: ((typeof fromDate as string) || Date) === Date
										? fromDate.toISOString()
										: new Date().toISOString(),
								limit: limit,
							});
							break;
						}

						default: {
							res.status(400).json({ error: "Invalid sort by!" });
							break;
						}
					}
				} catch (error: any) {
					res
						.status(500)
						.json({ error: "Error getting groups:\n" + error.message });
					return;
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
								[sortBy]: parseInt(lastIndex) + groups.indexOf(groupDoc) + 1,
							},
						} as Partial<GroupData>;
					})
				);

				if (groupsData.length) {
					res.status(200).json({ groups: groupsData });
				} else {
					res.status(200).json({ groups: [] });
				}

				break;
			}

			default: {
				res.status(405).json({ error: "Method not allowed!" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({ message: error.message, error: error });
	}
}

const getSortByLatest = async ({
	privacy = "public" as SiteGroup["privacy"],
	fromDate = new Date().toISOString() as string,
	limit = "10",
}) => {
	const { groupsCollection } = await groupDb();

	return groupsCollection
		? await groupsCollection
				.find({
					privacy: privacy,
					createdAt: {
						$lt: fromDate,
					},
				})
				.sort({
					createdAt: -1,
				})
				.limit(parseInt(limit as string))
				.toArray()
		: [];
};
