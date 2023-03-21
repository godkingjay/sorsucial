import { db } from "@/firebase/clientApp";
import {
	query,
	collection,
	where,
	orderBy,
	limit,
	getDocs,
} from "firebase/firestore";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { postType } = req.body;

		if (!postType) {
			res.status(400).json({ error: "Missing postType" });
			return;
		}

		const postQuery = query(
			collection(db, "posts"),
			where("postType", "==", postType),
			orderBy("createdAt", "desc"),
			limit(10)
		);

		const postDocs = await getDocs(postQuery);

		const posts = postDocs.docs.map((doc) => {
			return {
				...doc.data(),
			};
		});

		if (postDocs.docs.length > 0) {
			res.status(200).json({ posts });
		} else {
			res.status(200).json({ posts });
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
