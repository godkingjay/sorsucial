import mongoDb from "./db";

export default async function tagDb() {
	const { sorsuDb } = await mongoDb();

	const tagsCollection = sorsuDb.collection("tags");

	return {
		tagsCollection,
	};
}
