import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const userProfilePhotosCollection = db.collection("user-profile-photos");
	} catch (error: any) {
		res.status(500).json({ message: error.message });
		return;
	}
}
