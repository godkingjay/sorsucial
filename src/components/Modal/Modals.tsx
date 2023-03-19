import React from "react";
import ErrorUpload from "./ErrorUploadModal";
import { useRecoilState } from "recoil";
import { errorModalState, postCreationModalState } from "@/atoms/modalAtom";
import PostCreationModal from "./PostCreationModal";
import { UserState } from "@/atoms/userAtom";

type ModalsProps = {
	userStateValue: UserState;
};

const Modals: React.FC<ModalsProps> = ({ userStateValue }) => {
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
					userStateValue={userStateValue}
				/>
			)}
		</>
	);
};

export default Modals;
