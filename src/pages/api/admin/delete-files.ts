import { storageAdmin } from "@/firebase/adminApp";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { path, privateKey } = req.body;

	if (!path) {
		res.status(400).json({ message: "Path is required" });
		return;
	}

	const [files] = await storageAdmin.bucket().getFiles({
		prefix: path,
	});

	if (!files) {
		res.status(400).json({ message: "Files not found" });
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

	if (req.method === "POST") {
		try {
			const deleteFiles = async (files: any) => {
				files.forEach(async (file: any) => {
					await file.delete();
				});
			};

			await deleteFiles(files).catch((error) => {
				console.error(error);
				res
					.status(500)
					.json({ message: "Error deleting files", isDeleted: false });
			});

			res.status(200).json({
				message: "Files deleted",
				isDeleted: true,
			});
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.json({ message: "Error deleting files", isDeleted: false });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
		return;
	}
}
