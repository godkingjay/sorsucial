import React, { useCallback, useEffect } from "react";
import ReplyBox from "./ReplyBox";
import { Reply } from "@/lib/interfaces/discussion";
import { DiscussionReplyData, DiscussionState } from "@/atoms/discussionAtom";
import useReply from "@/hooks/useReply";
import ReplyItem from "./ReplyItem";
import ErrorBannerTextSm from "@/components/Banner/ErrorBanner/ErrorBannerTextSm";
import DiscussionReplyItemSkeleton from "@/components/Skeleton/Discussion/DiscussionReply/DiscussionReplyItemSkeleton";
import useUser from "@/hooks/useUser";
import useGroup from "@/hooks/useGroup";

type DiscussionRepliesProps = {
	currentDiscussion: DiscussionState["currentDiscussion"];
	replyBoxRef: React.RefObject<HTMLTextAreaElement>;
};

export type DiscussionReplyFormType = {
	discussionId: string;
	groupId?: string;
	replyText: string;
	replyForId: string;
	replyLevel: number;
};

const DiscussionReplies: React.FC<DiscussionRepliesProps> = ({
	currentDiscussion,
	replyBoxRef,
}) => {
	const { userStateValue, userMounted } = useUser();

	const { groupStateValue } = useGroup();

	const { createReply, onReplyVote, fetchReplies, deleteReply } = useReply();
	const [discussionReplyForm, setDiscussionReplyForm] =
		React.useState<DiscussionReplyFormType>({
			discussionId: currentDiscussion?.discussion.id!,
			groupId: currentDiscussion?.discussion.groupId,
			replyText: "",
			replyLevel: 0,
			replyForId: currentDiscussion?.discussion.id!,
		});
	const [creatingReply, setCreatingReply] = React.useState(false);
	const [firstLoadingReplies, setFirstLoadingReplies] = React.useState(false);
	const [loadingReplies, setLoadingReplies] = React.useState(true);
	const repliesMounted = React.useRef(false);

	const fetchDiscussionReplies = useCallback(
		async (
			discussionId: string,
			replyForId: string,
			setFetchingReplies: React.Dispatch<React.SetStateAction<boolean>>
		) => {
			setFetchingReplies(true);
			try {
				if (currentDiscussion) {
					await fetchReplies({
						discussionId,
						replyForId,
					});
				}
			} catch (error: any) {
				console.log(`
				Hook: Error while fetching replies for discussion:
				${error.message}
			`);
			}
			setFetchingReplies(false);
		},
		[currentDiscussion, fetchReplies]
	);

	const firstFetchReplies = useCallback(async () => {
		setFirstLoadingReplies(true);
		if (currentDiscussion) {
			await fetchDiscussionReplies(
				currentDiscussion?.discussion.id,
				currentDiscussion?.discussion.id,
				setLoadingReplies
			);
		}
		setFirstLoadingReplies(false);
	}, [currentDiscussion, fetchDiscussionReplies]);

	const handleFetchReplies = useCallback(async () => {
		if (currentDiscussion) {
			if (!loadingReplies) {
				await fetchDiscussionReplies(
					currentDiscussion.discussion.id,
					currentDiscussion.discussion.id,
					setLoadingReplies
				);
			}
		}
	}, [currentDiscussion, fetchDiscussionReplies, loadingReplies]);

	const handleReplyVote = useCallback(
		async (
			voting: boolean,
			setVoting: React.Dispatch<React.SetStateAction<boolean>>,
			replyData: DiscussionReplyData,
			voteType: "upVote" | "downVote"
		) => {
			if (!replyData) {
				return;
			}

			try {
				if (!userStateValue.user.uid) {
					return;
				}

				if (!voting) {
					setVoting(true);
					await onReplyVote(replyData, voteType);
				}
			} catch (error: any) {
				console.log("Hook: Error while voting for reply:\n", error.message);
			}
			setVoting(false);
		},
		[onReplyVote, userStateValue.user.uid]
	);

	const handleReplyDelete = useCallback(
		async (
			reply: Reply,
			deleting: boolean,
			setDeleting: React.Dispatch<React.SetStateAction<boolean>>
		) => {
			try {
				if (!deleting && reply) {
					setDeleting(true);
					await deleteReply(reply);
				}
			} catch (error: any) {
				console.log(`=>Hook: Error while deleting reply:\n${error.message}`);
			}
			setDeleting(false);
		},
		[deleteReply]
	);

	const handleReplySubmit = useCallback(
		async (
			event: React.FormEvent<HTMLFormElement>,
			replyForm: DiscussionReplyFormType,
			setReplyForm: React.Dispatch<
				React.SetStateAction<DiscussionReplyFormType>
			>,
			replying: boolean,
			setReplying: React.Dispatch<React.SetStateAction<boolean>>,
			replyForId: string,
			replyLevel: number
		) => {
			event.preventDefault();

			if (replying) {
				return;
			}

			try {
				if (!replying) {
					setReplying(true);
					await createReply({
						...replyForm,
						replyForId,
						replyLevel,
					});
					setReplyForm((prev) => ({
						...prev,
						replyText: "",
					}));
					setReplying(false);
				}
			} catch (error) {
				console.log("Hook: Error while creating comment: ", error);
				setReplying(false);
			}
		},
		[createReply]
	);

	const handleInputChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>,
		setReplyForm: React.Dispatch<React.SetStateAction<DiscussionReplyFormType>>
	) => {
		setReplyForm((prev) => ({
			...prev,
			replyText: event.target.value,
		}));
	};

	useEffect(() => {
		if (userMounted && !repliesMounted.current) {
			repliesMounted.current = true;
			firstFetchReplies();
		}
	}, [userMounted, repliesMounted.current]);

	return (
		<>
			{currentDiscussion && (
				<>
					<div className="h-[1px] bg-gray-200"></div>
					<div className="p-4 flex flex-col gap-y-2">
						{firstLoadingReplies || !userMounted ? (
							<>
								<DiscussionReplyItemSkeleton
									replyLevel={0}
									parentShowReplyBox={false}
								/>
								<DiscussionReplyItemSkeleton
									replyLevel={0}
									parentShowReplyBox={false}
								/>
							</>
						) : (
							<>
								{currentDiscussion.discussionDeleted && (
									<div className="duration-200 cursor-not-allowed opacity-100 sm:opacity-50 entrance-animation-float-down z-[250] sticky top-16 items-center mb-2 font-semibold hover:opacity-100 focus-within:opacity-100">
										<ErrorBannerTextSm
											message="This discussion no longer exist. It may have been deleted by the
											creator or an admin."
										/>
									</div>
								)}
								{creatingReply && (
									<>
										<DiscussionReplyItemSkeleton
											replyLevel={0}
											parentShowReplyBox={false}
										/>
									</>
								)}
								{currentDiscussion.discussionReplies
									.filter(
										(reply) =>
											reply.reply.replyLevel === 0 &&
											reply.reply.replyForId === currentDiscussion.discussion.id
									)
									.map((reply) => (
										<React.Fragment key={reply.reply.id}>
											<ReplyItem
												currentDiscussion={currentDiscussion}
												replyData={reply}
												fetchDiscussionReplies={fetchDiscussionReplies}
												parentShowReplyBox={true}
												handleReplyVote={handleReplyVote}
												handleReplyDelete={handleReplyDelete}
												onSubmit={handleReplySubmit}
												onChange={handleInputChange}
											/>
										</React.Fragment>
									))}
								{loadingReplies && (
									<>
										<DiscussionReplyItemSkeleton
											replyLevel={0}
											parentShowReplyBox={false}
										/>
										<DiscussionReplyItemSkeleton
											replyLevel={0}
											parentShowReplyBox={false}
										/>
									</>
								)}
								{!loadingReplies &&
									currentDiscussion.discussionReplies.filter(
										(reply) =>
											reply.reply.replyLevel === 0 &&
											reply.reply.replyForId === currentDiscussion.discussion.id
									).length === 0 && (
										<>
											<p className="font-bold text-center text-gray-500">
												This discussion has no replies yet.
											</p>
										</>
									)}
								{currentDiscussion.discussion.numberOfFirstLevelReplies >
									currentDiscussion.discussionReplies.filter(
										(reply) =>
											reply.reply.replyForId === currentDiscussion.discussion.id
									).length &&
									!currentDiscussion.discussionDeleted && (
										<div className="flex flex-col w-full justify-start">
											<button
												type="button"
												title="View More Replies"
												className="text-sm w-fit px-6 py-1 font-semibold btn-text text-gray-700"
												onClick={() => !loadingReplies && handleFetchReplies()}
												disabled={loadingReplies}
											>
												View More Replies
											</button>
										</div>
									)}
								{currentDiscussion.discussion.isOpen &&
									!currentDiscussion.discussionDeleted &&
									(groupStateValue.currentGroup &&
									currentDiscussion.discussion.groupId ===
										groupStateValue.currentGroup.group.id &&
									currentDiscussion.discussion.privacy !== "public"
										? groupStateValue.currentGroup.userJoin?.roles.includes(
												"member"
										  )
										: true) && (
										<ReplyBox
											replyForm={discussionReplyForm}
											setReplyForm={setDiscussionReplyForm}
											replyLevel={0}
											replyForId={currentDiscussion.discussion.id}
											replying={creatingReply}
											setReplying={setCreatingReply}
											replyBoxRef={replyBoxRef}
											onSubmit={handleReplySubmit}
											onChange={handleInputChange}
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

export default DiscussionReplies;
