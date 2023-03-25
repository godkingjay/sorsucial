import { authAdmin } from "@/firebase/adminApp";
import { apiConfig } from "@/lib/api/apiConfig";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		switch (req.method) {
			case "POST":
				// Create a new user in the Firebase Authentication service.
				const { newUserEmail, newUserPassword, postPrivateKey } = req.body;

				if (!newUserEmail || !newUserPassword) {
					res.status(400).json({ message: "Email and password are required" });
					return;
				}

				if (!postPrivateKey || postPrivateKey !== apiConfig.privateKey) {
					res.status(401).json({ message: "Unauthorized" });
					return;
				}

				await authAdmin
					.createUser({
						email: newUserEmail,
						password: newUserPassword,
					})
					.then((user) => {
						res.status(200).json({
							message: "Account created successfully",
							userId: user.uid,
						});
					})
					.catch((error) => {
						res.status(500).json({
							message: "Error creating account",
							error: error.message,
						});
						return;
					});
				break;

			case "DELETE":
				// Delete a user from the Firebase Authentication service.
				const { deleteUserId, deletePrivateKey } = req.body;

				if (!deleteUserId) {
					res.status(400).json({ message: "User ID is required" });
					return;
				}

				if (!deletePrivateKey || deletePrivateKey !== apiConfig.privateKey) {
					res.status(401).json({ message: "Unauthorized" });
					return;
				}

				authAdmin
					.deleteUser(deleteUserId)
					.then(() => {
						res.status(200).json({
							message: "Account deleted successfully",
							isDeleted: true,
						});
					})
					.catch((error) => {
						res.status(500).json({
							message: "Error deleting account",
							error: error.message,
						});
						return;
					});
				break;

			default:
				res.status(405).json({ message: "Method not allowed" });
				return;
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
		return;
	}
}
