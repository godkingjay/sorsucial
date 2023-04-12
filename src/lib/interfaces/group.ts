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
 * @property {string} [description] - The description of the group.
 * @property {string[]} [groupTags] - The tags of the group.
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
	description?: string;
	groupTags?: string[];
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
 * @property {string} groupId - The unique identifier of the group.
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
	groupId: string;
	role: "owner" | "admin" | "moderator" | "member";
	updatedAt: Date;
	joinedAt: Date;
}

/**
 * This interface is used to define the structure of a group image object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @interface GroupImage
 * @category Interfaces
 * @subcategory SiteGroup
 * @see {@link SiteGroup}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the group image.
 * @property {string} groupId - The unique identifier of the group.
 * @property {number} height - The height of the image.
 * @property {number} width - The width of the image.
 * @property {string} filePath - The path of the image.
 * @property {string} fileName - The name of the image.
 * @property {string} fileType - The type of the image.
 * @property {string} fileURL - The URL of the image.
 * @property {string} fileExtension - The extension of the image.
 * @property {number} fileSize - The size of the image.
 * @property {Date} createdAt - The date and time when the image was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface GroupImage {
	id: string;
	groupId: string;
	height: number;
	width: number;
	filePath: string;
	fileName: string;
	fileType: string;
	fileURL: string;
	fileExtension: string;
	fileSize: number;
	createdAt: Date;
}
