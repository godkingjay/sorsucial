import postDb from "@/lib/db/postDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { PostLike, SitePost } from "@/lib/interfaces/post";
import { SiteUser } from "@/lib/interfaces/user";
import { NextApiRequest, NextApiResponse } from "next";

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
		const { postsCollection, postLikesCollection } = await postDb();

		const {
			apiKey,
			userLikeData: rawUserLikeData,
			postId,
			userId,
		} = req.body || req.query;

		const userLikeData: PostLike =
			typeof rawUserLikeData === "string"
				? JSON.parse(rawUserLikeData)
				: rawUserLikeData;

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

		if (!postsCollection || !postLikesCollection) {
			return res
				.status(500)
				.json({ error: "Failed to connect to Posts Database!" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			return res.status(401).json({ error: "Invalid API key!" });
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		if (!userData) {
			return res.status(401).json({ error: "Invalid user!" });
		}

		const postData = (await postsCollection.findOne({
			id: postId,
		})) as unknown as SitePost;

		if (!postData) {
			return res
				.status(404)
				.json({ postDeleted: true, error: "Post not found!" });
		}

		const existingLike = (await postLikesCollection.findOne({
			userId: userLikeData.userId || userId,
			postId: userLikeData.postId || postId,
		})) as unknown as PostLike;

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
				if (!userLikeData) {
					return res.status(400).json({ error: "No user like data provided" });
				}

				if (userAPI.userId !== userLikeData.userId) {
					return res.status(401).json({ error: "Unauthorized user" });
				}

				if (existingLike) {
					return res.status(400).json({ error: "User already liked this post" });
				}

				try {
					const newLikeState = await postLikesCollection.findOneAndUpdate(
						{
							userId: userLikeData.userId,
							postId: userLikeData.postId,
						},
						{
							$set: userLikeData,
						},
						{
							upsert: true,
						}
					);
					const newPostStateLiked = await postsCollection.updateOne(
						{
							id: userLikeData.postId,
						},
						{
							$inc: {
								numberOfLikes: 1,
							},
						}
					);

					return res.status(200).json({ newLikeState, newPostStateLiked });
				} catch (error: any) {
					return res
						.status(500)
						.json({ error: "Server error: " + error.message });
				}
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
				if (!postId || !userId) {
					return res
						.status(400)
						.json({ error: "No post id or user id provided" });
				}

				return res.status(200).json({
					userLike: existingLike,
				});
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
				if (!postId || !userId) {
					return res
						.status(400)
						.json({ error: "No post id or user id provided" });
				}

				if (userAPI.userId !== userId) {
					return res.status(401).json({ error: "Invalid user" });
				}

				if (!existingLike) {
					return res.status(404).json({ error: "User has not liked this post" });
				}

				const deleteLikeState = await postLikesCollection
					.deleteOne({
						postId: postId,
						userId: userId,
					})
					.catch((error: any) => {
						return res
							.status(500)
							.json({ error: "Error deleting like data:\n" + error.message });
					});

				const newPostStateUnliked = await postsCollection
					.updateOne(
						{
							id: postId,
						},
						{
							$inc: {
								numberOfLikes: -1,
							},
						}
					)
					.catch((error: any) => {
						return res
							.status(500)
							.json({ error: "Error updating post data:\n" + error.message });
					});

				return res.status(200).json({ deleteLikeState, newPostStateUnliked });
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
				return res.status(500).json({ error: "Invalid method" });
				break;
			}
		}
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
}
