import { firestoreAdmin } from "@/firebase/adminApp";
import { NextApiRequest, NextApiResponse } from "next";

async function deleteCollection(
	collectionRef: FirebaseFirestore.CollectionReference
) {
	const querySnapshot = await collectionRef.get();
	const batch = firestoreAdmin.batch();

	querySnapshot.forEach(async (doc) => {
		const nestedCollections = await doc.ref.listCollections();

		nestedCollections.forEach(async (nestedCollection) => {
			await deleteCollection(nestedCollection);
		});

		batch.delete(doc.ref);
	});

	await batch.commit();
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (!req.body) {
		res.status(400).json({ message: "Bad request" });
		return;
	}

	const { docId, collectionName, privateKey } = req.body;

	if (!docId) {
		res.status(400).json({ message: "Document ID is required" });
		return;
	}

	if (!collectionName) {
		res.status(400).json({ message: "Collection name is required" });
		return;
	}

	const docRef = firestoreAdmin.collection(collectionName).doc(docId);

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
			const nestedCollections = await docRef.listCollections();

			nestedCollections.forEach(async (nestedCollection) => {
				await deleteCollection(nestedCollection);
			});

			await docRef.delete();
			res
				.status(200)
				.json({ message: "Document deleted successfully", isDeleted: true });
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
