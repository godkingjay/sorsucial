import { PostCommentData, PostData } from "@/atoms/postAtom";
import UserIcon from "@/components/Icons/UserIcon";
import React, { useEffect, useRef, useState } from "react";
import CommentBox from "./CommentBox";
import { UserState } from "@/atoms/userAtom";
import { PostCommentFormType } from "./PostComments";
import moment from "moment";
import PostCommentItemSkeleton from "@/components/Skeleton/Post/PostComment.tsx/PostCommentItemSkeleton";
import CommentItemCard from "./CommentItem/CommentItemCard";

type CommentItemProps = {
	currentPost: PostData;
	userStateValue: UserState;
	submitting: boolean;
	commentData: PostCommentData;
	parentShowCommentBox: boolean;
	fetchPostComments: (
		postId: string,
		commentForId: string,
		setFetchingComments: React.Dispatch<React.SetStateAction<boolean>>
	) => void;
	handleCommentLike: (
		liking: boolean,
		setLiking: React.Dispatch<React.SetStateAction<boolean>>,
		commentData: PostCommentData
	) => Promise<void>;
	handleCommentDelete: (
		comment: PostCommentData["comment"],
		deleting: boolean,
		setDeleting: React.Dispatch<React.SetStateAction<boolean>>
	) => Promise<void>;
	onSubmit: (
		event: React.FormEvent<HTMLFormElement>,
		commentForm: PostCommentFormType,
		setCommentForm: React.Dispatch<React.SetStateAction<PostCommentFormType>>,
		commentForId: string,
		commentLevel: number
	) => void;
	onChange: (
		event: React.ChangeEvent<HTMLTextAreaElement>,
		setCommentForm: React.Dispatch<React.SetStateAction<PostCommentFormType>>
	) => void;
	formatNumberWithSuffix: (number: number) => string;
};

const maxCommentLevel = 3;

