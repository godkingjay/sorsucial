import postDb from "@/lib/db/postDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { CommentLike, PostComment, SitePost } from "@/lib/interfaces/post";
import { SiteUser } from "@/lib/interfaces/user";
import clientPromise from "@/lib/mongodb";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

/**--------------------------------------------------------------------------------------------------------------------
 *
 * ~  ██╗     ██╗██╗  ██╗███████╗    ███████╗███╗   ██╗██████╗ ██████╗  ██████╗ ██╗███╗   ██╗████████╗
 * ~  ██║     ██║██║ ██╔╝██╔════╝    ██╔════╝████╗  ██║██╔══██╗██╔══██╗██╔═══██╗██║████╗  ██║╚══██╔══╝
 * ~  ██║     ██║█████╔╝ █████╗      █████╗  ██╔██╗ ██║██║  ██║██████╔╝██║   ██║██║██╔██╗ ██║   ██║
 * ~  ██║     ██║██╔═██╗ ██╔══╝      ██╔══╝  ██║╚██╗██║██║  ██║██╔═══╝ ██║   ██║██║██║╚██╗██║   ██║
 * ~  ███████╗██║██║  ██╗███████╗    ███████╗██║ ╚████║██████╔╝██║     ╚██████╔╝██║██║ ╚████║   ██║
 * ~  ╚══════╝╚═╝╚═╝  ╚═╝╚══════╝    ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝      ╚═════╝ ╚═╝╚═╝  ╚═══╝   ╚═╝
 *
 * --------------------------------------------------------------------------------------------------------------------
 *
 *
 *
 * --------------------------------------------------------------------------------------------------------------------
 */
