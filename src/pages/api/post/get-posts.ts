import { apiConfig } from "@/lib/api/apiConfig";
import { SiteUser } from "@/lib/interfaces/user";
import clientPromise from "@/lib/mongodb";
import axios from "axios";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { postType, lastPost } = req.body;

		if (!postType) {
			res.status(400).json({ error: "Missing postType" });
			return;
		}

		if (req.method === "POST") {
			const client = await clientPromise;
			const db = client.db("sorsu-db");
			const postsCollection = db.collection("posts");

			const postDocs = lastPost
				? await postsCollection
						.find({
							postType,
							createdAt: lastPost.createdAt,
						})
						.sort({ createdAt: -1 })
						.limit(10)
						.toArray()
				: await postsCollection
						.find({
							postType,
						})
						.sort({ createdAt: -1 })
						.limit(10)
						.toArray();

			const posts = await Promise.all(
				postDocs.map(async (postDoc) => {
					const post = postDoc;
					const creatorData = await axios
						.post(apiConfig.apiEndpoint + "user/get-user", {
							userId: post.creatorId,
						})
						.then((res) => res.data.userData as SiteUser)
						.catch((err) => {
							res.status(500).json({ error: err.message });
							return null;
						});

					if (!creatorData) {
						res.status(500).json({ error: "Could not get creator data" });
						return;
					}

					const postData = {
						post,
						creator: creatorData,
					};

					return postData;
				})
			);

			if (posts.length > 0) {
				res.status(200).json({ posts });
			} else {
				res.status(200).json({ posts: [] });
			}
		} else {
			res.status(400).json({ error: "Invalid method" });
			return;
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
