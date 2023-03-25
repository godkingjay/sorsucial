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

		switch (req.method) {
			case "GET":
				const { getPostId, getUserId } = req.query;

				if (!getPostId || !getUserId) {
					res.status(500).json({ error: "No post id or user id provided" });
				}

				const like = await postLikesCollection.findOne({
					postId: getPostId,
					userId: getUserId,
				});

				res.status(200).json({ userLike: like });
				break;

			case "POST":
				const { newUserLike } = req.body;

				if (!newUserLike) {
					res.status(500).json({ error: "No user like provided" });
					return;
				}

				const newLikeState = await postLikesCollection.insertOne(newUserLike);
				const newPostStateLiked = await postsCollection.updateOne(
					{
						id: newUserLike.postId,
					},
					{
						$inc: {
							numberOfLikes: 1,
						},
					}
				);

				res.status(200).json({ newLikeState, newPostStateLiked });
				break;

			case "DELETE":
				const { deleteUserLikePostId, deleteUserLikeUserId } = req.body;

				if (!deleteUserLikePostId || !deleteUserLikeUserId) {
					res.status(500).json({ error: "No post id or user id provided" });
					return;
				}

				const deleteLikeState = await postLikesCollection.deleteOne({
					postId: deleteUserLikePostId,
					userId: deleteUserLikeUserId,
				});

				const newPostStateUnliked = await postsCollection.updateOne(
					{
						id: deleteUserLikePostId,
					},
					{
						$inc: {
							numberOfLikes: -1,
						},
					}
				);

				res.status(200).json({ deleteLikeState, newPostStateUnliked });
				break;

			default:
				res.status(500).json({ error: "Invalid method" });
				break;
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
