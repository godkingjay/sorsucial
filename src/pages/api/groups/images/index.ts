import groupDb from "@/lib/db/groupDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { GroupImage } from "@/lib/interfaces/group";
import { SiteUser } from "@/lib/interfaces/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { apiKeysCollection, usersCollection } = await userDb();

		const { groupsCollection, groupImagesCollection } = await groupDb();

		const {
			apiKey,
			type,
			groupImageData: rawGroupImageData,
		}: Partial<{
			apiKey: string;
			type: GroupImage["type"];
			groupImageData: GroupImage | string;
		}> = req.body || req.query;

		const groupImageData: GroupImage =
			typeof rawGroupImageData === "string"
				? JSON.parse(rawGroupImageData)
				: rawGroupImageData;

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

		if (!groupsCollection || !groupImagesCollection) {
			res.status(500).json({
				error: "Cannot connect with the Groups Database!",
			});
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			res.status(400).json({ error: "Invalid API key" });
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		if (!userData) {
			res.status(400).json({ error: "Invalid user" });
		}

		switch (req.method) {
			case "POST": {
				if (!type) {
					res.status(400).json({ error: "No image type provided" });
				}

				if (!groupImageData) {
					res.status(400).json({ error: "No image data provided" });
				}

				const newGroupImageState = await groupImagesCollection
					.insertOne({
						...groupImageData,
					})
					.catch((error) => {
						res.status(400).json({
							error: `Error inserting new group image: ${error.message}`,
						});
					});

				const newGroupState = await groupsCollection
					.updateOne(
						{
							id: groupImageData.groupId,
						},
						{
							$set: {
								[type as string]: groupImageData,
								updateAt: groupImageData.updatedAt,
							},
						}
					)
					.catch((error) => {
						res
							.status(400)
							.json({ error: `Error updating group: ${error.message}` });
					});

				res.status(200).json({
					groupImageData,
				});
				break;
			}

			default: {
				res.status(400).json({ error: "Invalid method" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
