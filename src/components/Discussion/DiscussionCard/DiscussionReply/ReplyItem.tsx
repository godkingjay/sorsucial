import UserIcon from "@/components/Icons/UserIcon";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { UserState } from "@/atoms/userAtom";
import moment from "moment";
import { DiscussionData, DiscussionReplyData } from "@/atoms/discussionAtom";
import { DiscussionReplyFormType } from "./DiscussionReplies";
import ReplyBox from "./ReplyBox";
import {
	TbArrowBigDown,
	TbArrowBigDownFilled,
	TbArrowBigUp,
	TbArrowBigUpFilled,
	TbShare3,
} from "react-icons/tb";
import { GoComment } from "react-icons/go";

type ReplyItemProps = {
	currentDiscussion: DiscussionData;
	userStateValue: UserState;
	submitting: boolean;
	replyData: DiscussionReplyData;
	parentShowReplyBox: boolean;
	fetchDiscussionReplies: (
		discussionId: string,
		replyForId: string,
		setFetchingReplies: React.Dispatch<React.SetStateAction<boolean>>
	) => Promise<void>;
	onSubmit: (
		event: React.FormEvent<HTMLFormElement>,
		replyForm: DiscussionReplyFormType,
		setReplyForm: React.Dispatch<React.SetStateAction<DiscussionReplyFormType>>,
		replyForId: string,
		replyLevel: number
	) => void;
	onChange: (
		event: React.ChangeEvent<HTMLTextAreaElement>,
		setReplyForm: React.Dispatch<React.SetStateAction<DiscussionReplyFormType>>
	) => void;
	formatNumberWithSuffix: (number: number) => string;
};

const maxReplyLevel = 3;

