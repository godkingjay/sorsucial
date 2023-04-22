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
			res.status(400).json({ error: "No API Key or Private key provided!" });
		}

		if (!apiKeysCollection) {
			res
				.status(500)
				.json({ error: "Cannot connect with the API Keys Database!" });
		}

		if (!usersCollection) {
			res.status(500).json({ error: "Cannot connect with the Users Database!" });
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
					res.status(400).json({ error: "No user provided" });
					return;
				}

				if (!privateKey || privateKey !== apiConfig.privateKey) {
					res.status(401).json({ error: "Unauthorized" });
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

				res.status(200).json({ newUserState, newUser: userData });
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
				if (!privateKey || privateKey !== apiConfig.privateKey) {
					res.status(401).json({ message: "Unauthorized" });
				}

				if (!userId) {
					res.status(400).json({ error: "No user id provided" });
				}

				const userData = await usersCollection.findOne({
					uid: userId,
				});

				const userAPI = await apiKeysCollection.findOne({
					userId,
				});

				res.status(200).json({ userData, userAPI });
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
					res.status(400).json({ error: "No user data provided" });
				}

				if (currentUser.uid !== userId) {
					if (!currentUser.roles.includes("admin")) {
						res.status(401).json({ error: "Unauthorized!" });
					}
				}

				const updatedUserState = await usersCollection.updateOne(
					{ uid: userId },
					{ $set: userData }
				);

				res
					.status(200)
					.json({ newUserState: updatedUserState, newUser: userData });
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
					res.status(500).json({ error: "No user id provided" });
					return;
				}

				if (currentUser?.uid !== userId) {
					if (
						!currentUser.roles.includes("admin") ||
						!privateKey ||
						privateKey !== apiConfig.privateKey
					) {
						res.status(401).json({ error: "Unauthorized!" });
					}
				}

				const deleteState = await usersCollection.deleteOne({
					uid: userId,
				});

				res.status(200).json({ deleteState });
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
				res.status(500).json({ error: "Invalid request method" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
