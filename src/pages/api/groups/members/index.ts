import groupDb from "@/lib/db/groupDb";
import userDb from "@/lib/db/userDb";
import { SiteUserAPI } from "@/lib/interfaces/api";
import { GroupMember, SiteGroup } from "@/lib/interfaces/group";
import { SiteUser } from "@/lib/interfaces/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		/**
		 * Gets the required collections from the user and group databases.
		 * @function
		 * @async
		 * @returns {Promise<{apiKeysCollection: Collection, usersCollection: Collection}>} Object containing the apiKeysCollection and usersCollection.
		 */
		const { apiKeysCollection, usersCollection } = await userDb();

		/**
		 *
		 * Gets the required collections from the group database.
		 * @function
		 * @returns {Promise<{groupsCollection: Collection, groupMembersCollection: Collection}>} Object containing the groupsCollection and groupMembersCollection.
		 * @async
		 */
		const { groupsCollection, groupMembersCollection } = await groupDb();

		/**
		 * Extracts the required parameters from the request body or query.
		 */
		const {
			apiKey,
			groupId,
			userId,
			groupMemberData: rawGroupMemberData,
		} = req.body || req.query;

		/**
		 * Parses and formats the group member data.
		 * @typedef {Object} GroupMember
		 * @property {string} name - The name of the group member.
		 * @property {string} email - The email of the group member.
		 * @property {string} [role] - The role of the group member.
		 * @property {string[]} [tags] - An array of tags associated with the group member.
		 * @property {string} [profilePicture] - A URL to the profile picture of the group member.
		 * @type {GroupMember}
		 */
		const groupMemberData: GroupMember =
			typeof rawGroupMemberData === "string"
				? JSON.parse(rawGroupMemberData)
				: rawGroupMemberData;

		/**
		 * Checks if API key was provided and verifies it.
		 * @param {string} apiKey - The API key to be verified.
		 */
		if (!apiKey) {
			res.status(400).json({ error: "No API key provided!" });
		}

		/**
		 * Checks if there is a connection with the API Keys Database.
		 */
		if (!apiKeysCollection) {
			res
				.status(503)
				.json({ error: "Cannot connect with the API Keys Database!" });
		}

		/**
		 * Checks if there is a connection with the Users Database.
		 */
		if (!usersCollection) {
			res.status(503).json({ error: "Cannot connect with the Users Database!" });
		}

		/**
		 * Checks if there is a connection with the Groups Database and Group Members Collection.
		 */
		if (!groupsCollection || !groupMembersCollection) {
			res
				.status(503)
				.json({ error: "Cannot connect with the Groups Database!" });
		}

		/**
		 * Verifies the API key and retrieves user data.
		 * @type {SiteUserAPI}
		 */
		const userAPI = (await apiKeysCollection.findOne({
			"keys.key": apiKey,
		})) as unknown as SiteUserAPI;

		/**
		 * If the API key is invalid, return a 401 Unauthorized status code.
		 * @type {SiteUser}
		 */
		if (!userAPI) {
			res.status(401).json({ error: "Invalid API key" });
		}

		/**
		 * Retrieves user data using the user ID associated with the API key.
		 * @type {SiteUser}
		 */
		const userData = (await usersCollection.findOne({
			uid: userAPI.userId,
		})) as unknown as SiteUser;

		/**
		 * If user data is invalid, return a 401 Unauthorized status code.
		 */
		if (!userData) {
			res.status(401).json({ error: "Invalid user" });
		}

		const groupData = (await groupsCollection.findOne({
			id: groupId || groupMemberData.groupId,
		})) as unknown as SiteGroup;

		switch (req.method) {
			/**
			 * This is a case statement that handles the HTTP POST request method.
			 * It contains code that updates or inserts a new group member into the
			 * groupMembersCollection in the database.
			 */
			case "POST": {
				try {
					/**
					 * This code is querying the groupMembersCollection to find a document
					 * that matches the groupId and userId properties of the groupMemberData
					 * object. It is using the findOne method to retrieve a single document
					 * that matches the query, and the GroupMember type is specified as the
					 * generic type parameter to ensure that the returned document is of the
					 * correct type. The result is stored in the existingMember variable.
					 *
					 * @param {string} groupId - The ID of the group.
					 * @param {string} userId - The ID of the user.
					 *
					 * @returns {Promise<GroupMember>} A promise that resolves to a GroupMember object.
					 *
					 * @see {@link https://docs.mongodb.com/manual/reference/method/db.collection.findOne/ | findOne}
					 */
					const existingMember =
						await groupMembersCollection.findOne<GroupMember>({
							groupId: groupMemberData.groupId,
							userId: groupMemberData.userId,
						});

					/**
					 * This code is checking if an existing group member document exists in the
					 * groupMembersCollection database that matches the groupId and userId properties of
					 * the groupMemberData object. If an existing member is found, it checks if the roles
					 * array of the existing member includes the strings "pending" or "rejected". If either of
					 * these strings are present, it sets the joinStatus variable to "accepted", indicating
					 * that the member has already been invited and needs to accept the invitation. If neither
					 * of these strings are present, it sets the joinStatus variable to "added", indicating
					 * that the member has already been added to the group. If no existing member is found,
					 * it sets the joinStatus variable to "added", indicating that the member is being added
					 * to the group for the first time.
					 */
					const joinStatus: "accepted" | "added" = existingMember
						? existingMember.roles.includes("pending") ||
						  existingMember.roles.includes("rejected")
							? "accepted"
							: "added"
						: "added";

					/**
					 * This code is updating or inserting a new document into the `groupMembersCollection` in the
					 * database. It is using the `findOneAndUpdate` method to find a document that matches the
					 * `groupId` and `userId` properties of the `groupMemberData` object. If a matching document is
					 * found, it updates the document with the new `groupMemberData` object.
					 *
					 * If no matching document is found, it inserts a new document with the `groupMemberData` object
					 * using the `upsert` option. The `returnDocument` option is set to "after" to return the updated
					 * document. The result of the operation is stored in the `result` variable.
					 *
					 * @param {string} groupId - The ID of the group.
					 * @param {string} userId - The ID of the user.
					 *
					 * @returns {Promise<FindAndModifyWriteOpResultObject<GroupMember>>} A promise that resolves to a FindAndModifyWriteOpResultObject object.
					 *
					 * @see {@link https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/ | findOneAndUpdate}
					 */
					const result = await groupMembersCollection.findOneAndUpdate(
						{
							groupId: groupMemberData.groupId,
							userId: groupMemberData.userId,
						},
						{
							$set: groupMemberData,
						},
						{
							upsert: true,
							returnDocument: "after",
						}
					);

					/**
					 * This code is retrieving the `_id` property of the `result.value`
					 * object and storing it in the `upsertedId` variable.
					 */
					const upsertedId = result.value?._id;

					if (!existingMember || joinStatus === "added") {
						/**
						 * This code is updating the `numberOfMembers` property of the group
						 * document in the `groupsCollection` database. It is using the `updateOne`
						 * method to update a single document that matches the `id` property of the
						 * `groupMemberData` object. It is using the `$inc` operator to increment the
						 * `numberOfMembers` property by 1.
						 *
						 * @param {string} id - The ID of the group.
						 *
						 * @returns {Promise<UpdateWriteOpResult>} A promise that resolves to an UpdateWriteOpResult object.
						 *
						 * @see {@link https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/ | updateOne}
						 * @see {@link https://docs.mongodb.com/manual/reference/operator/update/inc/ | inc}
						 */
						await groupsCollection.updateOne(
							{
								id: groupMemberData.groupId,
							},
							{
								$inc: {
									numberOfMembers: 1,
								},
							}
						);
					}

					/**
					 * This code is sending a response to the client with a 200 OK HTTP status code
					 * and a JSON object containing the `success`, `groupMemberData`, and `joinStatus`
					 * properties.
					 *
					 * @param {boolean} success - Indicates whether the operation was successful.
					 * @param {Partial<GroupMember>} groupMemberData - The group member data.
					 * @param {string} joinStatus - The join status.
					 *
					 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201 | 201 OK}
					 */
					res.status(201).json({
						success: true,
						groupMemberData: {
							_id: upsertedId,
							...groupMemberData,
						} as Partial<GroupMember>,
						joinStatus,
					});
				} catch (error: any) {
					res.status(500).json({
						error: `MongoDB - POST: Creating new Group Member Error:\n${error.message}`,
					});
				}
				break;
			}

			case "DELETE": {
				try {
					/**
					 * This code is querying the groupMembersCollection to find a document
					 * that matches the groupId and userId properties of the groupMemberData
					 * object. It is using the findOne method to retrieve a single document
					 * that matches the query, and the GroupMember type is specified as the
					 * generic type parameter to ensure that the returned document is of the
					 * correct type. The result is stored in the existingMember variable.
					 *
					 * @param {string} groupId - The ID of the group.
					 * @param {string} userId - The ID of the user.
					 *
					 * @returns {Promise<GroupMember>} A promise that resolves to a GroupMember object.
					 *
					 * @see {@link https://docs.mongodb.com/manual/reference/method/db.collection.findOne/ | findOne}
					 */
					const existingMember =
						await groupMembersCollection.findOne<GroupMember>({
							groupId: groupId,
							userId: userId,
						});

					if (!existingMember) {
						/**
						 * If the document does not exist, return a 404 Not Found HTTP status code
						 *
						 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404 | 404 Not Found}
						 */
						return res.status(404).json({
							success: false,
							error: "Group member not found",
						});
					}

					/**
					 * The above code is checking if the user making the request has the necessary permissions to
					 * perform a certain action. It checks if the user is not the same as an existing member, is not
					 * an admin, and the existing member does not have the roles of owner, admin, or moderator. If all
					 * of these conditions are not met, the code returns a 403 error with a message indicating that
					 * the user does not have permission to perform the action.
					 *
					 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403 | 403 Forbidden}
					 */
					if (userData.uid !== existingMember.userId) {
						if (!userData.roles.includes("admin")) {
							if (!existingMember.roles.includes("owner")) {
								if (!existingMember.roles.includes("admin")) {
									if (!existingMember.roles.includes("moderator")) {
										return res.status(403).json({
											success: false,
											error: "You do not have permission to perform this action",
										});
									}
								}
							}
						}
					}

					/**
					 * This code is deleting a document from the `groupMembersCollection` in the
					 * database. It is using the `deleteOne` method to delete a single document that
					 * matches the `groupId` and `userId` properties of the `req.params` object.
					 *
					 * @param {string} groupId - The ID of the group.
					 * @param {string} userId - The ID of the user.
					 *
					 * @returns {Promise<DeleteWriteOpResultObject>} A promise that resolves to a DeleteWriteOpResultObject object.
					 *
					 * @see {@link https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/ | deleteOne}
					 */
					await groupMembersCollection.deleteOne({
						groupId: groupId,
						userId: userId,
					});

					/**
					 * This code is updating the `numberOfMembers` property of the group
					 * document in the `groupsCollection` database. It is using the `updateOne`
					 * method to update a single document that matches the `id` property of the
					 * `groupMemberData` object. It is using the `$inc` operator to decrement the
					 * `numberOfMembers` property by 1.
					 *
					 * @param {string} id - The ID of the group.
					 *
					 * @returns {Promise<UpdateWriteOpResult>} A promise that resolves to an UpdateWriteOpResult object.
					 *
					 * @see {@link https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/ | updateOne}
					 * @see {@link https://docs.mongodb.com/manual/reference/operator/update/inc/ | inc}
					 */
					await groupsCollection.updateOne(
						{
							id: groupId,
						},
						{
							$inc: {
								numberOfMembers: -1,
							},
						}
					);

					/**
					 * This code is sending a response to the client with a 200 OK HTTP status code
					 * and a JSON object containing the `success` property.
					 */
					return res.status(200).json({
						isDeleted: true,
					});
				} catch (error: any) {
					res.status(500).json({ error: error.message });
				}
			}

			default: {
				res.status(405).json({ error: "Method not supported" });
			}
		}
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
}
