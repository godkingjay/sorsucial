import clientPromise from "../mongodb";

export default async function mongoDb() {
	const client = await clientPromise;
	const sorsuDb = await client.db("sorsu-db");

	return {
		client,
		sorsuDb,
	};
}
