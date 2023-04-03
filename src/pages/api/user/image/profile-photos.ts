import { clientStorage } from "@/firebase/clientApp";
import clientPromise from "@/lib/mongodb";
import { deleteObject, ref } from "firebase/storage";
import { NextApiRequest, NextApiResponse } from "next";

/**----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 * ~ ██████╗ ██████╗  ██████╗ ███████╗██╗██╗     ███████╗    ██████╗ ██╗  ██╗ ██████╗ ████████╗ ██████╗ ███████╗    ███████╗███╗   ██╗██████╗ ██████╗  ██████╗ ██╗███╗   ██╗████████╗
 * ~ ██╔══██╗██╔══██╗██╔═══██╗██╔════╝██║██║     ██╔════╝    ██╔══██╗██║  ██║██╔═══██╗╚══██╔══╝██╔═══██╗██╔════╝    ██╔════╝████╗  ██║██╔══██╗██╔══██╗██╔═══██╗██║████╗  ██║╚══██╔══╝
 * ~ ██████╔╝██████╔╝██║   ██║█████╗  ██║██║     █████╗      ██████╔╝███████║██║   ██║   ██║   ██║   ██║███████╗    █████╗  ██╔██╗ ██║██║  ██║██████╔╝██║   ██║██║██╔██╗ ██║   ██║
 * ~ ██╔═══╝ ██╔══██╗██║   ██║██╔══╝  ██║██║     ██╔══╝      ██╔═══╝ ██╔══██║██║   ██║   ██║   ██║   ██║╚════██║    ██╔══╝  ██║╚██╗██║██║  ██║██╔═══╝ ██║   ██║██║██║╚██╗██║   ██║
 * ~ ██║     ██║  ██║╚██████╔╝██║     ██║███████╗███████╗    ██║     ██║  ██║╚██████╔╝   ██║   ╚██████╔╝███████║    ███████╗██║ ╚████║██████╔╝██║     ╚██████╔╝██║██║ ╚████║   ██║
 * ~ ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ ╚══════╝    ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝      ╚═════╝ ╚═╝╚═╝  ╚═══╝   ╚═╝
 *
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *
 *
 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */
/**
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 *
 *
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const userProfilePhotosCollection = db.collection("user-profile-photos");

		switch (req.method) {
			/**----------------------------------------------------------------------------------------------------------------------------------------------------------------
			 *
			 * ! ██████╗ ███████╗██╗     ███████╗████████╗███████╗    ██████╗ ██████╗  ██████╗ ███████╗██╗██╗     ███████╗    ██████╗ ██╗  ██╗ ██████╗ ████████╗ ██████╗ ███████╗
			 * ! ██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝    ██╔══██╗██╔══██╗██╔═══██╗██╔════╝██║██║     ██╔════╝    ██╔══██╗██║  ██║██╔═══██╗╚══██╔══╝██╔═══██╗██╔════╝
			 * ! ██║  ██║█████╗  ██║     █████╗     ██║   █████╗      ██████╔╝██████╔╝██║   ██║█████╗  ██║██║     █████╗      ██████╔╝███████║██║   ██║   ██║   ██║   ██║███████╗
			 * ! ██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝      ██╔═══╝ ██╔══██╗██║   ██║██╔══╝  ██║██║     ██╔══╝      ██╔═══╝ ██╔══██║██║   ██║   ██║   ██║   ██║╚════██║
			 * ! ██████╔╝███████╗███████╗███████╗   ██║   ███████╗    ██║     ██║  ██║╚██████╔╝██║     ██║███████╗███████╗    ██║     ██║  ██║╚██████╔╝   ██║   ╚██████╔╝███████║
			 * ! ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ ╚══════╝
			 *
			 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
			 */
			case "DELETE": {
				const { deleteUserId } = req.body;

				if (!deleteUserId) {
					res.status(500).json({ error: "No user id provided" });
					return;
				}

				const deleteProfilePhotos = await userProfilePhotosCollection
					.find({
						userId: deleteUserId,
					})
					.toArray();

				if (deleteProfilePhotos.length === 0) {
					res.status(200).json({
						deleteProfilePhotoState: "No profile photos found",
						deleteUserId,
						isDeleted: true,
					});
					return;
				}

				await Promise.all(
					deleteProfilePhotos.map(async (profilePhoto) => {
						const imageStorageRef = ref(clientStorage, profilePhoto.filePath);

						await deleteObject(imageStorageRef).then(async () => {
							await userProfilePhotosCollection.deleteOne({
								id: profilePhoto.id,
							});
						});
					})
				)
					.then(() => {
						res.status(200).json({
							deleteProfilePhotoState: "Profile photos deleted",
							deleteUserId,
							isDeleted: true,
						});
					})
					.catch((err) => {
						res.status(500).json({ error: err, isDeleted: false });
					});

				break;
			}

			/**----------------------------------------------------------------------------------------------------------------------------------------------------------------
			 *
			 * & ██████╗ ███████╗███████╗ █████╗ ██╗   ██╗██╗  ████████╗
			 * & ██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██║  ╚══██╔══╝
			 * & ██║  ██║█████╗  █████╗  ███████║██║   ██║██║     ██║
			 * & ██║  ██║██╔══╝  ██╔══╝  ██╔══██║██║   ██║██║     ██║
			 * & ██████╔╝███████╗██║     ██║  ██║╚██████╔╝███████╗██║
			 * & ╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝
			 *
			 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
			 *
			 *
			 *
			 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
			 */
			default: {
				res.status(500).json({ error: "No method provided" });
				return;
			}
		}
	} catch (error: any) {
		res.status(500).json({ message: error.message });
		return;
	}
}
