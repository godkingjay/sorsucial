import { discussionOptionsState, discussionState } from "@/atoms/discussionAtom";
import React from "react";
import { useRecoilState } from "recoil";

const useDiscussion = () => {
	const [discussionStateValue, setDiscussionStateValue] = useRecoilState(discussionState);
	const [discussionOptionsStateValue, setDiscussionOptionsStateValue] =
		useRecoilState(discussionOptionsState);

	return {
		discussionStateValue,
		setDiscussionStateValue,
		discussionOptionsStateValue,
		setDiscussionOptionsStateValue,
	};
};

export default useDiscussion;
