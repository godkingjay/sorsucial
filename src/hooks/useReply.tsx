import React from "react";
import useUser from "./useUser";
import useDiscussion from "./useDiscussion";
import { DiscussionReplyFormType } from "@/components/Discussion/DiscussionCard/DiscussionReply/DiscussionReplies";
import { DiscussionReplyData } from "@/atoms/discussionAtom";
import { Reply } from "@/lib/interfaces/discussion";
import axios from "axios";
import { apiConfig } from "@/lib/api/apiConfig";

const useReply = () => {
	const { authUser, userStateValue } = useUser();
	const { discussionStateValue, setDiscussionStateValue } = useDiscussion();

	/**
	 * *  ██████╗       ██████╗ ███████╗██████╗ ██╗  ██╗   ██╗
	 * * ██╔════╝██╗    ██╔══██╗██╔════╝██╔══██╗██║  ╚██╗ ██╔╝
	 * * ██║     ╚═╝    ██████╔╝█████╗  ██████╔╝██║   ╚████╔╝
	 * * ██║     ██╗    ██╔══██╗██╔══╝  ██╔═══╝ ██║    ╚██╔╝
	 * * ╚██████╗╚═╝    ██║  ██║███████╗██║     ███████╗██║
	 * *  ╚═════╝       ╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝╚═╝
	 */
	/**
	 *
	 */
	const createReply = async (replyForm: DiscussionReplyFormType) => {
		try {
			const replyDate = new Date();

			const newReply: Partial<Reply> = {
				discussionId: replyForm.discussionId,
				creatorId: authUser?.uid,
				replyText: replyForm.replyText,
				replyLevel: replyForm.replyLevel,
				replyForId: replyForm.replyForId,
				numberOfVotes: 0,
				numberOfUpVotes: 0,
				numberOfDownVotes: 0,
				numberOfReplies: 0,
				isHidden: false,
				replyStatus: "reply",
				updatedAt: replyDate,
				createdAt: replyDate,
			};

			if (replyForm.groupId) {
				newReply.groupId = replyForm.groupId;
			}

			const { newReplyData }: { newReplyData: Reply } = await axios
				.post(apiConfig.apiEndpoint + "/discussions/replies/", {
					apiKey: userStateValue.api?.keys[0].key,
					replyData: newReply,
				})
				.then((response) => response.data)
				.catch((error) => {
					throw new Error(`
							API (POST - Reply): Create reply failed:
							${error.message}
						`);
				});

			if (newReplyData) {
				setDiscussionStateValue((prev) => ({
					...prev,
					discussions: prev.discussions.map((discussion) => {
						if (discussion.discussion.id === newReplyData.discussionId) {
							return {
								...discussion,
								numberOfReplies: discussion.discussion.numberOfReplies + 1,
								numberOfFirstLevelReplies:
									newReplyData.replyLevel === 0
										? discussion.discussion.numberOfFirstLevelReplies
										: discussion.discussion.numberOfFirstLevelReplies + 1,
							};
						} else {
							return discussion;
						}
					}),
					currentDiscussion: {
						...prev.currentDiscussion!,
						discussion: {
							...prev.currentDiscussion!.discussion,
							numberOfReplies:
								prev.currentDiscussion!.discussion.numberOfReplies + 1,
							numberOfFirstLevelReplies:
								newReplyData.replyLevel === 0
									? prev.currentDiscussion?.discussion.numberOfFirstLevelReplies!
									: prev.currentDiscussion?.discussion
											.numberOfFirstLevelReplies! + 1,
						},
						discussionReplies: [
							{
								reply: newReplyData,
								creator: userStateValue.user!,
								userReplyVote: null,
							},
							...prev.currentDiscussion!.discussionReplies,
						],
					},
				}));
			}
		} catch (error: any) {
			console.log(`
        MONGO: Create Reply Error:
        ${error.message}
      `);
		}
	};

	/**
	 * *  ██████╗██████╗        ██╗   ██╗ ██████╗ ████████╗███████╗
	 * * ██╔════╝██╔══██╗██╗    ██║   ██║██╔═══██╗╚══██╔══╝██╔════╝
	 * * ██║     ██║  ██║╚═╝    ██║   ██║██║   ██║   ██║   █████╗
	 * ! ██║     ██║  ██║██╗    ╚██╗ ██╔╝██║   ██║   ██║   ██╔══╝
	 * ! ╚██████╗██████╔╝╚═╝     ╚████╔╝ ╚██████╔╝   ██║   ███████╗
	 * !  ╚═════╝╚═════╝          ╚═══╝   ╚═════╝    ╚═╝   ╚══════╝
	 */
	/**
	 *
	 */
	const onReplyVote = async () => {};

	/**
	 * ^ ██████╗        ██████╗ ███████╗██████╗ ██╗     ██╗███████╗███████╗
	 * ^ ██╔══██╗██╗    ██╔══██╗██╔════╝██╔══██╗██║     ██║██╔════╝██╔════╝
	 * ^ ██████╔╝╚═╝    ██████╔╝█████╗  ██████╔╝██║     ██║█████╗  ███████╗
	 * ^ ██╔══██╗██╗    ██╔══██╗██╔══╝  ██╔═══╝ ██║     ██║██╔══╝  ╚════██║
	 * ^ ██║  ██║╚═╝    ██║  ██║███████╗██║     ███████╗██║███████╗███████║
	 * ^ ╚═╝  ╚═╝       ╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝╚═╝╚══════╝╚══════╝
	 */
	/**
	 *
	 *
	 */
	const fetchReplies = async () => {};

	/**
	 * ^ ██████╗        ██╗   ██╗ ██████╗ ████████╗███████╗
	 * ^ ██╔══██╗██╗    ██║   ██║██╔═══██╗╚══██╔══╝██╔════╝
	 * ^ ██████╔╝╚═╝    ██║   ██║██║   ██║   ██║   █████╗
	 * ^ ██╔══██╗██╗    ╚██╗ ██╔╝██║   ██║   ██║   ██╔══╝
	 * ^ ██║  ██║╚═╝     ╚████╔╝ ╚██████╔╝   ██║   ███████╗
	 * ^ ╚═╝  ╚═╝         ╚═══╝   ╚═════╝    ╚═╝   ╚══════╝
	 */
	/**
	 *
	 *
	 */
	const fetchUserReplyVote = async () => {};

	/**
	 * ! ██████╗        ██████╗ ███████╗██████╗ ██╗  ██╗   ██╗
	 * ! ██╔══██╗██╗    ██╔══██╗██╔════╝██╔══██╗██║  ╚██╗ ██╔╝
	 * ! ██║  ██║╚═╝    ██████╔╝█████╗  ██████╔╝██║   ╚████╔╝
	 * ! ██║  ██║██╗    ██╔══██╗██╔══╝  ██╔═══╝ ██║    ╚██╔╝
	 * ! ██████╔╝╚═╝    ██║  ██║███████╗██║     ███████╗██║
	 * ! ╚═════╝        ╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝╚═╝
	 */
	/**
	 *
	 *
	 */
	const deleteReply = async () => {};

	return {
		createReply,
		onReplyVote,
		fetchReplies,
		fetchUserReplyVote,
		deleteReply,
	};
};

export default useReply;
