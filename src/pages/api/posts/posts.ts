import postDb from "@/lib/db/postDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { PostLike, SitePost } from "@/lib/interfaces/post";
import { SiteUser } from "@/lib/interfaces/user";
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
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { apiKeysCollection, usersCollection } = await userDb();
		const { postsCollection, postLikesCollection } = await postDb();

		const { apiKey, userId, postType, privacy, fromDate } =
			req.body || req.query;

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
				if (!postType) {
					res.status(400).json({ error: "No post type provided" });
				}

				const posts = await Promise.all(
					fromDate
						? await postsCollection
								.find({
									postType: postType,
									privacy: privacy,
									createdAt: { $lt: fromDate },
								})
								.sort({ createdAt: -1 })
								.limit(10)
								.toArray()
						: await postsCollection
								.find({
									postType: postType,
									privacy: privacy,
								})
								.sort({ createdAt: -1 })
								.limit(10)
								.toArray()
				).catch((error: any) => {
					res
						.status(500)
						.json({ error: "Error getting posts:\n" + error.message });
				});

				const postsData = await Promise.all(
					posts!.map(async (postDoc) => {
						const post = postDoc as unknown as SitePost;

						const userLikeData = (await postLikesCollection.findOne({
							postId: post.id,
							userId: userId,
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
