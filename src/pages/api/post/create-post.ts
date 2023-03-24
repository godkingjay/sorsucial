import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const postsCollection = db.collection("posts");
		const { newPost, creator } = req.body;

		if (!newPost) {
			res.status(500).json({ error: "No post provided" });
			return;
		}

		if (!creator) {
			res.status(500).json({ error: "No creator provided" });
			return;
		}

		if (newPost.creatorId !== creator.uid) {
			res.status(500).json({ error: "Creator id does not match creator" });
			return;
		}

		if (req.method === "POST") {
			const objectId = new ObjectId();
			const objectIdString = objectId.toHexString();

			newPost.id = objectIdString;

			const newPostState = await postsCollection.insertOne({
				...newPost,
				_id: objectId,
			});

			res.status(200).json({
				newPostState,
				newPost: {
					...newPost,
				},
			});
		} else {
			res.status(500).json({ error: "Invalid method" });
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
