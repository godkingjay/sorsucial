import postDb from "@/lib/db/postDb";
import tagDb from "@/lib/db/tagDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { PostComment, SitePost } from "@/lib/interfaces/post";
import { SiteUser } from "@/lib/interfaces/user";
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
		const { apiKeysCollection, usersCollection } = await userDb();
		const {
			postsCollection,
			postLikesCollection,
			postCommentsCollection,
			postCommentLikesCollection,
		} = await postDb();
		const { tagsCollection } = await tagDb();

		const {
			apiKey,
			postData: rawPostData,
			creator: rawCreator,
		} = req.body || req.query;

		const postData: SitePost =
			typeof rawPostData === "string" ? JSON.parse(rawPostData) : rawPostData;
		const creator: SiteUser =
			typeof rawCreator === "string" ? JSON.parse(rawCreator) : rawCreator;

		if (!apiKey) {
			res.status(400).json({ error: "No API key provided!" });
		}

		if (!apiKeysCollection) {
			res
				.status(500)
				.json({ error: "Cannot connect with the API Keys Database!" });
		}

		if (!usersCollection) {
			res.status(500).json({ error: "Cannot connect with the Users Database!" });
		}

		if (
			!postsCollection ||
			!postLikesCollection ||
			!postCommentsCollection ||
			!postCommentLikesCollection
		) {
			res.status(500).json({ error: "Cannot connect with the Post Database!" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			res.status(500).json({ error: "Invalid API key" });
			return;
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

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
				if (!postData) {
					res.status(500).json({ error: "No post provided" });
					return;
				}

				if (!creator) {
					res.status(500).json({ error: "No creator provided" });
					return;
				}

				if (postData.creatorId !== creator.uid) {
					res.status(500).json({ error: "Creator id does not match creator" });
					return;
				}

				const objectId = new ObjectId();
				const objectIdString = objectId.toHexString();

				postData.id = objectIdString;

				const newPostState = await postsCollection.insertOne({
					...postData,
					_id: objectId,
				});

				postData.postTags?.map(async (tag) => {
					await tagsCollection.updateOne(
						{
							name: tag,
						},
						{
							$inc: {
								total: 1,
								posts: 1,
							},
							$setOnInsert: {
								createdAt: new Date(),
							},
						},
						{
							upsert: true,
						}
					);
				});

				res.status(200).json({
					newPostState,
					newPost: {
						...postData,
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
				if (!postData) {
					res.status(500).json({ error: "No post provided" });
					return;
				}

				if (postData.creatorId !== userData.uid) {
					if (!userData.roles.includes("admin")) {
						res.status(400).json({
							error: "User is not the creator of the post or an admin!",
						});
					}
				}

				const updateState = await postsCollection.updateOne(
					{ id: postData.id },
					{
						$set: {
							...postData,
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
				if (!postData) {
					res.status(500).json({ error: "No post provided" });
					return;
				}

				if (postData.creatorId !== userData.uid) {
					if (!userData.roles.includes("admin")) {
						res.status(400).json({
							error: "User is not the creator of the post or an admin!",
						});
					}
				}

				const deleteState = await postsCollection.deleteOne({
					id: postData.id,
				});

				const deletePostLikesState = await postLikesCollection.deleteMany({
					postId: postData.id,
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

					const nestedComments = await postCommentsCollection
						.find({
							commentForId: comment.id,
						})
						.toArray();

					for (const nestedComment of nestedComments) {
						await deleteComment(nestedComment as unknown as PostComment);
					}
				};

				const postComments = await postCommentsCollection
					.find({
						commentForId: postData.id,
					})
					.toArray();

				for (const postComment of postComments) {
					await deleteComment(postComment as unknown as PostComment);
				}

				postData.postTags?.map(async (tag) => {
					await tagsCollection.updateOne(
						{
							name: tag,
						},
						{
							$inc: {
								total: -1,
								posts: -1,
							},
							$set: {
								updatedAt: new Date(),
							},
						}
					);
				});

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