/**
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 *
 */
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
			userId,
			postId,
			commentId,
			commentLikeData: rawCommentLikeData,
		} = req.body || req.query;

		const commentLikeData: CommentLike | undefined =
			typeof rawCommentLikeData === "string"
				? JSON.parse(rawCommentLikeData)
				: rawCommentLikeData;

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
			return res.status(401).json({ error: "Invalid API key" });
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		if (!userData) {
			return res.status(401).json({ error: "Invalid user" });
		}

		const postData = (await postsCollection.findOne({
			id: commentLikeData?.postId || postId,
		})) as unknown as SitePost;

		if (!postData) {
			return res.status(404).json({
				postDeleted: true,
				commentDeleted: true,
				error: "Post not found",
			});
		}

		const commentData = (await postCommentsCollection.findOne({
			id: commentLikeData?.commentId || commentId,
		})) as unknown as PostComment;

		if (!commentData) {
			return res.status(404).json({
				commentDeleted: true,
				error: "Comment not found",
			});
		}

		switch (req.method) {
			/**-------------------------------------------------------------------------------------------------------------------
			 *
			 * *   ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗    ██╗     ██╗██╗  ██╗███████╗
			 * *  ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝    ██║     ██║██║ ██╔╝██╔════╝
			 * *  ██║     ██████╔╝█████╗  ███████║   ██║   █████╗      ██║     ██║█████╔╝ █████╗
			 * *  ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝      ██║     ██║██╔═██╗ ██╔══╝
			 * *  ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗    ███████╗██║██║  ██╗███████╗
			 * *   ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚══════╝╚═╝╚═╝  ╚═╝╚══════╝
			 *
			 * -------------------------------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * -------------------------------------------------------------------------------------------------------------------
			 */
			case "POST": {
				if (!commentLikeData) {
					return res.status(400).json({ error: "No user like provided" });
				}

				if (
					!commentLikeData.userId ||
					!commentLikeData.commentId ||
					!commentLikeData.postId
				) {
					return res
						.status(400)
						.json({ error: "User like are missing some fields" });
				}

				const existingCommentLike = await postCommentLikesCollection.findOne({
					userId: commentLikeData.userId,
					commentId: commentLikeData.commentId,
					postId: commentLikeData.postId,
				});

				if (existingCommentLike) {
					return res
						.status(400)
						.json({ error: "User already liked this comment" });
				}

				const newCommentLikeState =
					await postCommentLikesCollection.findOneAndUpdate(
						{
							userId: commentLikeData.userId,
							commentId: commentLikeData.commentId,
							postId: commentLikeData.postId,
						},
						{
							$set: commentLikeData,
						},
						{
							upsert: true,
							returnDocument: "after",
						}
					);

				const newPostCommentStateLiked = await postCommentsCollection.updateOne(
					{
						id: commentLikeData.commentId,
					},
					{
						$inc: { numberOfLikes: 1 },
					}
				);

				return res.status(201).json({
					newCommentLikeState,
					newPostCommentStateLiked,
				});
				break;
			}

			/**-------------------------------------------------------------------------------------------------------------------
			 *
			 * ^   ██████╗ ███████╗████████╗    ██╗     ██╗██╗  ██╗███████╗
			 * ^  ██╔════╝ ██╔════╝╚══██╔══╝    ██║     ██║██║ ██╔╝██╔════╝
			 * ^  ██║  ███╗█████╗     ██║       ██║     ██║█████╔╝ █████╗
			 * ^  ██║   ██║██╔══╝     ██║       ██║     ██║██╔═██╗ ██╔══╝
			 * ^  ╚██████╔╝███████╗   ██║       ███████╗██║██║  ██╗███████╗
			 * ^   ╚═════╝ ╚══════╝   ╚═╝       ╚══════╝╚═╝╚═╝  ╚═╝╚══════╝
			 *
			 * -------------------------------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * -------------------------------------------------------------------------------------------------------------------
			 */
			case "GET": {
				if (!postId || !commentId || !userId) {
					return res.status(500).json({ error: "No query provided" });
				}

				const userCommentLike = await postCommentLikesCollection.findOne({
					postId: postId,
					commentId: commentId,
					userId: userId,
				});

				return res.status(200).json({ userCommentLike });
				break;
			}

			/**-------------------------------------------------------------------------------------------------------------------
			 *
			 *  ! ██████╗ ███████╗██╗     ███████╗████████╗███████╗    ██╗     ██╗██╗  ██╗███████╗
			 *  ! ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝    ██║     ██║██║ ██╔╝██╔════╝
			 *  ! ██║  ██║█████╗  ██║     █████╗     ██║   █████╗      ██║     ██║█████╔╝ █████╗
			 *  ! ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝      ██║     ██║██╔═██╗ ██╔══╝
			 *  ! ██████╔╝███████╗███████╗███████╗   ██║   ███████╗    ███████╗██║██║  ██╗███████╗
			 *  ! ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝    ╚══════╝╚═╝╚═╝  ╚═╝╚══════╝
			 *
			 * -------------------------------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * -------------------------------------------------------------------------------------------------------------------
			 */
			case "DELETE": {
				if (!postId || !commentId || !userId) {
					res
						.status(400)
						.json({ error: "No post id, comment id, and user id provided." });
				}

				if (userAPI.userId !== userId) {
					res
						.status(400)
						.json({
							error: "User is not authorized to delete this comment like",
						});
				}

				const existingCommentLike = await postCommentLikesCollection.findOne({
					postId: postId,
					commentId: commentId,
					userId: userId,
				});

				if (!existingCommentLike) {
					return res.status(200).json({
						isDeleted: true,
						error: "User like does not exist",
					});
				}

				const deletedUserCommentLikeState =
					await postCommentLikesCollection.deleteOne({
						postId: postId,
						commentId: commentId,
						userId: userId,
					});

				const newPostCommentStateNotLiked =
					await postCommentsCollection.updateOne(
						{
							id: commentId,
						},
						{
							$inc: { numberOfLikes: -1 },
						}
					);

				res.status(200).json({
					isDeleted: deletedUserCommentLikeState
						? deletedUserCommentLikeState.acknowledged
						: false,
					newPostCommentStateNotLiked,
				});

				break;
			}

			/**-------------------------------------------------------------------------------------------------------------------
			 *
			 * & ██████╗ ███████╗███████╗ █████╗ ██╗   ██╗██╗  ████████╗
			 * & ██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██║  ╚══██╔══╝
			 * & ██║  ██║█████╗  █████╗  ███████║██║   ██║██║     ██║
			 * & ██║  ██║██╔══╝  ██╔══╝  ██╔══██║██║   ██║██║     ██║
			 * & ██████╔╝███████╗██║     ██║  ██║╚██████╔╝███████╗██║
			 * & ╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝
			 *
			 * -------------------------------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * -------------------------------------------------------------------------------------------------------------------
			 */
			default: {
				return res.status(500).json({ error: "Method not allowed" });
				break;
			}
		}
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
}
