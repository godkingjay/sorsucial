import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { CommentLike, PostComment } from "@/lib/interfaces/post";
import axios from "axios";
import { apiConfig } from "@/lib/api/apiConfig";
import { SiteUser } from "@/lib/interfaces/user";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const usersCollection = db.collection("users");
		const postsCollection = db.collection("posts");
		const postCommentsCollection = db.collection("post-comments");
		const postCommentLikesCollection = db.collection("post-comment-likes");

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

				const newPostState =
					newComment.commentLevel === 0
						? await postsCollection.updateOne(
								{
									id: newComment.postId,
								},
								{
									$inc: {
										numberOfComments: 1,
										numberOfFirstLevelComments: 1,
									},
								}
						  )
						: await postsCollection.updateOne(
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

			case "PUT": {
				const { updatedComment } = req.body;

				if (!updatedComment) {
					res.status(500).json({ error: "No comment data provided" });
					return;
				}

				const updatedCommentState = await postCommentsCollection.updateOne(
					{
						id: updatedComment.id,
					},
					{
						$set: {
							...updatedComment,
						},
					}
				);

				res.status(200).json({ isUpdated: updatedCommentState.acknowledged });

				break;
			}

			case "DELETE": {
				const { deletedComment } = req.body;

				if (!deletedComment) {
					res.status(500).json({ error: "No comment data provided" });
					return;
				}

				let count = 0;

				const deleteComment = async (comment: PostComment) => {
					const deleteCommentState = await postCommentsCollection.deleteOne({
						id: comment.id,
					});
					count += deleteCommentState.deletedCount;

					const deleteCommentLikesState =
						await postCommentLikesCollection.deleteMany({
							postId: comment.postId,
							commentId: comment.id,
						});

					if (comment.commentLevel === 0) {
						const updatePostState = await postsCollection.updateOne(
							{
								id: comment.postId,
							},
							{
								$inc: {
									numberOfFirstLevelComments: -1,
								},
							}
						);
					} else {
						const updateParentCommentState =
							await postCommentsCollection.updateOne(
								{
									id: comment.commentForId,
								},
								{
									$inc: {
										numberOfReplies: -1,
									},
								}
							);
					}

					const nestedComments = await postCommentsCollection
						.find({
							commentForId: comment.id,
						})
						.toArray();

					for (const nestedComment of nestedComments) {
						await deleteComment(nestedComment as unknown as PostComment);
					}
				};

				await deleteComment(deletedComment);

				const updatePostState = await postsCollection.updateOne(
					{
						id: deletedComment.postId,
					},
					{
						$inc: {
							numberOfComments: -count,
						},
					}
				);

				res.status(200).json({ isDeleted: count > 0, deletedCount: count });

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
