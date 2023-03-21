import { db } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { userId } = req.body;

		if (!userId) {
			res.status(400).json({ error: "Missing userId" });
			return;
		}

		const postDocRef = doc(db, "users", userId);
		const postDoc = await getDoc(postDocRef);

		if (postDoc.exists()) {
			res.status(200).json({ user: postDoc.data() });
		} else {
			res.status(200).json({ user: null });
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
