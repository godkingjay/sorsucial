import groupDb from "@/lib/db/groupDb";
import tagDb from "@/lib/db/tagDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { GroupMember, SiteGroup } from "@/lib/interfaces/group";
import { Tag } from "@/lib/interfaces/tag";
import { SiteUser } from "@/lib/interfaces/user";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { apiKeysCollection, usersCollection } = await userDb();
		const { groupsCollection, groupMembersCollection, groupImagesCollection } =
			await groupDb();
		const { tagsCollection } = await tagDb();

		const { apiKey, groupData: rawGroupData } = req.body || req.query;

		const groupData: SiteGroup =
			typeof rawGroupData === "string" ? JSON.parse(rawGroupData) : rawGroupData;

		if (!apiKey) {
			res.status(400).json({
				error: "No API Key provided!",
			});
		}

		if (!apiKeysCollection) {
			res.status(500).json({
				error: "Cannot connect with the API Keys Database!",
			});
		}

		if (!usersCollection) {
			res.status(500).json({
				error: "Cannot connect with the Users Database!",
			});
		}

		if (!groupsCollection || !groupMembersCollection || !groupImagesCollection) {
			res.status(500).json({
				error: "Cannot connect with the Groups Database!",
			});
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			res.status(500).json({ error: "Invalid API key" });
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		if (!userData) {
			res.status(500).json({ error: "Invalid user" });
		}

		switch (req.method) {
			case "POST": {
				if (!groupData) {
					res.status(400).json({ error: "No group data provided!" });
				}

				if (groupData.creatorId !== userAPI.userId) {
					res
						.status(403)
						.json({ error: "You are not the creator of this group!" });
				}

				const objectId = new ObjectId();
				const objectIdString = objectId.toHexString();

				groupData.id = objectIdString;

				const newGroupState = await groupsCollection
					.insertOne({
						...groupData,
						_id: objectId,
					} as Partial<SiteGroup>)
					.catch((error: any) => {
						res.status(500).json({
							error: `Mongo: Creating group document ${objectIdString} failed:\n${error.message}`,
						});
					});

				groupData.groupTags?.map(async (tag) => {
					await tagsCollection.updateOne(
						{
							name: tag,
						},
						{
							$inc: {
								total: 1,
								groups: 1,
							} as Partial<Tag>,
							$set: {
								updatedAt: groupData.createdAt,
							} as Partial<Tag>,
							$setOnInsert: {
								createdAt: groupData.createdAt,
							} as Partial<Tag>,
						},
						{
							upsert: true,
						}
					);
				});

				const newGroupMember: Partial<GroupMember> = {
					userId: groupData.creatorId,
					groupId: objectIdString,
					role: "owner",
					acceptedAt: groupData.createdAt,
					updatedAt: groupData.createdAt,
					requestedAt: groupData.createdAt,
				};

				const newGroupMemberState = await groupMembersCollection
					.insertOne(newGroupMember)
					.catch((error: any) => {
						res.status(500).json({
							error: `Mongo: Creating group member document ${objectIdString} failed:\n${error.message}`,
						});
					});

				res.status(200).json({
					message: "Group created successfully!",
					newGroupState,
					groupMemberData: newGroupMember,
					groupData,
				});

				break;
			}

			default: {
				res.status(405).json({
					message: `Method ${req.method} Not Allowed`,
					error: `Method ${req.method} Not Allowed`,
				});

				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({
			message: "Internal Server Error",
			error: error.message,
		});
	}
}
