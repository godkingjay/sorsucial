import { apiConfig } from "@/lib/api/apiConfig";
import { SitePost } from "@/lib/interfaces/post";
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
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const postsCollection = db.collection("posts");

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
				const { getPostType, getFromDate } = req.query;

				if (!getPostType) {
					res.status(500).json({ error: "No post type provided" });
					return;
				}

				const posts = getFromDate
					? await postsCollection
							.find({ postType: getPostType, createdAt: { $lt: getFromDate } })
							.sort({ createdAt: -1 })
							.limit(10)
							.toArray()
					: await postsCollection
							.find({ postType: getPostType })
							.sort({ createdAt: -1 })
							.limit(10)
							.toArray();

				const postsData = await Promise.all(
					posts.map(async (postDoc) => {
						const post = postDoc as unknown as SitePost;
						const creatorData = await axios
							.get(apiConfig.apiEndpoint + "user/user", {
								params: { getUserId: post.creatorId },
							})
							.then((res) => res.data.userData as SiteUser)
							.catch((err) => {
								res.status(500).json({ error: err.message });
								return;
							});

						if (!creatorData) {
							res.status(500).json({ error: "Could not get creator data" });
							return;
						}

						return {
							post,
							creator: creatorData,
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
