import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const postsCollection = db.collection("posts");
		const postCommentsCollection = db.collection("post-comments");

		switch (req.method) {
			case "POST": {
				const { newComment } = req.body;

				if (!newComment) {
					res.status(500).json({ error: "No comment data provided" });
					return;
				}

				const objectId = new ObjectId();
				const objectIdString = objectId.toHexString();

				newComment.id = objectIdString;

				const newCommentState = await postCommentsCollection.insertOne({
					_id: objectId,
					...newComment,
				});

				const newPostState = await postsCollection.updateOne(
					{
						id: newComment.postId,
					},
					{
						$inc: {
							numberOfComments: 1,
						},
					}
				);

				res.status(200).json({ newCommentState, newComment });
				break;
			}

			default: {
				res.status(405).json({ error: "Method not allowed" });
				break;
			}
		}
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
}
