import { CommentLike, PostComment } from "./../lib/interfaces/post";
import {
	PollItem,
	PollItemLogo,
	PollVote,
	PostLike,
	PostPoll,
	SitePost,
} from "@/lib/interfaces/post";
import { SiteUser } from "@/lib/interfaces/user";
import { QueryPostsSortBy } from "@/lib/types/api";
import { atom } from "recoil";

export interface PostOptionsState {
	menu: string;
	share: string;
}

export const defaultPostOptionsState: PostOptionsState = {
	menu: "",
	share: "",
};

export const postOptionsState = atom<PostOptionsState>({
	key: "postOptionsState",
	default: defaultPostOptionsState,
});

/**
 * This is the data that is needed to display a poll item in the UI.
 *
 * ----------------------------------------------------------------
 *
 * @interface PollItemData
 * @see {@link PollItemData}
 *
 * ----------------------------------------------------------------
 *
 * @property {PollItem} pollItem - The poll item data.
 * @property {PollItemLogo} pollItemLogo - The poll item logo data.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PollItemData {
	pollItem: PollItem;
	pollItemLogo: PollItemLogo;
}

/**
 * This is the data that is needed to display a post poll in the UI.
 *
 * ----------------------------------------------------------------
 *
 * @interface PostPollData
 * @see {@link PostPollData}
 *
 * ----------------------------------------------------------------
 *
 * @property {PostPoll} poll - The post poll data.
 * @property {PollItemData[]} pollItems - The poll item data.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostPollData {
	poll: PostPoll;
}

/**
 * This is the data that is needed to display a post comment in the UI.
 * This is used in the post atom.
 *
 * ----------------------------------------------------------------
 *
 * @interface PostCommentData
 * @see {@link PostCommentData}
 *
 * ----------------------------------------------------------------
 *
 * @property {PostComment} comment - The post comment data.
 * @property {SiteUser | null} creator - The post comment creator data.
 * @property {CommentLike | null} commentLike - The post comment like data of the current user.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostCommentData {
	comment: PostComment;
	creator: SiteUser | null;
	userCommentLike: CommentLike | null;
	commentDeleted?: boolean;
}

/**
 * This is the data that is needed to display a post in the UI.
 *
 * ----------------------------------------------------------------
 *
 * @interface PostData
 * @see {@link PostData}
 *
 * ----------------------------------------------------------------
 *
 * @property {SitePost} post - The post data.
 * @property {SiteUser | null} creator - The post creator data.
 * @property {PostLike | null} userLike - The post like data of the current user.
 * @property {PollVote | null} userVote - The poll vote data of the current user.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostData {
	post: SitePost;
	creator: SiteUser | null;
	userLike: PostLike | null;
	userVote: PollVote | null;
	postComments: PostCommentData[];
	postDeleted?: boolean;
	index: {
		[sortBy in QueryPostsSortBy]: number;
	};
}

/**
 * This is the state of the post atom.
 *
 * ----------------------------------------------------------------
 *
 * @interface PostState
 * @see {@link PostState}
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostState {
	posts: PostData[];
	currentPost: PostData | null;
}

/**
 * This is the default state of the post atom.
 */
export const defaultPostState: PostState = {
	posts: [],
	currentPost: null,
};

/**
 * This is the post atom.
 *
 * @see {@link defaultPostState} - default state of the post atom.
 * @see {@link PostState} - the data structure of the post atom
 * @see {@link PostData} - the data structure of the post data in the post atom state.
 */
export const postState = atom<PostState>({
	key: "postState",
	default: defaultPostState,
});
