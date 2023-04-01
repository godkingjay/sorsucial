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
 * @property {"announcement" | "feed" | "group"} postType - The type of the post.
 * @property {PostImageOrVideo[]} postImagesOrVideos - The images or videos of the post.
 * @property {PostFile[]} postFiles - The files of the post.
 * @property {PostLink[]} postLinks - The links of the post.
 * @property {PostPoll | null} postPoll - The poll of the post.
 * @property {boolean} isHidden - Whether the post is hidden.
 * @property {boolean} isCommentable - Whether the post is commentable.
 * @property {"public" | "restricted" | "private"} privacy - The privacy of the post.
 * @property {number} numberOfLikes - The number of likes of the post.
 * @property {number} numberOfComments - The number of comments of the post.
 * @property {Date} [updatedAt] - The date and time when the post was last updated.
 * @property {Date} createdAt - The date and time when the post was created.
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
	postType: "announcement" | "feed" | "group";
	postImagesOrVideos: PostImageOrVideo[];
	postFiles: PostFile[];
	postLinks: PostLink[];
	postPoll: PostPoll | null;
	isHidden: boolean;
	isCommentable: boolean;
	privacy: "public" | "restricted" | "private";
	numberOfLikes: number;
	numberOfComments: number;
	updatedAt?: Date;
	createdAt: Date;
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
 * @property {number} height - The height of the image or video.
 * @property {number} width - The width of the image or video.
 * @property {string} filePath - The path of the image or video.
 * @property {string} fileName - The name of the image or video.
 * @property {string} fileType - The type of the image or video.
 * @property {string} fileUrl - The URL of the image or video.
 * @property {string} fileExtension - The extension of the image or video.
 * @property {string} [fileTitle] - The title of the image or video.
 * @property {string} [fileDescription] - The description of the image or video.
 * @property {number} fileSize - The size of the image or video.
 * @property {Date} updatedAt - The date and time when the image or video was last updated.
 * @property {Date} createdAt - The date and time when the image or video was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostImageOrVideo {
	id: string;
	index: number;
	postId: string;
	height: number;
	width: number;
	filePath: string;
	fileName: string;
	fileType: string;
	fileUrl: string;
	fileExtension: string;
	fileTitle?: string;
	fileDescription?: string;
	fileSize: number;
	updatedAt: Date;
	createdAt: Date;
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
 * @property {number} fileSize - The size of the file.
 * @property {Date} createdAt - The date and time when the file was created.
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
	fileSize: number;
	updatedAt: Date;
	createdAt: Date;
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
 * @property {Date} createdAt - The date and time when the link was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostLink {
	id: string;
	index: number;
	postId: string;
	url: string;
	blocked: boolean;
	updatedAt: Date;
	createdAt: Date;
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
 * @property {PollItem[]} pollItems - The poll items of the poll.
 * @property {Date} updatedAt - The date and time when the poll was last updated.
 * @property {Date} createdAt - The date and time when the poll was created.
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
	pollItems: PollItem[];
	updatedAt: Date;
	createdAt: Date;
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
 * @property {number} numberOfVotes - The number of votes of the poll item.
 * @property {string} [logoType] - The logo type of the poll item.
 * @property {string} [emoji] - The emoji of the poll item.
 * @property {PollItemLogo} [pollItemLogo] - The logo of the poll item.
 * @property {Date} updatedAt - The date and time when the poll item was last updated.
 * @property {Date} createdAt - The date and time when the poll item was created.
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
	numberOfVotes: number;
	logoType?: "emoji" | "image";
	emoji?: string;
	pollItemLogo?: PollItemLogo;
	updatedAt: Date;
	createdAt: Date;
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
 * @property {number} height - The height of the image or video.
 * @property {number} width - The width of the image or video.
 * @property {string} fileName - The name of the image or video.
 * @property {string} fileType - The type of the image or video.
 * @property {string} filePath - The path of the image or video.
 * @property {string} fileURL - The URL of the image or video.
 * @property {string} fileExtension - The extension of the image or video.
 * @property {number} fileSize - The size of the image or video.
 * @property {Date} updatedAt - The date and time when the poll item logo was last updated.
 * @property {Date} createdAt - The date and time when the poll item logo was created.
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
	height: number;
	width: number;
	fileName: string;
	fileType: string;
	filePath: string;
	fileURL: string;
	fileExtension: string;
	fileSize: number;
	updatedAt: Date;
	createdAt: Date;
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
	updatedAt: Date;
	createdAt: Date;
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
 * @property {Date} createdAt - The date and time when the post like was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostLike {
	userId: string;
	postId: string;
	groupId?: string;
	createdAt: Date;
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
 * @property {Date} updatedAt - The date and time when the comment was last updated.
 * @property {Date} createdAt - The date and time when the comment was created.
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
	updatedAt: Date;
	createdAt: Date;
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
 * @property {Date} createdAt - The date and time when the comment like was created.
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
	createdAt: Date;
}
