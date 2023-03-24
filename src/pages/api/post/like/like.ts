import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const postsCollection = db.collection("posts");
		const postLikesCollection = db.collection("post-likes");

		const { post, userLike } = req.body;

		switch (req.method) {
			case "GET":
				const { postId, userId } = req.query;

				if (!postId || !userId) {
					res.status(500).json({ error: "No post id or user id provided" });
				}

				const like = await postLikesCollection.findOne({
					postId,
					userId,
				});

				res.status(200).json({ userLike: like });
				break;

			case "POST":
				if (!post) {
					res.status(500).json({ error: "No post provided" });
				}

				if (!userLike) {
					res.status(500).json({ error: "No user like provided" });
				}

				const newLikeState = await postLikesCollection.insertOne(userLike);
				const newPostStateLiked = await postsCollection.updateOne(
					{
						id: post.id,
					},
					{
						$inc: {
							numberOfLikes: 1,
						},
					}
				);

				res.status(200).json({ newLikeState, userLike });
				break;

			case "DELETE":
				if (!post) {
					res.status(500).json({ error: "No post provided" });
				}

				if (!userLike) {
					res.status(500).json({ error: "No user like provided" });
				}

				const deleteLikeState = await postLikesCollection.deleteOne({
					postId: userLike.postId,
					userId: userLike.userId,
				});
				const newPostStateUnliked = await postsCollection.updateOne(
					{
						id: post.id,
					},
					{
						$inc: {
							numberOfLikes: -1,
						},
					}
				);

				res.status(200).json({ deleteLikeState, userLike });
				break;

			default:
				res.status(500).json({ error: "Invalid method" });
				break;
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