const CommentItem: React.FC<CommentItemProps> = ({
	userStateValue,
	currentPost,
	submitting,
	commentData,
	parentShowCommentBox,
	fetchPostComments,
	handleCommentLike,
	handleCommentDelete,
	onSubmit,
	onChange,
	formatNumberWithSuffix,
}) => {
	const [postCommentForm, setPostCommentForm] = useState<PostCommentFormType>({
		postId: commentData.comment.postId,
		groupId: commentData.comment.groupId,
		commentText: "",
		commentLevel: commentData.comment.commentLevel + 1,
		commentForId: commentData.comment.id,
	});
	const [showComments, setShowComments] = useState(false);
	const [showCommentBox, setShowCommentBox] = useState(false);
	const [loadingComments, setLoadingComments] = useState(false);
	const [deletingComment, setDeletingComment] = useState(false);
	const remainingReplies = currentPost.postComments.filter(
		(comment) => comment.comment.commentForId === commentData.comment.id
	).length;
	const [liking, setLiking] = useState(false);
	const commentBoxRef = useRef<HTMLTextAreaElement>(null);

	const handleFetchComments = async () => {
		setShowComments(true);
		if (!loadingComments) {
			await fetchPostComments(
				currentPost.post.id,
				commentData.comment.id,
				setLoadingComments
			);
		}
	};

	const handleDeleteComment = async () => {
		if (!liking && !deletingComment) {
			await handleCommentDelete(
				commentData.comment,
				deletingComment,
				setDeletingComment
			);
		}
	};

	const handleShowCommentBox = () => {
		setShowCommentBox((prev) => !prev);
	};

	const focusCommentBox = () => {
		commentBoxRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
		commentBoxRef.current?.focus({ preventScroll: true });
	};

	useEffect(() => {
		if (showCommentBox) {
			focusCommentBox();
		}
	}, [showCommentBox]);

	return (
		<>
			<div
				className="comment-item flex flex-row gap-x-2 w-full relative min-h-[40px] entrance-animation-slide-from-right"
				show-comment-box={parentShowCommentBox ? "true" : "false"}
			>
				<div className="left flex flex-row relative">
					{commentData.comment.commentLevel > 0 && (
						<div className="deco-lines -z-0 absolute h-full w-10 top-0 left-0">
							<div className="straight h-full w-0 border-l-2 absolute bottom-0 -left-8 translate-x-[2px]"></div>
							<div className="curve h-8 w-[28px] absolute right-full -top-3 -translate-x-[2px] border-2 border-gray-200 border-t-transparent border-r-transparent rounded-bl-2xl"></div>
						</div>
					)}
					<div className="z-0 flex flex-row h-10 w-10">
						<UserIcon user={commentData.creator} />
					</div>
				</div>
				<div className="flex-1 flex flex-col gap-y-2">
					<div className="flex-1 flex flex-col gap-y-1 relative">
						<CommentItemCard
							commentData={commentData}
							formatNumberWithSuffix={formatNumberWithSuffix}
						/>
						<div className="flex flex-row items-center gap-x-4 gap-y-2 text-xs font-semibold px-4 text-gray-500 flex-wrap">
							<button
								type="button"
								title="Like"
								className="btn-text [&[comment-liked='true']]:!text-blue-500 hover:text-blue-500"
								onClick={() =>
									!liking &&
									!deletingComment &&
									handleCommentLike(liking, setLiking, commentData)
								}
								comment-liked={
									commentData.userCommentLike?.commentId ===
									commentData.comment.id
										? "true"
										: "false"
								}
								disabled={liking || deletingComment}
							>
								{commentData.userCommentLike?.commentId ===
								commentData.comment.id
									? "Liked"
									: "Like"}
							</button>
							{postCommentForm.commentLevel < maxCommentLevel && (
								<button
									type="button"
									title="Reply"
									className="btn-text"
									onClick={handleShowCommentBox}
								>
									Reply
								</button>
							)}
							{(userStateValue.user.uid === commentData.comment.creatorId ||
								userStateValue.user.roles.includes("admin")) && (
								<button
									type="button"
									title="Delete"
									className="btn-text hover:text-red-500"
									onClick={() =>
										!liking && !deletingComment && handleDeleteComment()
									}
									disabled={deletingComment || liking}
								>
									Delete
								</button>
							)}
							<p className="font-normal text-2xs w-max">
								{moment(commentData.comment.createdAt).diff(moment(), "days") >
								-7
									? moment(commentData.comment.createdAt).fromNow()
									: moment(commentData.comment.createdAt).format(
											"MMMM DD, YYYY"
									  )}
							</p>
						</div>
						{(showComments || showCommentBox) && (
							<div className="absolute top-0 -left-8 h-full w-max pt-12 translate-x-[2px]">
								<div className="border-l-2 h-full w-0 bg-transparent"></div>
							</div>
						)}
					</div>
					{showComments && (
						<div className="flex flex-col gap-y-2">
							{currentPost?.postComments
								.filter(
									(comment) =>
										comment.comment.commentLevel ===
											commentData.comment.commentLevel + 1 &&
										comment.comment.commentForId === commentData.comment.id
								)
								.map((comment) => (
									<React.Fragment key={comment.comment.id}>
										<CommentItem
											currentPost={currentPost}
											userStateValue={userStateValue}
											submitting={submitting}
											commentData={comment}
											parentShowCommentBox={showCommentBox}
											fetchPostComments={fetchPostComments}
											handleCommentLike={handleCommentLike}
											handleCommentDelete={handleCommentDelete}
											onSubmit={onSubmit}
											onChange={onChange}
											formatNumberWithSuffix={formatNumberWithSuffix}
										/>
									</React.Fragment>
								))}
							{loadingComments && (
								<>
									<PostCommentItemSkeleton
										commentLevel={commentData.comment.commentLevel + 1}
										parentShowCommentBox={showCommentBox}
									/>
									<PostCommentItemSkeleton
										commentLevel={commentData.comment.commentLevel + 1}
										parentShowCommentBox={showCommentBox}
									/>
								</>
							)}
						</div>
					)}
					{commentData.comment.numberOfReplies > remainingReplies && (
						<div className="flex flex-col w-full justify-start">
							<button
								type="button"
								title="Show Replies"
								className="text-sm w-fit px-6 py-1 font-semibold btn-text text-gray-700"
								onClick={() => !loadingComments && handleFetchComments()}
							>
								{showComments
									? "View More Replies"
									: `Show ${
											commentData.comment.numberOfReplies - remainingReplies
									  } ${
											commentData.comment.numberOfReplies - remainingReplies ===
											1
												? "Reply"
												: "Replies"
									  }`}
							</button>
						</div>
					)}
					{showCommentBox && postCommentForm.commentLevel < maxCommentLevel && (
						<CommentBox
							userStateValue={userStateValue}
							commentForm={postCommentForm}
							setCommentForm={setPostCommentForm}
							commentForId={commentData.comment.id}
							commentLevel={commentData.comment.commentLevel + 1}
							submitting={false}
							commentBoxRef={commentBoxRef}
							setShowComments={setShowComments}
							onSubmit={onSubmit}
							onChange={onChange}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default CommentItem;
