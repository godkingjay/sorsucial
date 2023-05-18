import { authAdmin } from "@/firebase/adminApp";
import { apiConfig } from "@/lib/api/apiConfig";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { SiteUser } from "@/lib/interfaces/user";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { clientAuth } from "@/firebase/clientApp";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { apiKeysCollection, usersCollection } = await userDb();

		const { apiKey, privateKey, oldPassword, newPassword } =
			req.body || req.query;

		if (!apiKey || !privateKey) {
			return res.status(400).json({ message: "Bad Request" });
		}

		if (privateKey !== apiConfig.privateKey) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		if (!oldPassword || !newPassword) {
			return res.status(400).json({ message: "Bad Request" });
		}

		if (!apiKeysCollection) {
			return res.status(500).json({ message: "Internal Server Error" });
		}

		if (!usersCollection) {
			return res.status(500).json({ message: "Internal Server Error" });
		}

		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey as string,
		})) as unknown as SiteUserAPI;

		if (!userAPI) {
			return res.status(401).json({ message: "Invalid API Key" });
		}

		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		if (!userData) {
			return res.status(401).json({ error: "Invalid User" });
		}

		const userRecord = await authAdmin.getUser(userData.uid);

		if (!userRecord) {
			return res.status(401).json({ error: "Invalid User" });
		}

		switch (req.method) {
			case "POST": {
				const user = await signInWithEmailAndPassword(
					clientAuth,
					userData.email,
					oldPassword as string
				).catch((error) => {
					return res.status(401).json({ error });
				});

				if (!user) {
					return res.status(401).json({ error: "Invalid User" });
				}

				if (newPassword === oldPassword) {
					return res.status(400).json({
						message: "New password cannot be the same as the old password",
					});
				}

				await authAdmin.updateUser(userData.uid, {
					password: newPassword as string,
				});

				return res.status(200).json({ message: "Password Updated" });

				break;
			}

			default: {
				return res.status(405).json({ message: "Method Not Allowed" });

				break;
			}
		}
	} catch (error: any) {
		return res.status(500).json({ message: error.message });
	}
}
