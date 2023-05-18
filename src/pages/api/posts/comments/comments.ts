import clientPromise from "@/lib/mongodb";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { CommentLike, PostComment } from "@/lib/interfaces/post";
import { SiteUser } from "@/lib/interfaces/user";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const usersCollection = db.collection("users");
		const postCommentsCollection = db.collection("post-comments");
		const postCommentLikesCollection = db.collection("post-comment-likes");

		switch (req.method) {
			case "GET": {
				const {
					getUserId,
					getCommentPostId,
					getCommentForId,
					getFromLikes = Number.MAX_SAFE_INTEGER.toString(),
					getFromReplies = Number.MAX_SAFE_INTEGER.toString(),
					getFromDate = new Date().toISOString(),
				} = req.query;

				if (!getCommentPostId) {
					return res.status(500).json({ error: "No post id provided" });
				}

				if (!getCommentForId) {
					return res
						.status(500)
						.json({ error: "Comment receiver Id not provide" });
				}

				const comments = getFromDate
					? await postCommentsCollection
							.find({
								postId: getCommentPostId,
								commentForId: getCommentForId,
								numberOfLikes: {
									$lt: parseInt(getFromLikes as string),
								},
								numberOfReplies: {
									$lt: parseInt(getFromReplies as string),
								},
								createdAt: {
									$lt: getFromDate,
								},
							})
							.sort({
								numberOfLikes: -1,
								numberOfReplies: -1,
								createdAt: -1,
							})
							.limit(10)
							.toArray()
					: await postCommentsCollection
							.find({
								postId: getCommentPostId,
								commentForId: getCommentForId,
								numberOfLikes: {
									$lt: parseInt(getFromLikes as string),
								},
								numberOfReplies: {
									$lt: parseInt(getFromReplies as string),
								},
							})
							.sort({
								numberOfLikes: -1,
								numberOfReplies: -1,
								createdAt: -1,
							})
							.limit(10)
							.toArray();

				const commentsData = await Promise.all(
					comments.map(async (commentDoc) => {
						const comment = commentDoc as unknown as PostComment;
						const userCommentLikeData =
							(await postCommentLikesCollection.findOne({
								postId: comment.postId,
								commentId: comment.id,
								userId: getUserId,
							})) as unknown as CommentLike;
						const creatorData = (await usersCollection.findOne({
							uid: comment.creatorId,
						})) as unknown as SiteUser;

						return {
							comment,
							creator: creatorData,
							userCommentLike: userCommentLikeData,
						};
					})
				);

				if (commentsData.length) {
					return res.status(200).json({ comments: commentsData });
				} else {
					return res.status(200).json({ comments: [] });
				}

				break;
			}

			default: {
				return res.status(405).json({ error: "Method not allowed" });
				break;
			}
		}
	} catch (error) {
		return res.status(500).json({ error: "Internal server error" });
	}
}
