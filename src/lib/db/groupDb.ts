import mongoDb from "./db";

/**
 * This function is responsible for returning the collections for the group database.
 * This function is used to abstract the database from the rest of the application.
 * This function is used to prevent the database from being accessed directly.
 *
 * @returns {Promise<{
 *  groupsCollection: Collection<SiteGroup>;
 *  groupMembersCollection: Collection<GroupMember>;
 *  groupImagesCollection: Collection<GroupImage>;
 * }>} - Returns a promise that resolves to an object containing the collections for the group database.
 *
 * @category Database
 * @see {@link groupDb}
 */
export default async function groupDb() {
	const { sorsuDb } = await mongoDb();
	/**
	 * This constant is used to store the groups collection.
	 *
	 * @type {Collection<SiteGroup>}
	 */
	const groupsCollection = sorsuDb.collection("groups");
	/**
	 * This constant is used to store the group members collection.
	 *
	 * @type {Collection<GroupMember>}
	 */
	const groupMembersCollection = sorsuDb.collection("group-members");
	/**
	 * This constant is used to store the group images collection.
	 *
	 * @type {Collection<GroupImage>}
	 */
	const groupImagesCollection = sorsuDb.collection("group-images");

	return {
		groupsCollection,
		groupMembersCollection,
		groupImagesCollection,
	};
}
