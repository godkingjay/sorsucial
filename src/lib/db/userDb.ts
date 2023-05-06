import mongoDb from "./db";

export default async function userDb() {
	const { sorsuDb } = await mongoDb();

	const apiKeysCollection = sorsuDb.collection("api-keys");
	const usersCollection = sorsuDb.collection("users");
	const userProfilePhotosCollection = sorsuDb.collection("user-profile-photos");

	return {
		apiKeysCollection,
		usersCollection,
		userProfilePhotosCollection,
	};
}
