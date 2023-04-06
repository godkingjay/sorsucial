import { UserState } from "@/atoms/userAtom";
import React, { useState } from "react";
import CommentBox from "./CommentBox";
import { PostState } from "@/atoms/postAtom";

type PostCommentProps = {
	userStateValue: UserState;
	currentPost: PostState["currentPost"];
};

export type PostCommentFormType = {
	commentText: string;
	postId: string;
	groupId?: string;
	commentForId?: string;
	commentLevel: number;
};

const PostComment: React.FC<PostCommentProps> = ({
	userStateValue,
	currentPost,
}) => {
	const [postCommentForm, setPostCommentForm] = useState<PostCommentFormType>({
		postId: currentPost?.post.id!,
		commentText: "",
		commentLevel: 0,
	});
	const [creatingComment, setCreatingComment] = useState(false);

	const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (creatingComment) return;

		setCreatingComment(true);

		try {
		} catch (error) {
			console.log("Hook: Error while creating comment: ", error);
		}

		setCreatingComment(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPostCommentForm((prev) => ({
			...prev,
			commentText: e.target.value,
		}));
	};

	return (
		<>
			<div className="h-[1px] bg-gray-200"></div>
			<div className="p-4 flex flex-col gap-y-2">
				<CommentBox
					userStateValue={userStateValue}
					value={postCommentForm.commentText}
					onChange={handleInputChange}
					onSubmit={handleCommentSubmit}
					submitting={creatingComment}
				/>
			</div>
		</>
	);
};

export default PostComment;
