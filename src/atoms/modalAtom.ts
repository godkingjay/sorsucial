import { atom } from "recoil";

export type ErrorUploadModalState = {
	open: boolean;
	message: string;
};

const defaultErrorUploadModal: ErrorUploadModalState = {
	open: false,
	message: "",
};

export const errorUploadModalState = atom({
	key: "errorUploadModalState",
	default: defaultErrorUploadModal,
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
