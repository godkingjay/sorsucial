import { GroupMemberData } from "@/atoms/groupAtom";
import groupDb from "@/lib/db/groupDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { GroupMember } from "@/lib/interfaces/group";
import { SiteUser } from "@/lib/interfaces/user";
import { APIEndpointGroupMembersGroupParams } from "@/lib/types/api";
import { Document, WithId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { apiKeysCollection, usersCollection } = await userDb();
		const { groupMembersCollection } = await groupDb();

		const {
			apiKey,
			userId,
			groupId,
			roles: rawRoles = ["member"],
			lastIndex = "-1",
			fromAccepted = new Date().toISOString(),
			fromRequested = new Date().toISOString(),
			fromUpdated = new Date().toISOString(),
			fromRejected = new Date().toISOString(),
			sortBy = "accepted-desc",
			limit = 10,
		}: APIEndpointGroupMembersGroupParams = req.body || req.query;

		const roles = typeof rawRoles === "string" ? JSON.parse(rawRoles) : rawRoles;

		// if (!apiKey) {
		// 	return res
		// 		.status(400)
		// 		.json({ message: "Bad Request(400): API key is missing." });
		// }

		// if (!apiKeysCollection) {
		// 	return res.status(500).json({
		// 		message:
		// 			"Internal Server Error(500): Unable to connect to the API keys database.",
		// 	});
		// }

		// if (!usersCollection) {
		// 	return res.status(500).json({
		// 		error:
		// 			"Internal Server Error(500): Unable to connect to the Users database.",
		// 	});
		// }

		// if (!groupMembersCollection) {
		// 	return res.status(500).json({
		// 		error:
		// 			"Internal Server Error(500): Unable to connect to the Groups database.",
		// 	});
		// }

		// const userAPI = (await apiKeysCollection.findOne({
		// 	"keys.key": apiKey,
		// })) as unknown as SiteUserAPI;

		// if (!userAPI) {
		// 	return res
		// 		.status(401)
		// 		.json({ error: "Unauthorized(401): Invalid API key!" });
		// }

		// const userData = (await usersCollection.findOne({
		// 	uid: userId,
		// })) as unknown as SiteUser;

		// if (!userData) {
		// 	return res.status(404).json({ error: "Not Found(404): Invalid user ID!" });
		// }

		// if (userAPI.userId !== userData.uid) {
		// 	return res
		// 		.status(403)
		// 		.json({ error: "Forbidden(403): Invalid user ID pr API Key!" });
		// }

		switch (req.method) {
			case "GET": {
				let members: WithId<Document>[] = [];

				try {
					switch (sortBy) {
						case "accepted-desc": {
							members = await getSortByAccepted({
								groupId,
								roles,
								sortBy,
								fromAccepted,
								limit,
							});

							break;
						}

						case "requested-desc": {
							members = await getSortByRequested({
								groupId,
								roles,
								sortBy,
								fromRequested,
								limit,
							});

							break;
						}

						default: {
							return res
								.status(400)
								.json({ message: "Error 400: Bad Request." });
							break;
						}
					}
				} catch (error: any) {
					return res
						.status(500)
						.json({ message: "Error 500: Internal Server Error." });
				}

				members = members || [];

				const membersData = await Promise.all(
					members.map(async (memberDoc) => {
						const member = memberDoc as unknown as GroupMember;
						const user = (await usersCollection.findOne({
							uid: member.userId,
						})) as unknown as SiteUser;

						return {
							member,
							user: user || null,
							index: {
								[sortBy + `-${groupId}` + (roles ? `-${roles.join("_")}` : "")]:
									(typeof lastIndex === "string"
										? parseInt(lastIndex)
										: lastIndex) +
									members.indexOf(memberDoc) +
									1,
							},
						} as Partial<GroupMemberData>;
					})
				);

				return res.status(200).json({
					members: membersData,
				});

				break;
			}

			default: {
				return res
					.status(405)
					.json({ message: "Error 405: Method Not Allowed." });
				break;
			}
		}
	} catch (error: any) {
		return res
			.status(500)
			.json({ message: "Error 500: Internal Server Error." });
	}
}

const getSortByAccepted = async ({
	groupId,
	roles,
	fromAccepted,
	sortBy,
	limit = 10,
}: Pick<
	APIEndpointGroupMembersGroupParams,
	"groupId" | "roles" | "fromAccepted" | "sortBy" | "limit"
>) => {
	const { groupMembersCollection } = await groupDb();

	let query: any = {
		groupId,
		roles: {
			$all: roles,
		},
		acceptedAt: {
			$lt:
				typeof fromAccepted === "string"
					? fromAccepted
					: fromAccepted?.toISOString(),
		},
	};

	return groupMembersCollection
		? await groupMembersCollection
				.find(query)
				.sort({
					acceptedAt: -1,
				})
				.limit(typeof limit === "string" ? parseInt(limit) : limit)
				.toArray()
		: [];
};

const getSortByRequested = async ({
	groupId,
	roles,
	fromRequested,
	sortBy,
	limit = 10,
}: Pick<
	APIEndpointGroupMembersGroupParams,
	"groupId" | "roles" | "fromRequested" | "sortBy" | "limit"
>) => {
	const { groupMembersCollection } = await groupDb();

	let query: any = {
		groupId,
		roles: {
			$all: roles,
		},
		requestedAt: {
			$lt:
				typeof fromRequested === "string"
					? fromRequested
					: fromRequested?.toISOString(),
		},
	};

	return groupMembersCollection
		? await groupMembersCollection
				.find(query)
				.sort({
					requestedAt: -1,
				})
				.limit(typeof limit === "string" ? parseInt(limit) : limit)
				.toArray()
		: [];
};
