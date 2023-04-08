import { UserState } from "@/atoms/userAtom";
import React, { useEffect, useRef, useState } from "react";
import CommentBox from "./CommentBox";
import { PostState } from "@/atoms/postAtom";
import useComment from "@/hooks/useComment";
import PostCommentInputBoxSkeleton from "@/components/Skeleton/Post/PostComment.tsx/PostCommentInputBoxSkeleton";
import CommentItem from "./CommentItem";

type PostCommentsProps = {
	userStateValue: UserState;
	userMounted: boolean;
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
	userMounted,
	currentPost,
}) => {
	const [postCommentForm, setPostCommentForm] = useState<PostCommentFormType>({
		postId: currentPost?.post.id!,
		groupId: currentPost?.post.groupId,
		commentText: "",
		commentLevel: 0,
		commentForId: currentPost?.post.id!,
	});
	const { createComment, fetchComments } = useComment();
	const [creatingComment, setCreatingComment] = useState(false);
	const [firstLoadingComments, setFirstLoadingComments] = useState(false);
	const [loadingComments, setLoadingComments] = useState(true);
	const componentDidMount = useRef(false);

	const firstFetchComments = async () => {
		setFirstLoadingComments(true);
		if (currentPost) {
			await fetchPostComments(currentPost?.post.id, currentPost?.post.id);
		}
		setFirstLoadingComments(false);
	};

	const fetchPostComments = async (postId: string, commentForId: string) => {
		setLoadingComments(true);
		try {
			if (currentPost) {
				await fetchComments({
					postId,
					commentForId,
				});
			}
		} catch (error: any) {
			console.log("Hook: Error while fetching post comments: ", error.message);
		}
		setLoadingComments(false);
	};

	const handleCommentSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
		commentForm: PostCommentFormType,
		setCommentForm: React.Dispatch<React.SetStateAction<PostCommentFormType>>,
		commentForId: string,
		commentLevel: number
	) => {
		event.preventDefault();

		if (creatingComment) return;

		setCreatingComment(true);

		try {
			await createComment(
				{
					...commentForm,
					commentForId,
					commentLevel,
				},
				userStateValue.user
			);
			setCommentForm((prev) => ({
				...prev,
				commentText: "",
			}));
		} catch (error) {
			console.log("Hook: Error while creating comment: ", error);
		}

		setCreatingComment(false);
	};

	const handleInputChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>,
		setCommentForm: React.Dispatch<React.SetStateAction<PostCommentFormType>>
	) => {
		setCommentForm((prev) => ({
			...prev,
			commentText: event.target.value,
		}));
	};

	useEffect(() => {
		if (userMounted && !componentDidMount.current) {
			componentDidMount.current = true;
			firstFetchComments();
		}
	}, [userMounted, componentDidMount.current]);

	return (
		<>
			{currentPost && (
				<>
					<div className="h-[1px] bg-gray-200"></div>
					<div className="p-4 flex flex-col gap-y-4">
						{firstLoadingComments || !userMounted ? (
							<>
								<PostCommentInputBoxSkeleton />
							</>
						) : (
							<>
								<div className="flex flex-col gap-y-2">
									{currentPost?.postComments
										.filter(
											(comment) =>
												comment.comment.commentLevel === 0 &&
												comment.comment.commentForId === currentPost?.post.id
										)
										.map((comment) => (
											<React.Fragment key={comment.comment.id}>
												<CommentItem
													currentPost={currentPost}
													userStateValue={userStateValue}
													submitting={creatingComment}
													commentData={comment}
													onSubmit={handleCommentSubmit}
													onChange={handleInputChange}
												/>
											</React.Fragment>
										))}
								</div>
								<CommentBox
									userStateValue={userStateValue}
									commentForm={postCommentForm}
									setCommentForm={setPostCommentForm}
									commentLevel={0}
									commentForId={currentPost?.post.id}
									onChange={handleInputChange}
									onSubmit={handleCommentSubmit}
									submitting={creatingComment}
								/>
							</>
						)}
					</div>
				</>
			)}
		</>
	);
};

export default PostComments;
