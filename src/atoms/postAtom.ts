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

export interface PollItemData {
	pollItem: PollItem;
	pollItemLogo: PollItemLogo;
}

export interface PostPollData {
	poll: PostPoll;
	pollItems: PollItemData[];
}

export interface PostData {
	post: SitePost;
	creator: SiteUser | null;
	postImagesOrVideos?: PostImageOrVideo[];
	postFiles?: PostFile[];
	postLinks?: PostLink[];
	postPoll?: PostPollData;
}

export interface PostState {
	posts: PostData[];
	currentPost: SitePost | null;
}

export const defaultPostState: PostState = {
	posts: [],
	currentPost: null,
};

export const postState = atom<PostState>({
	key: "postState",
	default: defaultPostState,
});
