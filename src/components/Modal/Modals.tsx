import React from "react";
import ErrorUpload from "./ErrorUploadModal";
import { useRecoilState } from "recoil";
import { errorModalState, postCreationModalState } from "@/atoms/modalAtom";
import PostCreationModal from "./PostCreationModal";

type ModalsProps = {};

const Modals: React.FC<ModalsProps> = () => {
	const [errorModalStateValue, setErrorModalStateValue] =
		useRecoilState(errorModalState);
	const [postCreationModalStateValue, setPostCreationModalStateValue] =
		useRecoilState(postCreationModalState);

	return (
		<>
			{errorModalStateValue.open && errorModalStateValue.view === "upload" && (
				<ErrorUpload
					errorModalStateValue={errorModalStateValue}
					setErrorModalStateValue={setErrorModalStateValue}
				/>
			)}
			{postCreationModalStateValue.open && (
				<PostCreationModal
					postCreationModalStateValue={postCreationModalStateValue}
					setPostCreationModalStateValue={setPostCreationModalStateValue}
				/>
			)}
		</>
	);
};

export default Modals;
