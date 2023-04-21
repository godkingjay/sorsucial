import postDb from "@/lib/db/postDb";
import userDb from "@/lib/db/userDb";
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
		const { apiKeysCollection } = await userDb();
		const { postsCollection, postLikesCollection } = await postDb();

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
