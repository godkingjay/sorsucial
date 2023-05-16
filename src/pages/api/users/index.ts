import { apiConfig } from "@/lib/api/apiConfig";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { SiteUser } from "@/lib/interfaces/user";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

/**------------------------------------------------------------------------------------------
 *
 * ~ ██╗   ██╗███████╗███████╗██████╗     ███████╗███╗   ██╗██████╗ ██████╗  ██████╗ ██╗███╗   ██╗████████╗
 * ~ ██║   ██║██╔════╝██╔════╝██╔══██╗    ██╔════╝████╗  ██║██╔══██╗██╔══██╗██╔═══██╗██║████╗  ██║╚══██╔══╝
 * ~ ██║   ██║███████╗█████╗  ██████╔╝    █████╗  ██╔██╗ ██║██║  ██║██████╔╝██║   ██║██║██╔██╗ ██║   ██║
 * ~ ██║   ██║╚════██║██╔══╝  ██╔══██╗    ██╔══╝  ██║╚██╗██║██║  ██║██╔═══╝ ██║   ██║██║██║╚██╗██║   ██║
 * ~ ╚██████╔╝███████║███████╗██║  ██║    ███████╗██║ ╚████║██████╔╝██║     ╚██████╔╝██║██║ ╚████║   ██║
 * ~  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝      ╚═════╝ ╚═╝╚═╝  ╚═══╝   ╚═╝
 *
 * ------------------------------------------------------------------------------------------
 *
 *
 *
 * ------------------------------------------------------------------------------------------
 */
