import { UserState } from "@/atoms/userAtom";
import React, { useEffect, useRef, useState } from "react";
import CommentBox from "./CommentBox";
import { PostCommentData, PostState } from "@/atoms/postAtom";
import useComment from "@/hooks/useComment";
import PostCommentInputBoxSkeleton from "@/components/Skeleton/Post/PostComment.tsx/PostCommentInputBoxSkeleton";
import CommentItem from "./CommentItem";
import PostCommentItemSkeleton from "@/components/Skeleton/Post/PostComment.tsx/PostCommentItemSkeleton";

type PostCommentsProps = {
	userStateValue: UserState;
	userMounted: boolean;
	currentPost: PostState["currentPost"];
	commentBoxRef: React.RefObject<HTMLTextAreaElement>;
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
	commentBoxRef,
}) => {
	const [postCommentForm, setPostCommentForm] = useState<PostCommentFormType>({
		postId: currentPost?.post.id!,
		groupId: currentPost?.post.groupId,
		commentText: "",
		commentLevel: 0,
		commentForId: currentPost?.post.id!,
	});
	const { createComment, fetchComments, onCommentLike } = useComment();
	const [creatingComment, setCreatingComment] = useState(false);
	const [firstLoadingComments, setFirstLoadingComments] = useState(false);
	const [loadingComments, setLoadingComments] = useState(true);
	const componentDidMount = useRef(false);

	const firstFetchComments = async () => {
		setFirstLoadingComments(true);
		if (currentPost) {
			await fetchPostComments(
				currentPost?.post.id,
				currentPost?.post.id,
				setLoadingComments
			);
		}
		setFirstLoadingComments(false);
	};

	const fetchPostComments = async (
		postId: string,
		commentForId: string,
		setFetchingComments: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		setFetchingComments(true);
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
		setFetchingComments(false);
	};

	const handleFetchComments = () => {
		if (currentPost) {
			fetchPostComments(
				currentPost.post.id,
				currentPost.post.id,
				setLoadingComments
			);
		}
	};

	const handleCommentLike = async (commentData: PostCommentData) => {
		if (!commentData) {
			return;
		}

		try {
			if (!userStateValue.user.uid) {
				return;
			}

			onCommentLike(commentData);
		} catch (error: any) {
			console.log(
				"Hook: Error while liking or unliking comment: ",
				error.message
			);
		}
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

	// console.log(currentPost?.postComments);

	return (
		<>
			{currentPost && (
				<>
					<div className="h-[1px] bg-gray-200"></div>
					<div className="p-4 flex flex-col gap-y-4">
						{firstLoadingComments || !userMounted ? (
							<>
								<PostCommentItemSkeleton
									commentLevel={0}
									parentShowCommentBox={true}
								/>
								<PostCommentItemSkeleton
									commentLevel={0}
									parentShowCommentBox={true}
								/>
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
													parentShowCommentBox={true}
													fetchPostComments={fetchPostComments}
													onSubmit={handleCommentSubmit}
													onChange={handleInputChange}
													handleCommentLike={handleCommentLike}
												/>
											</React.Fragment>
										))}
									{loadingComments && (
										<>
											<PostCommentItemSkeleton
												commentLevel={0}
												parentShowCommentBox={true}
											/>
											<PostCommentItemSkeleton
												commentLevel={0}
												parentShowCommentBox={true}
											/>
										</>
									)}
									{currentPost.post.numberOfFirstLevelComments >
										currentPost.postComments.filter(
											(comment) =>
												comment.comment.commentForId === currentPost.post.id
										).length && (
										<div className="flex flex-col w-full justify-start">
											<button
												type="button"
												title="View More Comments"
												className="text-sm w-fit px-6 py-1 font-semibold btn-text text-gray-700"
												onClick={handleFetchComments}
											>
												View More Comments
											</button>
										</div>
									)}
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
									commentBoxRef={commentBoxRef}
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
