import { UserState } from "@/atoms/userAtom";
import React, { useEffect } from "react";
import ReplyBox from "./ReplyBox";
import { Reply } from "@/lib/interfaces/discussion";
import { DiscussionState } from "@/atoms/discussionAtom";
import useReply from "@/hooks/useReply";

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

	const firstFetchReplies = async () => {
		setFirstLoadingReplies(true);
		if (currentDiscussion) {
			await fetchDiscussionReplies(
				currentDiscussion?.discussion.id,
				currentDiscussion?.discussion.id,
				setLoadingReplies
			);
		}
		setFirstLoadingReplies(false);
	};

	const fetchDiscussionReplies = async (
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
	};

	const handleReplySubmit = async (
		event: React.FormEvent<HTMLFormElement>,
		replyForm: DiscussionReplyFormType,
		setReplyForm: React.Dispatch<React.SetStateAction<DiscussionReplyFormType>>,
		replyForId: string,
		replyLevel: number
	) => {
		event.preventDefault();

		if (creatingReply) return;

		setCreatingReply(true);

		try {
			await createReply({
				...replyForm,
				replyForId,
				replyLevel,
			});
			setReplyForm((prev) => ({
				...prev,
				replyText: "",
			}));
		} catch (error) {
			console.log("Hook: Error while creating comment: ", error);
		}

		setCreatingReply(false);
	};

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
								{currentDiscussion.discussion.isOpen && (
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
