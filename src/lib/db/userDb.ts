import clientPromise from "../mongodb";

export default async function userDb() {
	const client = await clientPromise;
	const db = client.db("sorsu-db");
	const usersCollection = db.collection("users");
	const apiKeysCollection = db.collection("api-keys");
	return {
		usersCollection,
		apiKeysCollection,
	};
}
