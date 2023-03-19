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
};

export const defaultPostCreationModalState: PostCreationModalState = {
	open: false,
	postType: "feed",
};

export const postCreationModalState = atom<PostCreationModalState>({
	key: "postCreationModalState",
	default: defaultPostCreationModalState,
});
