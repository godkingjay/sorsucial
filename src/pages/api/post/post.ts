import { PostComment } from "@/lib/interfaces/post";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

/**------------------------------------------------------------------------------------------
 *
 * ~  ██████╗  ██████╗ ███████╗████████╗    ███████╗███╗   ██╗██████╗ ██████╗  ██████╗ ██╗███╗   ██╗████████╗
 * ~  ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝    ██╔════╝████╗  ██║██╔══██╗██╔══██╗██╔═══██╗██║████╗  ██║╚══██╔══╝
 * ~  ██████╔╝██║   ██║███████╗   ██║       █████╗  ██╔██╗ ██║██║  ██║██████╔╝██║   ██║██║██╔██╗ ██║   ██║
 * ~  ██╔═══╝ ██║   ██║╚════██║   ██║       ██╔══╝  ██║╚██╗██║██║  ██║██╔═══╝ ██║   ██║██║██║╚██╗██║   ██║
 * ~  ██║     ╚██████╔╝███████║   ██║       ███████╗██║ ╚████║██████╔╝██║     ╚██████╔╝██║██║ ╚████║   ██║
 * ~  ╚═╝      ╚═════╝ ╚══════╝   ╚═╝       ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝      ╚═════╝ ╚═╝╚═╝  ╚═══╝   ╚═╝
 *
 * ------------------------------------------------------------------------------------------
 *
 *
 *
 * ------------------------------------------------------------------------------------------
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
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const postsCollection = db.collection("posts");
		const postLikesCollection = db.collection("post-likes");
		const postCommentsCollection = db.collection("post-comments");
		const postCommentLikesCollection = db.collection("post-comment-likes");

		switch (req.method) {
			/**-------------------------------------------------------------------------------------------
			 *
			 * ~  ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗    ██████╗  ██████╗ ███████╗████████╗
			 * ~ ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝    ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
			 * ~ ██║     ██████╔╝█████╗  ███████║   ██║   █████╗      ██████╔╝██║   ██║███████╗   ██║
			 * ~ ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝      ██╔═══╝ ██║   ██║╚════██║   ██║
			 * ~ ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗    ██║     ╚██████╔╝███████║   ██║
			 * ~  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝      ╚═════╝ ╚══════╝   ╚═╝
			 *
			 * -------------------------------------------------------------------------------------------
			 *
			 * This is the POST method for the post API call:
			 * 1. Create a new post with the specified data in the request body.
			 * 2. Return the new post.
			 *
			 * -------------------------------------------------------------------------------------------
			 */
			case "POST": {
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
				break;
			}

			/**-------------------------------------------------------------------------------------------
			 *
			 * ^  ██████╗ ███████╗████████╗    ██████╗  ██████╗ ███████╗████████╗
			 * ^ ██╔════╝ ██╔════╝╚══██╔══╝    ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
			 * ^ ██║  ███╗█████╗     ██║       ██████╔╝██║   ██║███████╗   ██║
			 * ^ ██║   ██║██╔══╝     ██║       ██╔═══╝ ██║   ██║╚════██║   ██║
			 * ^ ╚██████╔╝███████╗   ██║       ██║     ╚██████╔╝███████║   ██║
			 * ^  ╚═════╝ ╚══════╝   ╚═╝       ╚═╝      ╚═════╝ ╚══════╝   ╚═╝
			 *
			 * -------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * -------------------------------------------------------------------------------------------
			 */
			case "GET": {
				const post = await postsCollection.find({}).limit(1).toArray();
				res.status(200).json({ post });
				break;
			}

			/**-------------------------------------------------------------------------------------------
			 *
			 * ? ███████╗██████╗ ██╗████████╗    ██████╗  ██████╗ ███████╗████████╗
			 * ? ██╔════╝██╔══██╗██║╚══██╔══╝    ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
			 * ? █████╗  ██║  ██║██║   ██║       ██████╔╝██║   ██║███████╗   ██║
			 * ? ██╔══╝  ██║  ██║██║   ██║       ██╔═══╝ ██║   ██║╚════██║   ██║
			 * ? ███████╗██████╔╝██║   ██║       ██║     ╚██████╔╝███████║   ██║
			 * ? ╚══════╝╚═════╝ ╚═╝   ╚═╝       ╚═╝      ╚═════╝ ╚══════╝   ╚═╝
			 *
			 * -------------------------------------------------------------------------------------------
			 *
			 * This is the PUT method for the post API. It is used to update a post.
			 *
			 * -------------------------------------------------------------------------------------------
			 */
			case "PUT": {
				const { updatedPost } = req.body;

				if (!updatedPost) {
					res.status(500).json({ error: "No post provided" });
					return;
				}

				const updateState = await postsCollection.updateOne(
					{ id: updatedPost.id },
					{
						$set: {
							...updatedPost,
						},
					}
				);

				res.status(200).json({ updateState });
				break;
			}

			/**-------------------------------------------------------------------------------------------
			 *
			 * ! ██████╗ ███████╗██╗     ███████╗████████╗███████╗    ██████╗  ██████╗ ███████╗████████╗
			 * ! ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝    ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
			 * ! ██║  ██║█████╗  ██║     █████╗     ██║   █████╗      ██████╔╝██║   ██║███████╗   ██║
			 * ! ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝      ██╔═══╝ ██║   ██║╚════██║   ██║
			 * ! ██████╔╝███████╗███████╗███████╗   ██║   ███████╗    ██║     ╚██████╔╝███████║   ██║
			 * ! ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝    ╚═╝      ╚═════╝ ╚══════╝   ╚═╝
			 *
			 * --------------------------------------------------------------------------------------------
			 *
			 * This API Call will delete a post and all of its likes from the database.
			 *
			 * --------------------------------------------------------------------------------------------
			 */
			case "DELETE": {
				const { deletedPost } = req.body;

				if (!deletedPost) {
					res.status(500).json({ error: "No post provided" });
					return;
				}

				const deleteState = await postsCollection.deleteOne({
					id: deletedPost.id,
				});

				const deletePostLikesState = await postLikesCollection.deleteMany({
					postId: deletedPost.id,
				});

				const deleteComment = async (comment: PostComment) => {
					const deleteCommentState = await postCommentsCollection.deleteOne({
						id: comment.id,
					});

					const deleteCommentLikesState =
						await postCommentLikesCollection.deleteMany({
							postId: comment.postId,
							commentId: comment.id,
						});

					const childComments = await postCommentsCollection
						.find({
							commentForId: comment.id,
						})
						.toArray();

					for (const childComment of childComments) {
						await deleteComment(childComment as unknown as PostComment);
					}
				};

				const postComments = await postCommentsCollection
					.find({
						commentForId: deletedPost.id,
					})
					.toArray();

				for (const postComment of postComments) {
					await deleteComment(postComment as unknown as PostComment);
				}

				res.status(200).json({ deleteState, deletePostLikesState });
				break;
			}

			/**-------------------------------------------------------------------------------------------
			 *
			 * & ██████╗ ███████╗███████╗ █████╗ ██╗   ██╗██╗  ████████╗
			 * & ██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██║  ╚══██╔══╝
			 * & ██║  ██║█████╗  █████╗  ███████║██║   ██║██║     ██║
			 * & ██║  ██║██╔══╝  ██╔══╝  ██╔══██║██║   ██║██║     ██║
			 * & ██████╔╝███████╗██║     ██║  ██║╚██████╔╝███████╗██║
			 * & ╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝
			 *
			 * -------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * -------------------------------------------------------------------------------------------
			 */
			default: {
				res.status(500).json({ error: "Invalid method" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
