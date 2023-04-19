import { apiConfig } from "@/lib/api/apiConfig";
import { PostLike, SitePost } from "@/lib/interfaces/post";
import { SiteUser } from "@/lib/interfaces/user";
import clientPromise from "@/lib/mongodb";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

/**--------------------------------------------------------------------------------------------------------------------
 *
 * ~ ██████╗  ██████╗ ███████╗████████╗███████╗    ███████╗███╗   ██╗██████╗ ██████╗  ██████╗ ██╗███╗   ██╗████████╗
 * ~ ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██╔════╝    ██╔════╝████╗  ██║██╔══██╗██╔══██╗██╔═══██╗██║████╗  ██║╚══██╔══╝
 * ~ ██████╔╝██║   ██║███████╗   ██║   ███████╗    █████╗  ██╔██╗ ██║██║  ██║██████╔╝██║   ██║██║██╔██╗ ██║   ██║
 * ~ ██╔═══╝ ██║   ██║╚════██║   ██║   ╚════██║    ██╔══╝  ██║╚██╗██║██║  ██║██╔═══╝ ██║   ██║██║██║╚██╗██║   ██║
 * ~ ██║     ╚██████╔╝███████║   ██║   ███████║    ███████╗██║ ╚████║██████╔╝██║     ╚██████╔╝██║██║ ╚████║   ██║
 * ~ ╚═╝      ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝    ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝      ╚═════╝ ╚═╝╚═╝  ╚═══╝   ╚═╝
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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const usersCollection = db.collection("users");
		const postsCollection = db.collection("posts");
		const postLikesCollection = db.collection("post-likes");

		switch (req.method) {
			/**-------------------------------------------------------------------------------------------------------------------
			 *
			 * ^  ██████╗ ███████╗████████╗    ██████╗  ██████╗ ███████╗████████╗███████╗
			 * ^ ██╔════╝ ██╔════╝╚══██╔══╝    ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██╔════╝
			 * ^ ██║  ███╗█████╗     ██║       ██████╔╝██║   ██║███████╗   ██║   ███████╗
			 * ^ ██║   ██║██╔══╝     ██║       ██╔═══╝ ██║   ██║╚════██║   ██║   ╚════██║
			 * ^ ╚██████╔╝███████╗   ██║       ██║     ╚██████╔╝███████║   ██║   ███████║
			 * ^  ╚═════╝ ╚══════╝   ╚═╝       ╚═╝      ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝
			 *
			 * -------------------------------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * -------------------------------------------------------------------------------------------------------------------
			 */
			case "GET": {
				const { getUserId, getPostType, getPrivacy, getFromDate } = req.query;

				if (!getPostType) {
					res.status(500).json({ error: "No post type provided" });
					return;
				}

				const posts = getFromDate
					? await postsCollection
							.find({
								postType: getPostType,
								privacy: getPrivacy,
								createdAt: { $lt: getFromDate },
							})
							.sort({ createdAt: -1 })
							.limit(10)
							.toArray()
					: await postsCollection
							.find({
								postType: getPostType,
								privacy: getPrivacy,
							})
							.sort({ createdAt: -1 })
							.limit(10)
							.toArray();

				const postsData = await Promise.all(
					posts.map(async (postDoc) => {
						const post = postDoc as unknown as SitePost;
						const userLikeData = (await postLikesCollection.findOne({
							postId: post.id,
							userId: getUserId,
						})) as unknown as PostLike;
						const creatorData = (await usersCollection.findOne({
							uid: post.creatorId,
						})) as unknown as SiteUser;

						return {
							post,
							creator: creatorData,
							userLike: userLikeData,
						};
					})
				);

				if (postsData.length) {
					res.status(200).json({ posts: postsData });
				} else {
					res.status(200).json({ posts: [] });
				}
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
				res.status(405).json({ error: "Method not allowed" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}