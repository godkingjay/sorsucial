import { PostData } from "@/atoms/postAtom";
import { db } from "@/firebase/clientApp";
import { apiConfig } from "@/lib/api/apiConfig";
import { SitePost } from "@/lib/interfaces/post";
import { SiteUser } from "@/lib/interfaces/user";
import axios from "axios";
import {
	query,
	collection,
	where,
	orderBy,
	limit,
	getDocs,
	startAfter,
} from "firebase/firestore";
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

		const postQuery = lastPost
			? query(
					collection(db, "posts"),
					where("postType", "==", postType),
					orderBy("createdAt", "desc"),
					startAfter(lastPost.createdAt),
					limit(10)
			  )
			: query(
					collection(db, "posts"),
					where("postType", "==", postType),
					orderBy("createdAt", "desc"),
					limit(10)
			  );

		const postDocs = await getDocs(postQuery);

		const posts = await Promise.all(
			postDocs.docs.map(async (postDoc) => {
				const post = postDoc.data() as SitePost;
				const creator: SiteUser = await axios
					.post(apiConfig.apiEndpoint + "user/get-user", {
						userId: post.creatorId,
					})
					.then((response) => response.data.user);

				return {
					post,
					creator,
				};
			})
		);

		if (posts.length > 0) {
			res.status(200).json({ posts });
		} else {
			res.status(200).json({ posts: [] });
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
