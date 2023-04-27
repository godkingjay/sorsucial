import { GroupMember, SiteGroup } from "../interfaces/group";
import clientPromise from "../mongodb";

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
	/**
	 * This constant is used to store the client connection to the database.
	 */
	const client = await clientPromise;
	/**
	 * This constant is used to store the database.
	 */
	const db = client.db("sorsu-db");
	/**
	 * This constant is used to store the groups collection.
	 *
	 * @type {Collection<SiteGroup>}
	 */
	const groupsCollection = db.collection("groups");
	/**
	 * This constant is used to store the group members collection.
	 *
	 * @type {Collection<GroupMember>}
	 */
	const groupMembersCollection = db.collection("group-members");
	/**
	 * This constant is used to store the group images collection.
	 *
	 * @type {Collection<GroupImage>}
	 */
	const groupImagesCollection = db.collection("group-images");

	return {
		groupsCollection,
		groupMembersCollection,
		groupImagesCollection,
	};
}
