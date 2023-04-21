import postDb from "@/lib/db/postDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { PostLike } from "@/lib/interfaces/post";
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

		if (!postsCollection || !postLikesCollection) {
			res.status(500).json({ error: "Cannot connect with the Posts Database!" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			res.status(401).json({ error: "Invalid API key" });
			return;
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		if (!userData) {
			res.status(401).json({ error: "Invalid user" });
			return;
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
				if (!userLikeData) {
					res.status(400).json({ error: "No user like data provided" });
				}

				const newLikeState = await postLikesCollection
					.insertOne(userLikeData)
					.catch((error: any) => {
						res
							.status(500)
							.json({ error: "Error inserting like data:\n" + error.message });
					});

				const newPostStateLiked = await postsCollection
					.updateOne(
						{
							id: userLikeData.postId,
						},
						{
							$inc: {
								numberOfLikes: 1,
							},
						}
					)
					.catch((error: any) => {
						res
							.status(500)
							.json({ error: "Error updating post data:\n" + error.message });
					});

				res.status(200).json({ newLikeState, newPostStateLiked });
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
				if (!postId || !userId) {
					res.status(400).json({ error: "No post id or user id provided" });
				}

				const like = await postLikesCollection
					.findOne({
						postId: postId,
						userId: userId,
					})
					.catch((error: any) => {
						res
							.status(500)
							.json({ error: "Error getting like data:\n" + error.message });
					});

				res.status(200).json({ userLike: like });
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
					res.status(400).json({ error: "No post id or user id provided" });
				}

				const deleteLikeState = await postLikesCollection
					.deleteOne({
						postId: postId,
						userId: userId,
					})
					.catch((error: any) => {
						res
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
						res
							.status(500)
							.json({ error: "Error updating post data:\n" + error.message });
					});

				res.status(200).json({ deleteLikeState, newPostStateUnliked });
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
				res.status(500).json({ error: "Invalid method" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
