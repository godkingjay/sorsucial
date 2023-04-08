import { PostCommentData, PostData } from "@/atoms/postAtom";
import UserIcon from "@/components/Icons/UserIcon";
import Link from "next/link";
import React, { useState } from "react";
import CommentBox from "./CommentBox";
import { UserState } from "@/atoms/userAtom";
import { PostCommentFormType } from "./PostComments";

type CommentItemProps = {
	currentPost: PostData;
	userStateValue: UserState;
	submitting: boolean;
	commentData: PostCommentData;
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
};

const CommentItem: React.FC<CommentItemProps> = ({
	userStateValue,
	currentPost,
	submitting,
	commentData,
	onSubmit,
	onChange,
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

	return (
		<>
			<div className="flex flex-row gap-x-2 w-full relative min-h-[40px]">
				<div className="flex flex-row relative">
					{commentData.comment.commentLevel > 0 && (
						<div className="-z-0 absolute h-10 w-10 top-0 left-0">
							<div className="h-6 w-[28px] absolute right-full bottom-[50%] -translate-x-[2px] border-2 border-gray-200 border-t-transparent border-r-transparent rounded-bl-2xl"></div>
						</div>
					)}
					<div className="z-0 flex flex-row h-10 w-10">
						<UserIcon user={commentData.creator} />
					</div>
				</div>
				<div className="flex-1 flex flex-col gap-y-2">
					<div className="flex-1 flex flex-col">
						<div className="w-full flex-1 flex flex-row gap-x-2">
							<div className="flex flex-row">
								<div className="bg-gray-100 py-2 rounded-[20px] px-4 flex flex-col gap-y-1">
									<h2 className="font-semibold text-xs truncate">
										{commentData.creator ? (
											<Link
												href={`/user/${commentData.creator.uid}`}
												className="inline hover:underline focus:underline"
											>
												{`${commentData.creator.firstName} ${commentData.creator.lastName}`}
											</Link>
										) : (
											<span>Unknown User</span>
										)}
									</h2>
									<p className="break-words text-sm">
										{commentData.comment.commentText}
									</p>
								</div>
							</div>
							{/* <div className="flex-shrink-0 w-8 h-full flex flex-col items-center justify-center">
								  <button type="button" title="Comment Menu" className="w-8 h-8 bg-gray-100 rounded-full p-2">
										<BsThreeDots className="h-full w-full" />
									</button>
								</div> */}
						</div>
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
											onSubmit={onSubmit}
											onChange={onChange}
										/>
									</React.Fragment>
								))}
						</div>
					)}
					{showCommentBox && (
						<CommentBox
							userStateValue={userStateValue}
							commentForm={postCommentForm}
							setCommentForm={setPostCommentForm}
							commentForId={commentData.comment.id}
							commentLevel={commentData.comment.commentLevel + 1}
							onSubmit={onSubmit}
							onChange={onChange}
							submitting={false}
						/>
					)}
				</div>
				<div className="absolute top-0 left-5 h-full w-max pt-12 translate-x-[-100%]">
					<div className="w-[2px] h-full bg-gray-200"></div>
				</div>
			</div>
		</>
	);
};

export default CommentItem;
