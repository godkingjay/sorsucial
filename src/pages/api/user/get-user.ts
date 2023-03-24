import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const client = await clientPromise;
	const db = client.db("sorsu-db");
	const usersCollection = db.collection("users");
	const { userId } = req.body;

	const userData = await usersCollection.findOne({
		uid: userId,
	});

	return res.status(200).json({ userData });
}
