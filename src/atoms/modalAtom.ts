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