/**
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 *
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { usersCollection, apiKeysCollection } = await userDb();
		const {
			apiKey,
			privateKey,
			userId,
			userData: rawUserData,
		} = req.body || req.query;

		const userData: SiteUser =
			typeof rawUserData === "string" ? JSON.parse(rawUserData) : rawUserData;

		if (!apiKey && !privateKey) {
			return res
				.status(400)
				.json({ error: "No API Key or Private key provided!" });
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

		const userAPI =
			((await apiKeysCollection.findOne({
				"keys.key": apiKey || "",
			})) as unknown as SiteUserAPI) || null;

		const currentUser =
			((await usersCollection.findOne({
				uid: userAPI?.userId || "",
			})) as unknown as SiteUser) || null;

		switch (req.method) {
			/**------------------------------------------------------------------------------------------
			 *
			 * *  ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗    ██╗   ██╗███████╗███████╗██████╗
			 * * ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝    ██║   ██║██╔════╝██╔════╝██╔══██╗
			 * * ██║     ██████╔╝█████╗  ███████║   ██║   █████╗      ██║   ██║███████╗█████╗  ██████╔╝
			 * * ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝      ██║   ██║╚════██║██╔══╝  ██╔══██╗
			 * * ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗    ╚██████╔╝███████║███████╗██║  ██║
			 * *  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝     ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
			 *
			 * ------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * ------------------------------------------------------------------------------------------
			 */
			case "POST": {
				if (!userData) {
					return res.status(400).json({ error: "No user provided" });
				}

				if (!privateKey || privateKey !== apiConfig.privateKey) {
					return res.status(401).json({ error: "Unauthorized" });
				}

				const newUserState = await usersCollection.insertOne(userData);

				const newAPIDate = new Date();

				const apiId = new ObjectId();

				const newUserAPIKey: Partial<SiteUserAPI> = {
					userId: userData.uid,
					keys: [
						{
							id: apiId.toHexString(),
							key: new ObjectId().toHexString(),
							keyType: "default",
							name: "User API",
							description: "",
							updatedAt: newAPIDate,
							createdAt: newAPIDate,
						},
					],
					updatedAt: newAPIDate,
					createdAt: newAPIDate,
				};

				const newUserAPIState = await apiKeysCollection.insertOne(newUserAPIKey);

				return res.status(200).json({ newUserState, newUser: userData });
				break;
			}

			/**------------------------------------------------------------------------------------------
			 *
			 * ^  ██████╗ ███████╗████████╗    ██╗   ██╗███████╗███████╗██████╗
			 * ^ ██╔════╝ ██╔════╝╚══██╔══╝    ██║   ██║██╔════╝██╔════╝██╔══██╗
			 * ^ ██║  ███╗█████╗     ██║       ██║   ██║███████╗█████╗  ██████╔╝
			 * ^ ██║   ██║██╔══╝     ██║       ██║   ██║╚════██║██╔══╝  ██╔══██╗
			 * ^ ╚██████╔╝███████╗   ██║       ╚██████╔╝███████║███████╗██║  ██║
			 * ^  ╚═════╝ ╚══════╝   ╚═╝        ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
			 *
			 * ------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * ------------------------------------------------------------------------------------------
			 */
			case "GET": {
				if (!userId) {
					return res.status(400).json({ error: "No user id provided" });
				}

				if (!userAPI) {
					return res.status(401).json({ error: "Unauthorized" });
				}

				const userData = await usersCollection.findOne({
					uid: userId,
				});

				return res.status(200).json({ userData });
				break;
			}

			/**------------------------------------------------------------------------------------------
			 *
			 * ? ███████╗██████╗ ██╗████████╗    ██╗   ██╗███████╗███████╗██████╗
			 * ? ██╔════╝██╔══██╗██║╚══██╔══╝    ██║   ██║██╔════╝██╔════╝██╔══██╗
			 * ? █████╗  ██║  ██║██║   ██║       ██║   ██║███████╗█████╗  ██████╔╝
			 * ? ██╔══╝  ██║  ██║██║   ██║       ██║   ██║╚════██║██╔══╝  ██╔══██╗
			 * ? ███████╗██████╔╝██║   ██║       ╚██████╔╝███████║███████╗██║  ██║
			 * ? ╚══════╝╚═════╝ ╚═╝   ╚═╝        ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
			 *
			 * ------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * ------------------------------------------------------------------------------------------
			 */
			case "PUT": {
				if (!userData || !userId) {
					return res.status(400).json({ error: "No user data provided" });
				}

				if (currentUser.uid !== userId) {
					if (!currentUser.roles.includes("admin")) {
						return res.status(401).json({ error: "Unauthorized!" });
					}
				}

				const updatedUserState = await usersCollection.findOneAndUpdate(
					{
						uid: userId,
					},
					{
						$set: {
							...userData,
							updatedAt: new Date().toISOString(),
						},
					},
					{
						returnDocument: "after",
					}
				);

				return res.status(200).json({
					newUserState: updatedUserState,
					newUser: updatedUserState.value,
				});
				break;
			}

			/**------------------------------------------------------------------------------------------
			 *
			 * ! ██████╗ ███████╗██╗     ███████╗████████╗███████╗    ██╗   ██╗███████╗███████╗██████╗
			 * ! ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝    ██║   ██║██╔════╝██╔════╝██╔══██╗
			 * ! ██║  ██║█████╗  ██║     █████╗     ██║   █████╗      ██║   ██║███████╗█████╗  ██████╔╝
			 * ! ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝      ██║   ██║╚════██║██╔══╝  ██╔══██╗
			 * ! ██████╔╝███████╗███████╗███████╗   ██║   ███████╗    ╚██████╔╝███████║███████╗██║  ██║
			 * ! ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝     ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
			 *
			 * ------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * ------------------------------------------------------------------------------------------
			 */
			case "DELETE": {
				if (!userId) {
					return res.status(500).json({ error: "No user id provided" });
				}

				if (currentUser?.uid !== userId) {
					if (
						!currentUser.roles.includes("admin") ||
						!privateKey ||
						privateKey !== apiConfig.privateKey
					) {
						return res.status(401).json({ error: "Unauthorized!" });
					}
				}

				const deleteState = await usersCollection.deleteOne({
					uid: userId,
				});

				return res.status(200).json({ deleteState });
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
				return res.status(500).json({ error: "Invalid request method" });
				break;
			}
		}
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
}
