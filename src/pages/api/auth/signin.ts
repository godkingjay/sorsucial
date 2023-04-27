import { apiConfig } from "@/lib/api/apiConfig";
import userDb from "@/lib/db/userDb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { usersCollection, apiKeysCollection } = await userDb();
		const { privateKey, userId } = req.body || req.query;

		if (!privateKey || privateKey !== apiConfig.privateKey) {
			res.status(401).json({ error: "Unauthorized" });
		}

		if (!usersCollection) {
			res.status(500).json({ error: "Cannot connect with the Users Database!" });
		}

		if (!apiKeysCollection) {
			res
				.status(500)
				.json({ error: "Cannot connect with the API Keys Database!" });
		}

		switch (req.method) {
			case "POST": {
				if (!userId) {
					res.status(400).json({ error: "No user ID provided!" });
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

			default: {
				res.status(405).json({ error: "Method not allowed" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({
			error: error.message,
		});
	}
}
