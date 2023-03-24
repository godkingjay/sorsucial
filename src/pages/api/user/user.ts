import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const usersCollection = db.collection("users");

		switch (req.method) {
			// case "GET":
			// 	// Get user data
			// 	break;

			// case "POST":
			// 	// Create user data
			// 	break;

			// case "PUT":
			// 	// Update user data
			// 	break;

			case "DELETE":
				const { userId } = req.body;

				if (!userId) {
					res.status(500).json({ error: "No user id provided" });
					return;
				}

				const deleteState = await usersCollection.deleteOne({
					uid: userId,
				});

				res.status(200).json({ deleteState });
				break;

			default:
				res.status(500).json({ error: "Invalid request method" });
				break;
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
