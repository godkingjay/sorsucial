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

export const errorModalState = atom({
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

export const adminModalState = atom({
	key: "adminModalState",
	default: defaultAdminModalState,
});