const ReplyItem: React.FC<ReplyItemProps> = ({
	userStateValue,
	currentDiscussion,
	submitting,
	replyData,
	parentShowReplyBox,
	fetchDiscussionReplies,
	onSubmit,
	onChange,
	formatNumberWithSuffix,
}) => {
	const [discussionReplyForm, setDiscussionReplyForm] =
		useState<DiscussionReplyFormType>({
			discussionId: currentDiscussion?.discussion.id!,
			groupId: currentDiscussion?.discussion.groupId,
			replyText: "",
			replyLevel: 0,
			replyForId: replyData.reply.id,
		});
	const [showReplies, setShowReplies] = useState(false);
	const [showReplyBox, setShowReplyBox] = useState(false);
	const [loadingReplies, setLoadingReplies] = useState(false);
	const [deletingReply, setDeletingReply] = useState(false);
	const remainingReplies = currentDiscussion.discussionReplies.filter(
		(reply) => reply.reply.replyForId === replyData.reply.id
	).length;
	const replyBoxRef = useRef<HTMLTextAreaElement>(null);

	const handleFetchReplies = () => {
		setShowReplies(true);
		fetchDiscussionReplies(
			currentDiscussion.discussion.id,
			replyData.reply.id,
			setLoadingReplies
		);
	};

	// const handleDeleteComment = () => {
	// 	handleCommentDelete(replyData.reply, setDeletingReply);
	// };

	const handleShowReplyBox = () => {
		setShowReplyBox((prev) => !prev);
	};

	const focusReplyBox = () => {
		replyBoxRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
		replyBoxRef.current?.focus({ preventScroll: true });
	};

	useEffect(() => {
		if (showReplyBox) {
			focusReplyBox();
		}
	}, [showReplyBox]);

	return (
		<>
			<div
				className="reply-item flex flex-row gap-x-2 w-full relative min-h-[40px] entrance-animation-slide-from-right"
				show-reply-box={parentShowReplyBox ? "true" : "false"}
			>
				<div className="left flex flex-row relative">
					{replyData.reply.replyLevel > 0 && (
						<div className="deco-lines -z-0 absolute h-full w-10 top-0 left-0">
							<div className="straight h-full w-0 border-l-2 absolute bottom-0 -left-8 translate-x-[2px]"></div>
							<div className="curve h-8 w-[28px] absolute right-full -top-3 -translate-x-[2px] border-2 border-gray-200 border-t-transparent border-r-transparent rounded-bl-2xl"></div>
						</div>
					)}
					<div className="z-0 flex flex-row h-10 w-10">
						<UserIcon user={replyData.creator} />
					</div>
				</div>
				<div className="flex-1 flex flex-col gap-y-2">
					<div className="flex-1 flex flex-col gap-y-1 relative">
						<div className="w-full flex flex-col gap-x-2 relative">
							<div className="flex flex-col">
								<div className="flex flex-col">
									<h2 className="font-semibold text-xs truncate">
										{replyData.creator ? (
											<Link
												href={`/user/${replyData.creator.uid}`}
												className="inline hover:underline focus:underline"
											>
												{`${replyData.creator.firstName} ${replyData.creator.lastName}`}
											</Link>
										) : (
											<span>Unknown User</span>
										)}
									</h2>
									<p className="font-normal text-2xs text-gray-500 my-1">
										{moment(replyData.reply.createdAt).diff(moment(), "days") >
										-7
											? moment(replyData.reply.createdAt).fromNow()
											: moment(replyData.reply.createdAt).format(
													"MMMM DD, YYYY"
											  )}
									</p>
								</div>
								<div className="flex flex-col my-2">
									<p className="break-words text-sm">
										{replyData.reply.replyText}
									</p>
								</div>
							</div>
						</div>
						<div className="reply-footer-container">
							<div className="reply-vote-buttons-container">
								<button
									type="button"
									title={
										replyData.userReplyVote?.voteValue === 1
											? "Remove Upvote"
											: "Upvote"
									}
									// onClick={() => handleDiscussionVote("upVote")}
									className="vote-button upvote-button"
									data-voted={replyData.userReplyVote?.voteValue === 1}
								>
									{replyData.userReplyVote?.voteValue === 1 ? (
										<div className="icon-container">
											<TbArrowBigUpFilled className="icon" />
										</div>
									) : (
										<div className="icon-container">
											<TbArrowBigUp className="icon" />
										</div>
									)}
								</button>
								<div className="vote-count-container">
									<p className="vote-count">
										{replyData.reply.numberOfUpVotes <
											replyData.reply.numberOfDownVotes && "-"}
										{formatNumberWithSuffix(
											Math.abs(
												replyData.reply.numberOfUpVotes -
													replyData.reply.numberOfDownVotes
											)
										)}
									</p>
								</div>
								<button
									type="button"
									title={
										replyData.userReplyVote?.voteValue === -1
											? "Remove Downvote"
											: "Downvote"
									}
									// onClick={() => handleDiscussionVote("downVote")}
									className="vote-button downvote-button"
									data-voted={replyData.userReplyVote?.voteValue === -1}
								>
									{replyData.userReplyVote?.voteValue === -1 ? (
										<div className="icon-container">
											<TbArrowBigDownFilled className="icon" />
										</div>
									) : (
										<div className="icon-container">
											<TbArrowBigDown className="icon" />
										</div>
									)}
								</button>
							</div>
							<div className="reply-buttons-container">
								{replyData.reply.replyLevel < 2 && (
									<button
										type="button"
										title="Reply"
										className="button"
										onClick={handleShowReplyBox}
									>
										<div className="icon-container translate-y-0.5">
											<GoComment className="icon" />
										</div>
										<div className="label-container">
											<p className="label">Reply</p>
										</div>
									</button>
								)}
								<button
									type="button"
									title="Share"
									className="button"
								>
									<div className="icon-container">
										<TbShare3 className="icon" />
									</div>
									<div className="label-container">
										<p className="label">Share</p>
									</div>
								</button>
							</div>
						</div>
						<div className="absolute top-0 -left-8 h-full w-max pt-12 translate-x-[2px]">
							<div className="border-l-2 h-full w-0 bg-transparent"></div>
						</div>
					</div>
					{showReplies && (
						<div className="flex flex-col gap-y-2">
							{currentDiscussion?.discussionReplies
								.filter(
									(reply) =>
										reply.reply.replyLevel === replyData.reply.replyLevel + 1 &&
										reply.reply.replyForId === replyData.reply.id
								)
								.map((reply) => (
									<React.Fragment key={reply.reply.id}>
										<ReplyItem
											currentDiscussion={currentDiscussion}
											userStateValue={userStateValue}
											submitting={submitting}
											replyData={reply}
											parentShowReplyBox={showReplyBox}
											fetchDiscussionReplies={fetchDiscussionReplies}
											onSubmit={onSubmit}
											onChange={onChange}
											formatNumberWithSuffix={formatNumberWithSuffix}
										/>
									</React.Fragment>
								))}
							{loadingReplies && (
								<>
									<p>Loading Replies...</p>
								</>
							)}
						</div>
					)}
					{replyData.reply.numberOfReplies > remainingReplies && (
						<div className="flex flex-col w-full justify-start">
							<button
								type="button"
								title="Show Replies"
								className="text-sm w-fit px-6 py-1 font-semibold btn-text text-gray-700"
								onClick={handleFetchReplies}
							>
								{showReplies
									? "View More Replies"
									: `Show ${
											replyData.reply.numberOfReplies - remainingReplies
									  } ${
											replyData.reply.numberOfReplies - remainingReplies === 1
												? "Reply"
												: "Replies"
									  }`}
							</button>
						</div>
					)}
					{showReplyBox && discussionReplyForm.replyLevel < maxReplyLevel && (
						<ReplyBox
							userStateValue={userStateValue}
							replyForm={discussionReplyForm}
							setReplyForm={setDiscussionReplyForm}
							replyForId={replyData.reply.id}
							replyLevel={replyData.reply.replyLevel + 1}
							submitting={false}
							replyBoxRef={replyBoxRef}
							setShowReplies={setShowReplies}
							onSubmit={onSubmit}
							onChange={onChange}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default ReplyItem;
