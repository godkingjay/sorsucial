import { Timestamp } from "firebase/firestore";

/**
 * This interface is used to define the structure of a group object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface Group
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the group.
 * @property {string} name - The name of the group.
 * @property {string} creatorId - The unique identifier of the group creator.
 * @property {Timestamp} createdAt - The date and time when the group was created.
 * @property {"public" | "restricted" | "private"} privacyType - The privacy type of the group.
 * @property {number} numberOfMembers - The number of members in the group.
 * @property {string} [imageURL] - The URL of the group's image.
 * @property {Timestamp} [lastPostAt] - The date and time when the group last posted.
 * @property {Timestamp} [lastChangeAt] - The date and time when the group was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Group {
	id: string;
	name: string;
	creatorId: string;
	createdAt: Timestamp;
	privacyType: "public" | "restricted" | "private";
	numberOfMembers: number;
	imageURL?: string;
	lastPostAt?: Timestamp;
	lastChangeAt?: Timestamp;
}
