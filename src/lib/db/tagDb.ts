import clientPromise from "../mongodb";

export default async function tagDb() {
	const client = await clientPromise;
	const db = client.db("sorsu-db");
	const tagsCollection = db.collection("tags");

	return {
		tagsCollection,
	};
}
