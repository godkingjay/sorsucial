import { apiConfig } from "../../../lib/api/apiConfig";
import { authAdmin } from "@/firebase/adminApp";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Create a new user in the Firebase Authentication service.
 * This is an admin-only endpoint.
 *
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @return {*}
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (!req.body) {
		res.status(400).json({ message: "Bad request" });
		return;
	}

	/**
	 * @type {string} email - The email address of the user.
	 * @type {string} password - The password of the user.
	 * @type {string} privateKey - The private key of the admin.
	 *
	 * @see https://nextjs.org/docs/api-routes/api-middlewares
	 */
	const { email, password, privateKey } = req.body;

	/**
	 * If the email or password is not provided, return a 400 status code.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
	 */
	if (!email || !password) {
		res.status(400).json({ message: "Email and password are required" });
		return;
	}

	/**
	 * If the private key is not provided or is incorrect, return a 401 status code.
	 * The private key is stored in the environment variables.
	 *
	 * @see https://nextjs.org/docs/basic-features/environment-variables
	 */
	if (!privateKey || privateKey !== apiConfig.privateKey) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	/**
	 * If the request method is POST, create a new user in the Firebase Authentication service.
	 * If the request method is not POST, return a 405 status code.
	 */
	if (req.method === "POST") {
		/**
		 * Create a new user in the Firebase Authentication service.
		 */
		try {
			/**
			 * Create a new user in the Firebase Authentication service
			 * and return the user's uid.
			 */
			await authAdmin
				.createUser({
					email,
					password,
				})
				.then((user) => {
					/**
					 * If the user is created successfully, return a 200 status code
					 * and the user's uid.
					 *
					 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
					 */
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
	} else {
		res.status(405).json({ message: "Method not allowed" });
		return;
	}
}
