import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

/**------------------------------------------------------------------------------------------
 *
 * ~ ██╗   ██╗███████╗███████╗██████╗     ███████╗███╗   ██╗██████╗ ██████╗  ██████╗ ██╗███╗   ██╗████████╗
 * ~ ██║   ██║██╔════╝██╔════╝██╔══██╗    ██╔════╝████╗  ██║██╔══██╗██╔══██╗██╔═══██╗██║████╗  ██║╚══██╔══╝
 * ~ ██║   ██║███████╗█████╗  ██████╔╝    █████╗  ██╔██╗ ██║██║  ██║██████╔╝██║   ██║██║██╔██╗ ██║   ██║
 * ~ ██║   ██║╚════██║██╔══╝  ██╔══██╗    ██╔══╝  ██║╚██╗██║██║  ██║██╔═══╝ ██║   ██║██║██║╚██╗██║   ██║
 * ~ ╚██████╔╝███████║███████╗██║  ██║    ███████╗██║ ╚████║██████╔╝██║     ╚██████╔╝██║██║ ╚████║   ██║
 * ~  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝      ╚═════╝ ╚═╝╚═╝  ╚═══╝   ╚═╝
 *
 * ------------------------------------------------------------------------------------------
 *
 *
 *
 * ------------------------------------------------------------------------------------------
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
		const usersCollection = db.collection("users");

		switch (req.method) {
			/**------------------------------------------------------------------------------------------
			 *
			 * *  ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗    ██╗   ██╗███████╗███████╗██████╗
			 * * ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝    ██║   ██║██╔════╝██╔════╝██╔══██╗
			 * * ██║     ██████╔╝█████╗  ███████║   ██║   █████╗      ██║   ██║███████╗█████╗  ██████╔╝
			 * * ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝      ██║   ██║╚════██║██╔══╝  ██╔══██╗
			 * * ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗    ╚██████╔╝███████║███████╗██║  ██║
			 * *  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝     ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
			 *
			 * ------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * ------------------------------------------------------------------------------------------
			 */
			case "POST": {
				const { newUser } = req.body;

				if (!newUser) {
					res.status(500).json({ error: "No user provided" });
					return;
				}

				const newUserState = await usersCollection.insertOne(newUser);

				res.status(200).json({ newUserState, newUser });
				break;
			}

			/**------------------------------------------------------------------------------------------
			 *
			 * ^  ██████╗ ███████╗████████╗    ██╗   ██╗███████╗███████╗██████╗
			 * ^ ██╔════╝ ██╔════╝╚══██╔══╝    ██║   ██║██╔════╝██╔════╝██╔══██╗
			 * ^ ██║  ███╗█████╗     ██║       ██║   ██║███████╗█████╗  ██████╔╝
			 * ^ ██║   ██║██╔══╝     ██║       ██║   ██║╚════██║██╔══╝  ██╔══██╗
			 * ^ ╚██████╔╝███████╗   ██║       ╚██████╔╝███████║███████╗██║  ██║
			 * ^  ╚═════╝ ╚══════╝   ╚═╝        ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
			 *
			 * ------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * ------------------------------------------------------------------------------------------
			 */
			case "GET": {
				const { getUserId } = req.query;

				if (!getUserId) {
					res.status(500).json({ error: "No user id provided" });
					return;
				}

				const userData = await usersCollection.findOne({
					uid: getUserId,
				});

				res.status(200).json({ userData });
				break;
			}

			/**------------------------------------------------------------------------------------------
			 *
			 * ? ███████╗██████╗ ██╗████████╗    ██╗   ██╗███████╗███████╗██████╗
			 * ? ██╔════╝██╔══██╗██║╚══██╔══╝    ██║   ██║██╔════╝██╔════╝██╔══██╗
			 * ? █████╗  ██║  ██║██║   ██║       ██║   ██║███████╗█████╗  ██████╔╝
			 * ? ██╔══╝  ██║  ██║██║   ██║       ██║   ██║╚════██║██╔══╝  ██╔══██╗
			 * ? ███████╗██████╔╝██║   ██║       ╚██████╔╝███████║███████╗██║  ██║
			 * ? ╚══════╝╚═════╝ ╚═╝   ╚═╝        ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
			 *
			 * ------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * ------------------------------------------------------------------------------------------
			 */
			case "PUT": {
				const { updatedUserData, updateUserId } = req.body;

				if (!updatedUserData || !updateUserId) {
					res.status(500).json({ error: "No user data provided" });
					return;
				}

				const updatedUserState = await usersCollection.updateOne(
					{ uid: updateUserId },
					{ $set: updatedUserData }
				);

				res
					.status(200)
					.json({ newUserState: updatedUserState, newUser: updatedUserData });
				break;
			}

			/**------------------------------------------------------------------------------------------
			 *
			 * ! ██████╗ ███████╗██╗     ███████╗████████╗███████╗    ██╗   ██╗███████╗███████╗██████╗
			 * ! ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝    ██║   ██║██╔════╝██╔════╝██╔══██╗
			 * ! ██║  ██║█████╗  ██║     █████╗     ██║   █████╗      ██║   ██║███████╗█████╗  ██████╔╝
			 * ! ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝      ██║   ██║╚════██║██╔══╝  ██╔══██╗
			 * ! ██████╔╝███████╗███████╗███████╗   ██║   ███████╗    ╚██████╔╝███████║███████╗██║  ██║
			 * ! ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝     ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
			 *
			 * ------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * ------------------------------------------------------------------------------------------
			 */
			case "DELETE": {
				const { userId } = req.body;

				if (!userId) {
					res.status(500).json({ error: "No user id provided" });
					return;
				}

				const deleteState = await usersCollection.deleteOne({
					uid: userId,
				});

				res.status(200).json({ deleteState });
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
				res.status(500).json({ error: "Invalid request method" });
				break;
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
