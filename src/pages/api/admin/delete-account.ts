import { authAdmin } from "@/firebase/adminApp";
import { apiConfig } from "@/lib/api/apiConfig";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (!req.body) {
		res.status(400).json({ message: "Bad request" });
		return;
	}

	const { uid, privateKey } = req.body;

	if (!uid) {
		res.status(400).json({ message: "UID is required" });
		return;
	}

	if (!privateKey || privateKey !== apiConfig.privateKey) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	if (req.method === "POST") {
		try {
			authAdmin
				.deleteUser(uid)
				.then(() => {
					res
						.status(200)
						.json({ message: "User deleted successfully", isDeleted: true });
				})
				.catch((error) => {
					console.log(`Admin deleting user ${uid}: `, error.message);
					throw error;
				});
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.json({ message: "Error deleting user", isDeleted: false });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
		return;
	}
}
