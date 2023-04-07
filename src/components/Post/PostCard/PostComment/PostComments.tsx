import { UserState } from "@/atoms/userAtom";
import React, { useState } from "react";
import CommentBox from "./CommentBox";
import { PostState } from "@/atoms/postAtom";
import useComment from "@/hooks/useComment";

type PostCommentsProps = {
	userStateValue: UserState;
	currentPost: PostState["currentPost"];
};

export type PostCommentFormType = {
	postId: string;
	groupId?: string;
	commentText: string;
	commentForId: string;
	commentLevel: number;
};

const PostComments: React.FC<PostCommentsProps> = ({
	userStateValue,
	currentPost,
}) => {
	const [postCommentForm, setPostCommentForm] = useState<PostCommentFormType>({
		postId: currentPost?.post.id!,
		groupId: currentPost?.post.groupId,
		commentText: "",
		commentLevel: 0,
		commentForId: currentPost?.post.id!,
	});
	const [creatingComment, setCreatingComment] = useState(false);
	const { createComment } = useComment();

	const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (creatingComment) return;

		setCreatingComment(true);

		try {
			await createComment(postCommentForm, userStateValue.user);
			setPostCommentForm((prev) => ({
				...prev,
				commentText: "",
			}));
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

export default PostComments;
