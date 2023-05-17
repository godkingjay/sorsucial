import UserIcon from "@/components/Icons/UserIcon";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { DiscussionData, DiscussionReplyData } from "@/atoms/discussionAtom";
import { DiscussionReplyFormType } from "./DiscussionReplies";
import ReplyBox from "./ReplyBox";
import {
	TbArrowBigDown,
	TbArrowBigDownFilled,
	TbArrowBigDownLinesFilled,
	TbArrowBigUp,
	TbArrowBigUpFilled,
	TbArrowBigUpLinesFilled,
} from "react-icons/tb";
import { GoComment } from "react-icons/go";
import { RiArrowUpDownFill } from "react-icons/ri";
import { Reply } from "@/lib/interfaces/discussion";
import { MdDeleteOutline } from "react-icons/md";
import { FiAlertCircle } from "react-icons/fi";
import DiscussionReplyItemSkeleton from "@/components/Skeleton/Discussion/DiscussionReply/DiscussionReplyItemSkeleton";
import useUser from "@/hooks/useUser";
import useInput from "@/hooks/useInput";
import useGroup from "@/hooks/useGroup";

type ReplyItemProps = {
	currentDiscussion: DiscussionData;
	replyData: DiscussionReplyData;
	parentShowReplyBox: boolean;
	fetchDiscussionReplies: (
		discussionId: string,
		replyForId: string,
		setFetchingReplies: React.Dispatch<React.SetStateAction<boolean>>
	) => Promise<void>;
	handleReplyVote: (
		voting: boolean,
		setVoting: React.Dispatch<React.SetStateAction<boolean>>,
		replyData: DiscussionReplyData,
		voteType: "upVote" | "downVote"
	) => Promise<void>;
	handleReplyDelete: (
		reply: Reply,
		deleting: boolean,
		setDeleting: React.Dispatch<React.SetStateAction<boolean>>
	) => Promise<void>;
	onSubmit: (
		event: React.FormEvent<HTMLFormElement>,
		replyForm: DiscussionReplyFormType,
		setReplyForm: React.Dispatch<React.SetStateAction<DiscussionReplyFormType>>,
		replying: boolean,
		setReplying: React.Dispatch<React.SetStateAction<boolean>>,
		replyForId: string,
		replyLevel: number
	) => void;
	onChange: (
		event: React.ChangeEvent<HTMLTextAreaElement>,
		setReplyForm: React.Dispatch<React.SetStateAction<DiscussionReplyFormType>>
	) => void;
};

const maxReplyLevel = 3;

