import { atom } from "recoil";

export type ErrorUploadModal = {
	open: boolean;
	message: string;
};

const defaultErrorUploadModal: ErrorUploadModal = {
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
	};
};

const defaultAdminModalState: AdminModalState = {
	addUser: {
		open: false,
	},
};

export const adminModalState = atom({
	key: "adminModalState",
	default: defaultAdminModalState,
});
