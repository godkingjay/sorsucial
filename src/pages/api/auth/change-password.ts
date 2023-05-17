import bcrypt from "bcrypt";
import { apiConfig } from "@/lib/api/apiConfig";
import userDb from "@/lib/db/userDb";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { apiKeysCollection, usersCollection } = await userDb();

		const { apiKey, privateKey, oldPassword, newPassword } =
			req.body || req.query;

		if (!apiKey || !privateKey) {
			return res.status(400).json({ message: "Bad Request" });
		}

		if (bcrypt.compareSync(privateKey, apiConfig.privateKey) !== true) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		if (!oldPassword || !newPassword) {
			return res.status(400).json({ message: "Bad Request" });
		}
	} catch (error: any) {
		return res.status(500).json({ message: error.message });
	}
}