const ReplyItem: React.FC<ReplyItemProps> = ({
	currentDiscussion,
	replyData,
	parentShowReplyBox,
	fetchDiscussionReplies,
	handleReplyVote,
	handleReplyDelete,
	onSubmit,
	onChange,
}) => {
	const { userStateValue } = useUser();

	const { groupStateValue } = useGroup();

	const { formatNumberWithSuffix } = useInput();

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
	const [creatingReply, setCreatingReply] = useState(false);
	const [deletingReply, setDeletingReply] = useState(false);
	const remainingReplies = currentDiscussion.discussionReplies.filter(
		(reply) => reply.reply.replyForId === replyData.reply.id
	).length;
	const [voting, setVoting] = useState(false);
	const replyBoxRef = useRef<HTMLTextAreaElement>(null);

	const handleFetchReplies = async () => {
		setShowReplies(true);
		if (!loadingReplies && !replyData.replyDeleted) {
			await fetchDiscussionReplies(
				currentDiscussion.discussion.id,
				replyData.reply.id,
				setLoadingReplies
			);
		}
	};

	const handleDeleteReply = async () => {
		if (!voting && !deletingReply && !replyData.replyDeleted) {
			await handleReplyDelete(replyData.reply, deletingReply, setDeletingReply);
		}
	};

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
								<div className="flex flex-row justify-between">
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
								</div>
								<div className="flex flex-col my-2">
									<p className="break-words text-sm">
										{replyData.reply.replyText}
									</p>
								</div>
							</div>
							<div className="reply-vote-reply-details-wrapper">
								<div className="reply-vote-details-container">
									<div
										className="reply-vote total-votes"
										title="Votes"
										has-vote={
											replyData.reply.numberOfVotes !== 0 ? "true" : "false"
										}
									>
										<div className="icon-container">
											<RiArrowUpDownFill className="icon" />
										</div>
										<p className="label">
											{formatNumberWithSuffix(replyData.reply.numberOfVotes)}
										</p>
									</div>
									<div
										className="reply-vote total-upvotes"
										title="Upvotes"
										has-vote={
											replyData.reply.numberOfUpVotes !== 0 ? "true" : "false"
										}
									>
										<div className="icon-container">
											<TbArrowBigUpLinesFilled className="icon" />
										</div>
										<p className="label">
											{formatNumberWithSuffix(replyData.reply.numberOfUpVotes)}
										</p>
									</div>
									<div
										className="reply-vote total-downvotes"
										title="Downvotes"
										has-vote={
											replyData.reply.numberOfDownVotes !== 0 ? "true" : "false"
										}
									>
										<div className="icon-container">
											<TbArrowBigDownLinesFilled className="icon" />
										</div>
										<p className="label">
											{formatNumberWithSuffix(replyData.reply.numberOfDownVotes)}
										</p>
									</div>
								</div>
							</div>
						</div>
						{replyData.replyDeleted && (
							<div className="inline-flex gap-x-2 entrance-animation-slide-from-left text-red-500">
								<div className="h-4 w-4 aspect-square">
									<FiAlertCircle className="h-full w-full" />
								</div>
								<p className="text-xs">This reply no longer exist</p>
							</div>
						)}
						<div className="reply-footer-container">
							<div className="reply-vote-buttons-container">
								<button
									type="button"
									title={
										replyData.userReplyVote?.voteValue === 1
											? "Remove Upvote"
											: "Upvote"
									}
									onClick={() =>
										!voting &&
										!deletingReply &&
										!replyData.replyDeleted &&
										handleReplyVote(voting, setVoting, replyData, "upVote")
									}
									className="vote-button upvote-button"
									data-voted={replyData.userReplyVote?.voteValue === 1}
									disabled={voting || deletingReply || replyData.replyDeleted}
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
									onClick={() =>
										!voting &&
										!deletingReply &&
										!replyData.replyDeleted &&
										handleReplyVote(voting, setVoting, replyData, "downVote")
									}
									className="vote-button downvote-button"
									data-voted={replyData.userReplyVote?.voteValue === -1}
									disabled={voting || deletingReply || replyData.replyDeleted}
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
								{replyData.reply.replyLevel < maxReplyLevel &&
									(groupStateValue.currentGroup &&
									currentDiscussion.discussion.groupId ===
										groupStateValue.currentGroup.group.id &&
									currentDiscussion.discussion.privacy !== "public"
										? groupStateValue.currentGroup.userJoin?.roles.includes(
												"member"
										  )
										: true) && (
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
								{/* <button
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
								</button> */}
								{(userStateValue.user?.uid === replyData.reply.creatorId ||
									userStateValue.user.roles.includes("admin")) && (
									<button
										type="button"
										title="Delete"
										className="button delete-button"
										onClick={() =>
											!deletingReply &&
											!voting &&
											!replyData.replyDeleted &&
											handleDeleteReply()
										}
										disabled={deletingReply || voting || replyData.replyDeleted}
									>
										<div className="icon-container">
											<MdDeleteOutline className="icon" />
										</div>
										<div className="label-container">
											<p className="label">Delete</p>
										</div>
									</button>
								)}
							</div>
						</div>
						<div className="absolute top-0 -left-8 h-full w-max pt-12 translate-x-[2px]">
							<div className="border-l-2 h-full w-0 bg-transparent"></div>
						</div>
					</div>
					{showReplies && replyData.reply.numberOfReplies > 0 && (
						<div className="flex flex-col gap-y-2">
							{creatingReply && (
								<>
									<DiscussionReplyItemSkeleton
										replyLevel={replyData.reply.replyLevel + 1}
										parentShowReplyBox={showReplyBox}
									/>
								</>
							)}
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
											replyData={reply}
											parentShowReplyBox={showReplyBox}
											fetchDiscussionReplies={fetchDiscussionReplies}
											handleReplyVote={handleReplyVote}
											handleReplyDelete={handleReplyDelete}
											onSubmit={onSubmit}
											onChange={onChange}
										/>
									</React.Fragment>
								))}
							{loadingReplies && (
								<>
									<DiscussionReplyItemSkeleton
										replyLevel={replyData.reply.replyLevel + 1}
										parentShowReplyBox={showReplyBox}
									/>
									<DiscussionReplyItemSkeleton
										replyLevel={replyData.reply.replyLevel + 1}
										parentShowReplyBox={showReplyBox}
									/>
								</>
							)}
						</div>
					)}
					{replyData.reply.numberOfReplies > remainingReplies &&
						!replyData.replyDeleted && (
							<div className="flex flex-col w-full justify-start">
								<button
									type="button"
									title="Show Replies"
									className="text-sm w-fit px-6 py-1 font-semibold btn-text text-gray-700"
									onClick={() => !loadingReplies && handleFetchReplies()}
									disabled={loadingReplies}
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
					{showReplyBox &&
						discussionReplyForm.replyLevel < maxReplyLevel &&
						!replyData.replyDeleted &&
						(groupStateValue.currentGroup &&
						currentDiscussion.discussion.groupId ===
							groupStateValue.currentGroup.group.id &&
						currentDiscussion.discussion.privacy !== "public"
							? groupStateValue.currentGroup.userJoin?.roles.includes("member")
							: true) && (
							<ReplyBox
								replyForm={discussionReplyForm}
								setReplyForm={setDiscussionReplyForm}
								replyForId={replyData.reply.id}
								replyLevel={replyData.reply.replyLevel + 1}
								replying={creatingReply}
								setReplying={setCreatingReply}
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
