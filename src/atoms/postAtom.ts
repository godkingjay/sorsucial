import {
	PollItem,
	PollItemLogo,
	PostFile,
	PostImageOrVideo,
	PostLink,
	PostPoll,
	SitePost,
} from "@/lib/interfaces/post";
import { SiteUser } from "@/lib/interfaces/user";
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
	pollItems: PollItemData[];
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
 * @property {PostImageOrVideo[]} postImagesOrVideos - The post images or videos data.
 * @property {PostFile[]} postFiles - The post files data.
 * @property {PostLink[]} postLinks - The post links data.
 * @property {PostPollData} postPoll - The post poll data.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface PostData {
	post: SitePost;
	creator: SiteUser | null;
	postImagesOrVideos?: PostImageOrVideo[];
	postFiles?: PostFile[];
	postLinks?: PostLink[];
	postPoll?: PostPollData;
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
	currentPost: SitePost | null;
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
