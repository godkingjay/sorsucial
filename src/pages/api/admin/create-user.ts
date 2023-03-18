import { authAdmin } from "@/firebase/adminApp";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { email, password, privateKey } = req.body;

	if (!email || !password) {
		res.status(400).json({ message: "Email and password are required" });
		return;
	}

	if (
		!privateKey ||
		privateKey !==
			process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")
	) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	if (req.method !== "POST") {
		res.status(405).json({ message: "Method not allowed" });
		return;
	}

	if (req.method === "POST") {
		try {
			await authAdmin
				.createUser({
					email,
					password,
				})
				.then((user) => {
					res
						.status(200)
						.json({ message: "User created successfully", uid: user.uid });
				})
				.catch((error) => {
					console.log(
						`Admin creating user authentication ${email}: `,
						error.message
					);
					throw error;
				});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Error creating user" });
		}
	}
}
