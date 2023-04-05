import { UserState } from "@/atoms/userAtom";
import React from "react";
import CommentBox from "./CommentBox";

type PostCommentProps = {
	userStateValue: UserState;
};

const PostComment: React.FC<PostCommentProps> = ({ userStateValue }) => {
	return (
		<>
			<div className="h-[1px] bg-gray-200"></div>
			<div className="p-4 flex flex-col gap-y-2">
				<CommentBox userStateValue={userStateValue} />
			</div>
		</>
	);
};

export default PostComment;
