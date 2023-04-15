/**
 * This interface is used to define the structure of a discussion object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface SiteDiscussion
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
 * @property {"discussion" | "group"} discussionType - The type of the discussion.
 * @property {boolean} isHidden - The status of the discussion.
 * @property {boolean} isOpen - The status of the discussion.
 * @property {"public" | "restricted" | "private"} privacy - The privacy type of the discussion.
 * @property {number} numberOfVotes - The number of votes of the discussion.
 * @property {number} numberOfReplies - The number of replies of the discussion.
 * @property {number} numberOfUpVotes - The number of upvotes of the discussion.
 * @property {number} numberOfDownVotes - The number of downvotes of the discussion.
 * @property {Date} updatedAt - The date and time when the discussion was last changed.
 * @property {Date} createdAt - The date and time when the discussion was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface SiteDiscussion {
	id: string;
	groupId?: string;
	creatorId: string;
	discussionTitle: string;
	discussionBody?: string;
	discussionTags: string[];
	discussionType: "discussion" | "group";
	isHidden: boolean;
	isOpen: boolean;
	privacy: "public" | "restricted" | "private";
	numberOfVotes: number;
	numberOfReplies: number;
	numberOfUpVotes: number;
	numberOfDownVotes: number;
	updatedAt: Date;
	createdAt: Date;
}

/**
 * This interface is used to define the structure of a discussion vote object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface DiscussionVote
 * @category Interfaces
 * @subcategory Discussion
 * @see {@link Discussion}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {string} discussionId - The unique identifier of the discussion.
 * @property {string} [groupId] - The unique identifier of the group.
 * @property {1 | -1} voteValue - The value of the vote.
 * @property {Date} updatedAt - The date and time when the vote was last changed.
 * @property {Date} createdAt - The date and time when the vote was created.
 *
 * ----------------------------------------------------------------
 *
 * @property {number}
 */
export interface DiscussionVote {
	userId: string;
	discussionId: string;
	groupId?: string;
	voteValue: 1 | -1;
	updatedAt: Date;
	createdAt: Date;
}

/**
 * This interface is used to define the structure of a reply object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface Reply
 * @category Interfaces
 * @subcategory Discussion
 * @see {@link Discussion}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the reply.
 * @property {string} creatorId - The unique identifier of the reply creator.
 * @property {string} discussionId - The unique identifier of the discussion.
 * @property {string} replyForId - The unique identifier of the reply.
 * @property {string} [groupId] - The unique identifier of the group.
 * @property {string} replyText - The text of the reply.
 * @property {number} replyLevel - The level of the reply.
 * @property {number} numberOfVotes - The number of votes of the reply.
 * @property {number} numberOfReplies - The number of replies of the reply.
 * @property {boolean} isHidden - The status of the reply.
 * @property {"reply" | "approved" | "disapproved"} replyStatus - The status of the reply.
 * @property {Date} updatedAt - The date and time when the reply was last changed.
 * @property {Date} createdAt - The date and time when the reply was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Reply {
	id: string;
	creatorId: string;
	discussionId: string;
	replyForId: string;
	groupId?: string;
	replyText: string;
	replyLevel: number;
	numberOfVotes: number;
	numberOfReplies: number;
	isHidden: boolean;
	replyStatus: "reply" | "approved" | "disapproved";
	updatedAt: Date;
	createdAt: Date;
}

/**
 * This interface is used to define the structure of a reply vote object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface ReplyVote
 * @category Interfaces
 * @subcategory Reply
 * @see {@link Reply}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} replyId - The unique identifier of the reply.
 * @property {string} userId - The unique identifier of the user.
 * @property {string} [groupId] - The unique identifier of the group.
 * @property {string} discussionId - The unique identifier of the discussion.
 * @property {1 | -1} voteValue - The value of the vote.
 * @property {Date} updatedAt - The date and time when the vote was last changed.
 * @property {Date} createdAt - The date and time when the vote was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface ReplyVote {
	replyId: string;
	userId: string;
	groupId?: string;
	discussionId: string;
	voteValue: 1 | -1;
	updatedAt: Date;
	createdAt: Date;
}
