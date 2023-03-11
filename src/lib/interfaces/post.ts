import { Timestamp } from "firebase/firestore";

/**
 * This interface is used to define the structure of a post object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface SitePost
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the post.
 * @property {string} [groupId] - The unique identifier of the group.
 * @property {string} creatorId - The unique identifier of the post creator.
 * @property {string} postTitle - The title of the post.
 * @property {string} [postBody] - The body of the post.
 * @property {string[]} [postTags] - The tags of the post.
 * @property {Timestamp} createdAt - The date and time when the post was created.
 * @property {boolean} hasImageOrVideo - Whether the post has an image or video.
 * @property {boolean} hasFile - Whether the post has a file.
 * @property {boolean} hasLink - Whether the post has a link.
 * @property {boolean} hasPoll - Whether the post has a poll.
 * @property {boolean} isHidden - Whether the post is hidden.
 * @property {boolean} isCommentable - Whether the post is commentable.
 * @property {"public" | "restricted" | "private"} privacy - The privacy of the post.
 * @property {number} numberOfLikes - The number of likes of the post.
 * @property {number} numberOfComments - The number of comments of the post.
 * @property {Timestamp} [lastChangeAt] - The date and time when the post was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface SitePost {
	id: string;
	groupId?: string;
	creatorId: string;
	postTitle: string;
	postBody?: string;
	postTags?: string[];
	createdAt: Timestamp;
	hasImageOrVideo: boolean;
	hasFile: boolean;
	hasLink: boolean;
	hasPoll: boolean;
	isHidden: boolean;
	isCommentable: boolean;
	privacy: "public" | "restricted" | "private";
	numberOfLikes: number;
	numberOfComments: number;
	lastChangeAt?: Timestamp;
}

/**
 * This interface is used to define the structure of a post image or video object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface PostImageOrVideo
 * @category Interfaces
 * @subcategory SitePost
 * @see {@link SitePost}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the image or video.
 * @property {number} index - The index of the image or video.
 * @property {string} postId - The unique identifier of the post.
 * @property {string} filePath - The path of the image or video.
 * @property {string} fileName - The name of the image or video.
 * @property {string} fileType - The type of the image or video.
 * @property {string} fileUrl - The URL of the image or video.
 * @property {string} fileExtension - The extension of the image or video.
 * @property {string} [fileTitle] - The title of the image or video.
 * @property {string} [fileDescription] - The description of the image or video.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostImageOrVideo {
	id: string;
	index: number;
	postId: string;
	filePath: string;
	fileName: string;
	fileType: string;
	fileUrl: string;
	fileExtension: string;
	fileTitle?: string;
	fileDescription?: string;
}

/**
 * This interface is used to define the structure of a post file object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface PostFile
 * @category Interfaces
 * @subcategory SitePost
 * @see {@link SitePost}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the file.
 * @property {number} index - The index of the file.
 * @property {string} postId - The unique identifier of the post.
 * @property {string} filePath - The path of the file.
 * @property {string} fileName - The name of the file.
 * @property {string} fileType - The type of the file.
 * @property {string} fileUrl - The URL of the file.
 * @property {string} fileExtension - The extension of the file.
 * @property {string} [fileTitle] - The title of the file.
 * @property {string} [fileDescription] - The description of the file.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostFile {
	id: string;
	index: number;
	postId: string;
	filePath: string;
	fileName: string;
	fileType: string;
	fileUrl: string;
	fileExtension: string;
	fileTitle?: string;
	fileDescription?: string;
}

/**
 * This interface is used to define the structure of a post link object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface PostLink
 * @category Interfaces
 * @subcategory SitePost
 * @see {@link SitePost}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the link.
 * @property {number} index - The index of the link.
 * @property {string} postId - The unique identifier of the post.
 * @property {string} [linkTitle] - The title of the link.
 * @property {string} [linkDescription] - The description of the link.
 * @property {string} url - The URL of the link.
 * @property {boolean} blocked - Whether the link is blocked.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostLink {
	id: string;
	index: number;
	postId: string;
	linkTitle?: string;
	linkDescription?: string;
	url: string;
	blocked: boolean;
}

/**
 * This interface is used to define the structure of a post poll object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface PostPoll
 * @category Interfaces
 * @subcategory SitePost
 * @see {@link SitePost}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the poll.
 * @property {string} postId - The unique identifier of the post.
 * @property {string} pollTitle - The title of the poll.
 * @property {string} [pollDescription] - The description of the poll.
 * @property {number} numberOfVotes - The number of votes of the poll.
 * @property {number} [maxVotes] - The maximum number of votes of the poll.
 * @property {boolean} isActive - Whether the poll is active.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostPoll {
	id: string;
	postId: string;
	pollTitle: string;
	pollDescription?: string;
	numberOfVotes: number;
	maxVotes?: number;
	isActive: boolean;
}

/**
 * This interface is used to define the structure of a poll item object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface PollItem
 * @category Interfaces
 * @subcategory PostPoll
 * @see {@link PostPoll}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the poll item.
 * @property {string} postId - The unique identifier of the post.
 * @property {string} pollId - The unique identifier of the poll.
 * @property {string} [pollItemTitle] - The title of the poll item.
 * @property {number} voteStatus - The vote status of the poll item.
 * @property {string} [logoType] - The logo type of the poll item.
 * @property {string} [emoji] - The emoji of the poll item.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PollItem {
	id: string;
	postId: string;
	pollId: string;
	pollItemTitle?: string;
	voteStatus: number;
	logoType?: "emoji" | "image";
	emoji?: string;
}

/**
 * This interface is used to define the structure of a poll item logo object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface PollItemLogo
 * @category Interfaces
 * @subcategory PollItem
 * @see {@link PollItem}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the poll item logo.
 * @property {string} postId - The unique identifier of the post.
 * @property {string} pollId - The unique identifier of the poll.
 * @property {string} pollItemId - The unique identifier of the poll item.
 * @property {string} fileName - The name of the image or video.
 * @property {string} fileType - The type of the image or video.
 * @property {string} filePath - The path of the image or video.
 * @property {string} fileURL - The URL of the image or video.
 * @property {string} fileExtension - The extension of the image or video.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PollItemLogo {
	id: string;
	postId: string;
	pollId: string;
	pollItemId: string;
	fileName: string;
	fileType: string;
	filePath: string;
	fileURL: string;
	fileExtension: string;
}

/**
 * This interface is used to define the structure of a poll vote object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface PollVote
 * @category Interfaces
 * @subcategory PostPoll
 * @see {@link PostPoll}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {string} postId - The unique identifier of the post.
 * @property {string} pollId - The unique identifier of the poll.
 * @property {string} pollItemId - The unique identifier of the poll item.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PollVote {
	userId: string;
	postId: string;
	pollId: string;
	pollItemId: string;
}

/**
 * This interface is used to define the structure of a post like object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface PostLike
 * @category Interfaces
 * @subcategory SitePost
 * @see {@link SitePost}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {string} postId - The unique identifier of the post.
 * @property {string} [groupId] - The unique identifier of the group.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostLike {
	userId: string;
	postId: string;
	groupId?: string;
}

/**
 * This interface is used to define the structure of a post comment object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface PostComment
 * @category Interfaces
 * @subcategory SitePost
 * @see {@link SitePost}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the comment.
 * @property {string} creatorId - The unique identifier of the user who created the comment.
 * @property {string} postId - The unique identifier of the post.
 * @property {string} [groupId] - The unique identifier of the group.
 * @property {string} [commentForId] - The unique identifier of the comment that this comment is for.
 * @property {string} commentText - The text of the comment.
 * @property {number} commentLevel - The level of the comment.
 * @property {number} numberOfLikes - The number of likes of the comment.
 * @property {number} numberOfReplies - The number of replies of the comment.
 * @property {boolean} isHidden - Whether the comment is hidden.
 * @property {Timestamp} createdAt - The date and time when the comment was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostComment {
	id: string;
	creatorId: string;
	postId: string;
	groupId?: string;
	commentForId?: string;
	commentText: string;
	commentLevel: number;
	numberOfLikes: number;
	numberOfReplies: number;
	isHidden: boolean;
	createdAt: Timestamp;
}

/**
 * This interface is used to define the structure of a comment like object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface CommentLike
 * @category Interfaces
 * @subcategory PostComment
 * @see {@link PostComment}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {string} [groupId] - The unique identifier of the group.
 * @property {string} postId - The unique identifier of the post.
 * @property {string} commentId - The unique identifier of the comment.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface CommentLike {
	userId: string;
	groupId?: string;
	postId: string;
	commentId: string;
}