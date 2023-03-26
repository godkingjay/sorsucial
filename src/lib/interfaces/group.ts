/**
 * This interface is used to define the structure of a group object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface SiteGroup
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the group.
 * @property {string} name - The name of the group.
 * @property {string} creatorId - The unique identifier of the group creator.
 * @property {"public" | "restricted" | "private"} privacyType - The privacy type of the group.
 * @property {number} numberOfMembers - The number of members in the group.
 * @property {string} [imageURL] - The URL of the group's image.
 * @property {Date} [lastPostAt] - The date and time when the group last posted.
 * @property {Date} updatedAt - The date and time when the group was last changed.
 * @property {Date} createdAt - The date and time when the group was created.
 *
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface SiteGroup {
	id: string;
	name: string;
	creatorId: string;
	privacyType: "public" | "restricted" | "private";
	numberOfMembers: number;
	imageURL?: string;
	lastPostAt?: Date;
	updatedAt: Date;
	createdAt: Date;
}

/**
 * This interface is used to define the structure of a group member object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface GroupMember
 * @category Interfaces
 * @subcategory SiteGroup
 * @see {@link SitGroup}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {"owner" | "admin" | "moderator" | "member"} role - The role of the user in the group.
 * @property {Date} updatedAt - The date and time when the group member was last changed.
 * @property {Date} joinedAt - The date and time when the user joined the group.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface GroupMember {
	userId: string;
	role: "owner" | "admin" | "moderator" | "member";
	updatedAt: Date;
	joinedAt: Date;
}
