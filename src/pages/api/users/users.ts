import { APIEndpointUsersParams } from "./../../../lib/types/api";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { SiteUser } from "@/lib/interfaces/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { apiKeysCollection, usersCollection } = await userDb();

		const {
			apiKey,
			match,
			groupId,
			roles,
			gender,
			stateOrProvince,
			cityOrMunicipality,
			barangay,
			streetAddress,
			lastIndex,
			fromConnections,
			fromFollowers,
			fromDate = new Date().toISOString(),
			sortBy = "latest",
			limit = 10,
		}: APIEndpointUsersParams = req.body || req.query;

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
			// case "GET": {
			//   break;
			// }

			default: {
				return res.status(403).json({ error: "Invalid Method" });

				break;
			}
		}
	} catch (error: any) {
		return res.status(500).json({
			error: "Internal Server Error:\n" + error.message,
		});
	}
}
