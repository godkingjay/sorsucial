import React from "react";
import ErrorUpload from "./ErrorUploadModal";
import { useRecoilState } from "recoil";
import {
	discussionCreationModalState,
	errorModalState,
	postCreationModalState,
} from "@/atoms/modalAtom";
import PostCreationModal from "./PostCreationModal";
import { UserState } from "@/atoms/userAtom";
import DiscussionCreationModal from "./DiscussionCreationModal";

type ModalsProps = {
	userStateValue: UserState;
};

const Modals: React.FC<ModalsProps> = ({ userStateValue }) => {
	const [errorModalStateValue, setErrorModalStateValue] = useRecoilState(errorModalState);
	const [postCreationModalStateValue, setPostCreationModalStateValue] =
		useRecoilState(postCreationModalState);
	const [discussionCreationModalStateValue, setDiscussionCreationModalStateValue] =
		useRecoilState(discussionCreationModalState);

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
			{discussionCreationModalStateValue.open && (
				<DiscussionCreationModal
					discussionCreationModalStateValue={discussionCreationModalStateValue}
					setDiscussionCreationModalStateValue={setDiscussionCreationModalStateValue}
					userStateValue={userStateValue}
				/>
			)}
		</>
	);
};

export default Modals;
