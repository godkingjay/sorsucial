import groupDb from "@/lib/db/groupDb";
import userDb from "@/lib/db/userDb";
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
			groupId,
			userId,
			groupMemberData: rawGroupMemberData,
		} = req.body || req.query;

		const groupMemberData =
			typeof rawGroupMemberData === "string"
				? JSON.parse(rawGroupMemberData)
				: rawGroupMemberData;

		if (!apiKey) {
			res.status(400).json({ error: "No API key provided!" });
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
