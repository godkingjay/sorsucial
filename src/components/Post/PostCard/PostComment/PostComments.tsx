import React, { useCallback, useEffect, useRef, useState } from "react";
import CommentBox from "./CommentBox";
import { PostCommentData, PostState } from "@/atoms/postAtom";
import useComment from "@/hooks/useComment";
import PostCommentInputBoxSkeleton from "@/components/Skeleton/Post/PostComment/PostCommentInputBoxSkeleton";
import CommentItem from "./CommentItem";
import PostCommentItemSkeleton from "@/components/Skeleton/Post/PostComment/PostCommentItemSkeleton";
import { PostComment } from "@/lib/interfaces/post";
import ErrorBannerTextSm from "@/components/Banner/ErrorBanner/ErrorBannerTextSm";
import useUser from "@/hooks/useUser";
import useGroup from "@/hooks/useGroup";

type PostCommentsProps = {
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
	currentPost,
	commentBoxRef,
}) => {
	const { userStateValue, userMounted } = useUser();

	const { groupStateValue } = useGroup();

	const [postCommentForm, setPostCommentForm] = useState<PostCommentFormType>({
		postId: currentPost?.post.id!,
		groupId: currentPost?.post.groupId,
		commentText: "",
		commentLevel: 0,
		commentForId: currentPost?.post.id!,
	});
	const { createComment, fetchComments, onCommentLike, deleteComment } =
		useComment();
	const [creatingComment, setCreatingComment] = useState(false);
	const [firstLoadingComments, setFirstLoadingComments] = useState(false);
	const [loadingComments, setLoadingComments] = useState(true);
	const componentDidMount = useRef(false);

	const fetchPostComments = useCallback(
		async (
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
		},
		[currentPost, fetchComments]
	);

	const firstFetchComments = useCallback(async () => {
		setFirstLoadingComments(true);
		if (currentPost) {
			await fetchPostComments(
				currentPost?.post.id,
				currentPost?.post.id,
				setLoadingComments
			);
		}
		setFirstLoadingComments(false);
	}, [currentPost]);

	const handleFetchComments = useCallback(async () => {
		if (currentPost) {
			await fetchPostComments(
				currentPost.post.id,
				currentPost.post.id,
				setLoadingComments
			);
		}
	}, [currentPost, fetchPostComments]);

	const handleCommentLike = useCallback(
		async (
			liking: boolean,
			setLiking: React.Dispatch<React.SetStateAction<boolean>>,
			commentData: PostCommentData
		) => {
			if (!commentData) {
				return;
			}

			try {
				if (!userStateValue.user.uid) {
					return;
				}

				if (!liking) {
					setLiking(true);
					await onCommentLike(commentData);
				}
			} catch (error: any) {
				console.log(
					"Hook: Error while liking or unliking comment: ",
					error.message
				);
			}

			setLiking(false);
		},
		[onCommentLike, userStateValue.user.uid]
	);

	const handleCommentDelete = useCallback(
		async (
			comment: PostComment,
			deleting: boolean,
			setDeleting: React.Dispatch<React.SetStateAction<boolean>>
		) => {
			if (!comment) {
				console.log("handlePostCommentDelete: Comment is not available");
				return;
			}

			try {
				if (!deleting) {
					setDeleting(true);
					await deleteComment(comment);
					setDeleting(false);
				}
			} catch (error: any) {
				console.log("Hook: Error while deleting comment: ", error.message);
				setDeleting(false);
			}
		},
		[deleteComment]
	);

	const handleCommentSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
		commentForm: PostCommentFormType,
		setCommentForm: React.Dispatch<React.SetStateAction<PostCommentFormType>>,
		commenting: boolean,
		setCommenting: React.Dispatch<React.SetStateAction<boolean>>,
		commentForId: string,
		commentLevel: number
	) => {
		event.preventDefault();

		if (commenting) return;

		try {
			if (!commenting) {
				setCommenting(true);
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
				setCommenting(false);
			}
		} catch (error) {
			console.log("Hook: Error while creating comment: ", error);
			setCommenting(false);
		}
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
					<div className="p-4 flex flex-col gap-y-2">
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
								{currentPost.postDeleted && (
									<div className="duration-200 cursor-not-allowed opacity-100 sm:opacity-50 entrance-animation-float-down z-[250] sticky top-16 items-center mb-2 font-semibold hover:opacity-100 focus-within:opacity-100">
										<ErrorBannerTextSm
											message="This post no longer exist. It may have been deleted by the
											creator or an admin."
										/>
									</div>
								)}
								{creatingComment && (
									<>
										<PostCommentItemSkeleton
											commentLevel={0}
											parentShowCommentBox={true}
										/>
									</>
								)}
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
												commentData={comment}
												parentShowCommentBox={true}
												fetchPostComments={fetchPostComments}
												handleCommentLike={handleCommentLike}
												handleCommentDelete={handleCommentDelete}
												onChange={handleInputChange}
												onSubmit={handleCommentSubmit}
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
								{!loadingComments &&
									currentPost?.postComments.filter(
										(comment) =>
											comment.comment.commentLevel === 0 &&
											comment.comment.commentForId === currentPost?.post.id
									).length === 0 && (
										<>
											<p className="font-bold text-center text-gray-500">
												This post has no comments yet.
											</p>
										</>
									)}
								{currentPost.post.numberOfFirstLevelComments >
									currentPost.postComments.filter(
										(comment) =>
											comment.comment.commentForId === currentPost.post.id
									).length &&
									!currentPost.postDeleted && (
										<div className="flex flex-col w-full justify-start">
											<button
												type="button"
												title="View More Comments"
												className="text-sm w-fit px-6 py-1 font-semibold btn-text text-gray-700"
												onClick={() => !loadingComments && handleFetchComments()}
												disabled={loadingComments}
											>
												View More Comments
											</button>
										</div>
									)}
								{!currentPost.postDeleted &&
									(groupStateValue.currentGroup &&
									currentPost.post.groupId ===
										groupStateValue.currentGroup.group.id &&
									currentPost.post.privacy !== "public"
										? groupStateValue.currentGroup.userJoin?.roles.includes(
												"member"
										  )
										: true) && (
										<CommentBox
											commentForm={postCommentForm}
											setCommentForm={setPostCommentForm}
											commentLevel={0}
											commentForId={currentPost?.post.id}
											onChange={handleInputChange}
											onSubmit={handleCommentSubmit}
											commenting={creatingComment}
											setCommenting={setCreatingComment}
											commentBoxRef={commentBoxRef}
										/>
									)}
							</>
						)}
					</div>
				</>
			)}
		</>
	);
};

export default PostComments;
