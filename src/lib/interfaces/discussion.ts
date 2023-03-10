import { Timestamp } from "firebase/firestore";

/**
 * This interface is used to define the structure of a discussion object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface Discussion
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the discussion.
 * @property {string} [groupId] - The unique identifier of the group.
 * @property {string} creatorId - The unique identifier of the discussion creator.
 * @property {string} discussionTitle - The title of the discussion.
 * @property {string} [discussionBody] - The body of the discussion.
 * @property {string[]} discussionTags - The tags of the discussion.
 * @property {boolean} isHidden - The status of the discussion.
 * @property {boolean} isOpen - The status of the discussion.
 * @property {"public" | "restricted" | "private"} privacyType - The privacy type of the discussion.
 * @property {number} numberOfVotes - The number of votes of the discussion.
 * @property {number} numberOfReplies - The number of replies of the discussion.
 * @property {number} numberOfUpVotes - The number of upvotes of the discussion.
 * @property {number} numberOfDownVotes - The number of downvotes of the discussion.
 * @property {Timestamp} createdAt - The date and time when the discussion was created.
 * @property {Timestamp} [lastChangeAt] - The date and time when the discussion was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Discussion {
	id: string;
	groupId?: string;
	creatorId: string;
	discussionTitle: string;
	discussionBody?: string;
	discussionTags: string[];
	isHidden: boolean;
	isOpen: boolean;
	privacyType: "public" | "restricted" | "private";
	numberOfVotes: number;
	numberOfReplies: number;
	numberOfUpVotes: number;
	numberOfDownVotes: number;
	createdAt: Timestamp;
	lastChangeAt?: Timestamp;
}
