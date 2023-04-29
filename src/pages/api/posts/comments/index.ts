import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { CommentLike, PostComment, SitePost } from "@/lib/interfaces/post";
import axios from "axios";
import { apiConfig } from "@/lib/api/apiConfig";
import { SiteUser } from "@/lib/interfaces/user";
import userDb from "@/lib/db/userDb";
import postDb from "@/lib/db/postDb";
import { SiteUserAPI } from "@/lib/interfaces/api";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { apiKeysCollection, usersCollection } = await userDb();

		const {
			postsCollection,
			postCommentsCollection,
			postCommentLikesCollection,
		} = await postDb();

		const {
			apiKey,
			postId,
			commentData: rawCommentData,
		} = req.body || req.query;

		const commentData: PostComment | undefined =
			typeof rawCommentData === "string"
				? JSON.parse(rawCommentData)
				: rawCommentData;

		if (!apiKey) {
			return res.status(400).json({ error: "API key is missing!" });
		}

		if (!apiKeysCollection) {
			return res
				.status(500)
				.json({ error: "Failed to connect to API Keys Database!" });
		}

		if (!usersCollection) {
			return res
				.status(500)
				.json({ error: "Failed to connect to Users Database!" });
		}

		if (
			!postsCollection ||
			!postCommentsCollection ||
			!postCommentLikesCollection
		) {
			return res
				.status(500)
				.json({ error: "Failed to connect to Posts Database!" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			res.status(401).json({ error: "Invalid API key" });
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		if (!userData) {
			res.status(401).json({ error: "Invalid user" });
		}

		const postData = (await postsCollection.findOne({
			id: commentData?.postId || postId,
		})) as unknown as SitePost;

		if (!postData) {
			res.status(404).json({
				postDeleted: true,
				commentDeleted: true,
				error: "Post not found",
			});
		}

		if (commentData && commentData.commentLevel > 0) {
			const parentCommentData = (await postCommentsCollection.findOne({
				id: commentData.commentForId,
			})) as unknown as PostComment;

			if (!parentCommentData) {
				res.status(404).json({
					parentCommentDeleted: true,
					error: "Parent Comment not found",
				});
			}
		}

		switch (req.method) {
			case "POST": {
				if (!commentData) {
					return res.status(400).json({ error: "Missing comment data" });
				}

				if (
					!commentData.postId ||
					!commentData.creatorId ||
					!commentData.commentText
				) {
					return res.status(400).json({ error: "Comment data incomplete" });
				}

				const objectId = new ObjectId();
				const objectIdString = objectId.toHexString();

				commentData.id = objectIdString;
				(commentData as any)._id = objectId;

				const newCommentState = await postCommentsCollection.findOneAndUpdate(
					{
						id: commentData!.id,
					},
					{
						$set: {
							...commentData!,
						},
					},
					{
						upsert: true,
					}
				);

				const newPostState =
					commentData!.commentLevel === 0
						? await postsCollection.updateOne(
								{
									id: commentData!.postId,
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
									id: commentData!.postId,
								},
								{
									$inc: {
										numberOfComments: 1,
									},
								}
						  );

				res.status(201).json({
					newCommentState,
					newComment: commentData,
				});
				break;
			}

			case "PUT": {
				if (!commentData) {
					res.status(400).json({ error: "No comment data provided" });
				}

				const existingComment = (await postCommentsCollection.findOne({
					id: commentData!.id,
				})) as unknown as PostComment;

				if (!existingComment) {
					res.status(404).json({
						commentDeleted: true,
						error: "Comment not found",
					});
				}

				const { numberOfReplies, ...updatedComment } = commentData!;

				const updatedCommentState = await postCommentsCollection.updateOne(
					{
						id: commentData!.id,
					},
					{
						$set: updatedComment,
					}
				);

				if (numberOfReplies) {
					await postCommentsCollection.findOneAndUpdate(
						{
							id: commentData!.id,
						},
						{
							$inc: {
								numberOfReplies: 1,
							},
						}
					);
				}

				if (updatedCommentState.modifiedCount > 0) {
					res.status(200).json({ message: "Comment updated" });
				} else {
					res.status(200).json({ message: "Comment not updated" });
				}
				break;
			}

			case "DELETE": {
				if (!commentData!) {
					res.status(500).json({ error: "No comment data provided" });
				}

				if (commentData?.creatorId !== userData.uid) {
					if (!userData.roles.includes("admin")) {
						res.status(401).json({
							error: "You are not authorized to delete this comment",
						});
					}
				}

				const existingComment = (await postCommentsCollection.findOne({
					id: commentData!.id,
				})) as unknown as PostComment;

				if (!existingComment) {
					res.status(404).json({
						commentDeleted: true,
						error: "Comment not found",
					});
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

				await deleteComment(commentData!);

				const updatePostState = await postsCollection.updateOne(
					{
						id: commentData!.postId,
					},
					{
						$inc: {
							numberOfComments: -count,
						},
					}
				);

				res.status(200).json({
					isDeleted: count > 0,
					deletedCount: count,
				});

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
