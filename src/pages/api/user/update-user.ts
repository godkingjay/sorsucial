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
		const { newUser, userId } = req.body;

		if (!newUser) {
			res.status(500).json({ error: "No user provided" });
		}

		const newUserState = await usersCollection.updateOne(
			{ uid: userId },
			{ $set: newUser }
		);

		res.status(200).json({ newUserState, newUser });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
