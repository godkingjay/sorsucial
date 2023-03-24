import { apiConfig } from "./../../../lib/api/apiConfig";
import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		if (req.method === "POST") {
			const client = await clientPromise;
			const db = client.db("sorsu-db");
			const usersCollection = db.collection("users");
			const { lastUser, privateKey, userLimit } = req.body;

			if (!privateKey || privateKey !== apiConfig.privateKey) {
				return res.status(500).json({ error: "Unauthorized" });
			}

			const users = lastUser
				? await usersCollection
						.find({ createdAt: { $lt: lastUser.createdAt } })
						.sort({ createdAt: -1 })
						.limit(userLimit)
						.toArray()
				: await usersCollection
						.find({})
						.sort({ createdAt: -1 })
						.limit(userLimit)
						.toArray();

			return res.status(200).json({ users });
		} else {
			res.status(500).json({ error: "Invalid request method" });
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
