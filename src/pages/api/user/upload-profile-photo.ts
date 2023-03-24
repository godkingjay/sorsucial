import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const userProfilePhotoCollection = db.collection("user-profile-photo");
		const { newImage } = req.body;

		if (!newImage) {
			res.status(500).json({ error: "No image provided" });
		}

		const newImageState = await userProfilePhotoCollection.insertOne(newImage);

		res.status(200).json({ newImageState });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
