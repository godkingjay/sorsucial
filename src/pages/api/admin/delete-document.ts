import { adminDb } from "@/firebase/adminApp";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (!req.body) {
		res.status(400).json({ message: "Bad request" });
		return;
	}

	const { docId, collectionName, privateKey, path } = req.body;

	if (!docId) {
		res.status(400).json({ message: "Document ID is required" });
		return;
	}

	if (!collectionName) {
		res.status(400).json({ message: "Collection name is required" });
		return;
	}

	const docRef = adminDb
		.collection(path ? `${path}/${collectionName}` : collectionName)
		.doc(docId);

	if (!docRef) {
		res.status(400).json({ message: "Document not found" });
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
			const deleteDocument = async (
				documentRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
			) => {
				const nestedCollections = Array.from(
					await documentRef.listCollections()
				);

				nestedCollections.forEach(async (nestedCollection) => {
					await deleteCollection(nestedCollection);
				});

				await documentRef.delete();
			};

			const deleteCollection = async (
				collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
			) => {
				const collectionDocuments = Array.from(
					await collectionRef.listDocuments()
				);

				collectionDocuments.forEach(async (collectionDocument) => {
					await deleteDocument(collectionDocument);
				});
			};

			await deleteDocument(docRef)
				.then(() => {
					res.status(200).json({
						message: "Document and nested collections deleted",
						isDeleted: true,
					});
				})
				.catch((error) => {
					console.error(error);
					res
						.status(500)
						.json({ message: "Error deleting document", isDeleted: false });
				});
			return;
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.json({ message: "Error deleting document", isDeleted: false });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
		return;
	}
}
