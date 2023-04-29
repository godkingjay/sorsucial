import { UserState } from "@/atoms/userAtom";
import React, { useCallback, useEffect } from "react";
import ReplyBox from "./ReplyBox";
import { Reply } from "@/lib/interfaces/discussion";
import { DiscussionReplyData, DiscussionState } from "@/atoms/discussionAtom";
import useReply from "@/hooks/useReply";
import ReplyItem from "./ReplyItem";
import ErrorBannerTextSm from "@/components/Banner/ErrorBanner/ErrorBannerTextSm";

type DiscussionRepliesProps = {
	userStateValue: UserState;
	userMounted: boolean;
	currentDiscussion: DiscussionState["currentDiscussion"];
	replyBoxRef: React.RefObject<HTMLTextAreaElement>;
	formatNumberWithSuffix: (number: number) => string;
};

export type DiscussionReplyFormType = {
	discussionId: string;
	groupId?: string;
	replyText: string;
	replyForId: string;
	replyLevel: number;
};

const DiscussionReplies: React.FC<DiscussionRepliesProps> = ({
	userStateValue,
	userMounted,
	currentDiscussion,
	replyBoxRef,
	formatNumberWithSuffix,
}) => {
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
	const componentDidMount = React.useRef(false);

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
			replyForId: string,
			replyLevel: number
		) => {
			event.preventDefault();

			try {
				if (!creatingReply) {
					setCreatingReply(true);
					await createReply({
						...replyForm,
						replyForId,
						replyLevel,
					});
					setReplyForm((prev) => ({
						...prev,
						replyText: "",
					}));
				} else {
					console.log("Hook: Already creating reply");
				}
			} catch (error) {
				console.log("Hook: Error while creating comment: ", error);
			}

			setCreatingReply(false);
		},
		[createReply, creatingReply]
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
		if (userMounted && !componentDidMount.current) {
			componentDidMount.current = true;
			firstFetchReplies();
		}
	}, [userMounted, componentDidMount.current]);

	return (
		<>
			{currentDiscussion && (
				<>
					<div className="h-[1px] bg-gray-200"></div>
					<div className="p-4 flex flex-col gap-y-2">
						{firstLoadingReplies || !userMounted ? (
							<>
								<p>Loading Replies</p>
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
								{currentDiscussion.discussionReplies
									.filter(
										(reply) =>
											reply.reply.replyLevel === 0 &&
											reply.reply.replyForId === currentDiscussion.discussion.id
									)
									.map((reply) => (
										<React.Fragment key={reply.reply.id}>
											<ReplyItem
												userStateValue={userStateValue}
												currentDiscussion={currentDiscussion}
												replyData={reply}
												submitting={creatingReply}
												fetchDiscussionReplies={fetchDiscussionReplies}
												parentShowReplyBox={true}
												handleReplyVote={handleReplyVote}
												handleReplyDelete={handleReplyDelete}
												onSubmit={handleReplySubmit}
												onChange={handleInputChange}
												formatNumberWithSuffix={formatNumberWithSuffix}
											/>
										</React.Fragment>
									))}
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
									!currentDiscussion.discussionDeleted && (
										<ReplyBox
											userStateValue={userStateValue}
											replyForm={discussionReplyForm}
											setReplyForm={setDiscussionReplyForm}
											replyLevel={0}
											replyForId={currentDiscussion.discussion.id}
											submitting={creatingReply}
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
