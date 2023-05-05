import groupDb from "@/lib/db/groupDb";
import postDb from "@/lib/db/postDb";
import tagDb from "@/lib/db/tagDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { PostComment, SitePost } from "@/lib/interfaces/post";
import { Tag } from "@/lib/interfaces/tag";
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

		const { groupsCollection } = await groupDb();

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
			res.status(401).json({ error: "Cannot connect with the Post Database!" });
		}

		if (!groupsCollection) {
			res.status(401).json({ error: "Cannot connect with the Group Database!" });
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
				if (!postData || !postData.postTitle) {
					res.status(500).json({ error: "No post provided" });
				}

				if (!creator) {
					res.status(500).json({ error: "No creator provided" });
				}

				if (postData.creatorId !== creator.uid) {
					res.status(500).json({ error: "Creator id does not match creator" });
				}

				const objectId = new ObjectId();
				const objectIdString = objectId.toHexString();

				postData.id = objectIdString;
				postData.creatorId = creator.uid;
				postData.updatedAt = new Date().toISOString() as unknown as Date;
				postData.createdAt = new Date().toISOString() as unknown as Date;

				const newPostState = await postsCollection.insertOne({
					...postData,
					_id: objectId,
				});

				if (postData.groupId) {
					await groupsCollection.updateOne(
						{
							id: postData.groupId,
						},
						{
							$inc: {
								numberOfPosts: 1,
							},
							$set: {
								updatedAt: postData.createdAt,
							},
						}
					);
				}

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
							$set: {
								updatedAt: postData.createdAt,
							},
							$setOnInsert: {
								createdAt: postData.createdAt,
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
					return res.status(400).json({ error: "No post provided" });
				}

				if (!userData) {
					return res.status(401).json({ error: "User is not authenticated" });
				}

				if (
					postData.creatorId !== userData.uid &&
					!userData.roles.includes("admin")
				) {
					return res
						.status(400)
						.json({ error: "User is not the creator of the post or an admin" });
				}

				const existingPost = await postsCollection.findOne({ id: postData.id });

				if (!existingPost) {
					return res
						.status(400)
						.json({ notFound: true, error: "Post does not exist" });
				}

				const updateState = await postsCollection.findOneAndUpdate(
					{ id: postData.id },
					{ $set: { ...postData } },
					{ returnDocument: "after" }
				);

				res.status(200).json({ notFound: !updateState, updateState });
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
					res.status(400).json({ error: "No post provided" });
				}

				if (postData.creatorId !== userData.uid) {
					if (!userData.roles.includes("admin")) {
						res.status(403).json({
							error: "User is not the creator of the post or an admin!",
						});
					}
				}

				const existingPost = await postsCollection.findOne({ id: postData.id });

				if (!existingPost) {
					res.status(200).json({
						isDeleted: true,
						error: "Post does not exist!",
					});
				}

				const deleteComment = async (comment: PostComment) => {
					await postCommentsCollection.deleteOne({
						id: comment.id,
					});

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

				const deletePostLikesState = await postLikesCollection.deleteMany({
					postId: postData.id,
				});

				const deleteState = await postsCollection.deleteOne({
					id: postData.id,
				});

				if (postData.groupId) {
					await groupsCollection.updateOne(
						{
							id: postData.groupId,
						},
						{
							$inc: {
								numberOfPosts: -1,
							},
							$set: {
								updatedAt: postData.createdAt,
							},
						}
					);
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
							} as Partial<Tag>,
							$set: {
								updatedAt: new Date(),
							} as Partial<Tag>,
						}
					);
				});

				res.status(200).json({
					isDeleted: deleteState ? deleteState.acknowledged : false,
					deleteState,
					deletePostLikesState,
				});
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
