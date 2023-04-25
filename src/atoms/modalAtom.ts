import { SiteDiscussion } from "@/lib/interfaces/discussion";
import { SitePost } from "./../lib/interfaces/post";
import { atom } from "recoil";

export type ErrorModalState = {
	open: boolean;
	view: "upload" | "none";
	message: string;
};

const defaultErrorModal: ErrorModalState = {
	open: false,
	view: "none",
	message: "",
};

export const errorModalState = atom<ErrorModalState>({
	key: "errorUploadModalState",
	default: defaultErrorModal,
});

export type AdminModalState = {
	addUser: {
		open: boolean;
		tab: "single" | "bulk" | "list" | "import";
	};
};

const defaultAdminModalState: AdminModalState = {
	addUser: {
		open: false,
		tab: "single",
	},
};

export const adminModalState = atom<AdminModalState>({
	key: "adminModalState",
	default: defaultAdminModalState,
});

export type PostCreationModalState = {
	open: boolean;
	postType: SitePost["postType"];
	tab: "post" | "image/video" | "poll" | "link" | "file" | "settings";
};

export const defaultPostCreationModalState: PostCreationModalState = {
	open: false,
	postType: "feed",
	tab: "post",
};

export const postCreationModalState = atom<PostCreationModalState>({
	key: "postCreationModalState",
	default: defaultPostCreationModalState,
});

export type DiscussionCreationModalState = {
	open: boolean;
	discussionType: SiteDiscussion["discussionType"];
	tab: "discussion" | "settings";
};

export const defaultDiscussionCreationModalState: DiscussionCreationModalState =
	{
		open: false,
		discussionType: "discussion",
		tab: "discussion",
	};

export const discussionCreationModalState = atom<DiscussionCreationModalState>({
	key: "discussionCreationModalState",
	default: defaultDiscussionCreationModalState,
});

export interface GroupCreationModalState {
	open: boolean;
	tab: "group" | "settings" | "review";
}

export const defaultGroupCreationModalState: GroupCreationModalState = {
	open: false,
	tab: "group",
};

export const groupCreationModalState = atom<GroupCreationModalState>({
	key: "groupCreationModalState",
	default: defaultGroupCreationModalState,
});
