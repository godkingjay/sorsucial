import clientPromise from "../mongodb";

export default async function userDb() {
	const client = await clientPromise;
	const db = client.db("sorsu-db");
	const apiKeysCollection = db.collection("api-keys");
	const usersCollection = db.collection("users");
	const userProfilePhotosCollection = db.collection("user-profile-photos");

	return {
		apiKeysCollection,
		usersCollection,
		userProfilePhotosCollection,
	};
}
