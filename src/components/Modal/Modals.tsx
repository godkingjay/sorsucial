import React from "react";
import ErrorUpload from "./ErrorUploadModal";
import { useRecoilState } from "recoil";
import {
	discussionCreationModalState,
	errorModalState,
	groupCreationModalState,
} from "@/atoms/modalAtom";
import PostCreationModal from "./PostCreationModal";
import { UserState } from "@/atoms/userAtom";
import DiscussionCreationModal from "./DiscussionCreationModal";
import GroupCreationModal from "./GroupCreationModal";
import useInput from "@/hooks/useInput";
import usePost from "@/hooks/usePost";

type ModalsProps = {
	userStateValue: UserState;
};

const Modals: React.FC<ModalsProps> = ({ userStateValue }) => {
	const { uploadImageOrVideo } = useInput();

	const { postCreationModalStateValue } = usePost();

	const [errorModalStateValue, setErrorModalStateValue] =
		useRecoilState(errorModalState);

	const [
		discussionCreationModalStateValue,
		setDiscussionCreationModalStateValue,
	] = useRecoilState(discussionCreationModalState);
	const [groupCreationModalStateValue, setGroupCreationModalStateValue] =
		useRecoilState(groupCreationModalState);

	return (
		<>
			{errorModalStateValue.open && errorModalStateValue.view === "upload" && (
				<ErrorUpload
					errorModalStateValue={errorModalStateValue}
					setErrorModalStateValue={setErrorModalStateValue}
				/>
			)}
			{postCreationModalStateValue.open && <PostCreationModal />}
			{discussionCreationModalStateValue.open && (
				<DiscussionCreationModal
					discussionCreationModalStateValue={discussionCreationModalStateValue}
					setDiscussionCreationModalStateValue={
						setDiscussionCreationModalStateValue
					}
					userStateValue={userStateValue}
				/>
			)}
			{groupCreationModalStateValue.open && (
				<GroupCreationModal
					userStateValue={userStateValue}
					groupCreationModalStateValue={groupCreationModalStateValue}
					setGroupCreationModalStateValue={setGroupCreationModalStateValue}
					uploadImageOrVideo={uploadImageOrVideo}
				/>
			)}
		</>
	);
};

export default Modals;
