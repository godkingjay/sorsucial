import { apiConfig } from "./../../../../../lib/api/apiConfig";
import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const usersCollection = db.collection("users");

		switch (req.method) {
			case "GET":
				const { getFromDate, getPrivateKey, getUserLimit } = req.query;

				if (!getPrivateKey || getPrivateKey !== apiConfig.privateKey) {
					res.status(500).json({ error: "Unauthorized" });
					return;
				}

				const users = getFromDate
					? await usersCollection
							.find({ createdAt: { $lt: getFromDate } })
							.sort({ createdAt: -1 })
							.limit(parseInt(getUserLimit as string))
							.toArray()
					: await usersCollection
							.find({})
							.sort({ createdAt: -1 })
							.limit(parseInt(getUserLimit as string))
							.toArray();

				res.status(200).json({ users });
				return;
				break;

			default:
				res.status(500).json({ error: "Invalid request method" });
				break;
		}
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
	}
}