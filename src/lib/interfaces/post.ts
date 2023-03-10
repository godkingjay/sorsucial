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
 * @interface ImageOrVideo
 * @category Interfaces
 * @subcategory SitePost
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
export interface ImageOrVideo {
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
