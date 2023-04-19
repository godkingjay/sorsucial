import React from "react";
import useUser from "./useUser";
import useDiscussion from "./useDiscussion";

const useReply = () => {
	const { authUser, userStateValue } = useUser();
	const { discussionStateValue, setDiscussionStateValue } = useDiscussion();

	const createReply = async () => {};

	const onReplyVote = async () => {};

	const fetchReplies = async () => {};

	const fetchUserReplyVote = async () => {};

	const deleteReply = async () => {};

	return {
		createReply,
		onReplyVote,
		fetchReplies,
		fetchUserReplyVote,
		deleteReply,
	};
};

export default useReply;
