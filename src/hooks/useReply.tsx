import React from "react";
import useUser from "./useUser";
import useDiscussion from "./useDiscussion";
import { DiscussionReplyFormType } from "@/components/Discussion/DiscussionCard/DiscussionReply/DiscussionReplies";
import { DiscussionReplyData } from "@/atoms/discussionAtom";
import { Reply } from "@/lib/interfaces/discussion";
import axios from "axios";
import { apiConfig } from "@/lib/api/apiConfig";

export type fetchReplyParamsType = {
	discussionId: string;
	replyForId: string;
};

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
				if (newReplyData.discussionId !== newReplyData.replyForId) {
					const updatedReply: Partial<Reply> = {
						id: newReplyData.replyForId,
						numberOfReplies:
							discussionStateValue.currentDiscussion?.discussionReplies.find(
								(reply) => reply.reply.id === newReplyData.replyForId
							)?.reply.numberOfReplies! + 1,
					};

					const { isUpdated } = await axios
						.put(apiConfig.apiEndpoint + "/discussions/replies/", {
							apiKey: userStateValue.api?.keys[0].key,
							replyData: updatedReply,
						})
						.then((response) => response.data)
						.catch((error) => {
							throw new Error(
								`API (PUT - Reply): Update reply failed:\n${error.message}`
							);
						});

					if (isUpdated) {
						setDiscussionStateValue((prev) => ({
							...prev,
							currentDiscussion: {
								...prev.currentDiscussion!,
								discussionReplies: prev.currentDiscussion!.discussionReplies.map(
									(reply) => {
										if (reply.reply.id === newReplyData.replyForId) {
											return {
												...reply,
												reply: {
													...reply.reply,
													numberOfReplies: reply.reply.numberOfReplies + 1,
												},
											};
										} else {
											return reply;
										}
									}
								),
							},
						}));
					}
				}

				setDiscussionStateValue((prev) => ({
					...prev,
					discussions: prev.discussions.map((discussion) => {
						if (discussion.discussion.id === newReplyData.discussionId) {
							return {
								...discussion,
								discussion: {
									...discussion.discussion,
									numberOfReplies: discussion.discussion.numberOfReplies + 1,
									numberOfFirstLevelReplies:
										newReplyData.replyForId === newReplyData.discussionId
											? discussion.discussion.numberOfFirstLevelReplies
											: discussion.discussion.numberOfFirstLevelReplies + 1,
								},
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
								newReplyData.replyForId === newReplyData.discussionId
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
	const fetchReplies = async ({
		discussionId,
		replyForId,
	}: fetchReplyParamsType) => {
		try {
			if (discussionStateValue.currentDiscussion !== null) {
				const lastIndex =
					discussionStateValue.currentDiscussion.discussionReplies.reduceRight(
						(acc, reply, index) => {
							if (reply.reply.replyForId === replyForId && acc === -1) {
								return index;
							}
							return acc;
						},
						-1
					);

				const lastReply =
					discussionStateValue.currentDiscussion.discussionReplies[lastIndex];

				const { repliesData }: { repliesData: DiscussionReplyData[] } =
					await axios
						.get(apiConfig.apiEndpoint + "/discussions/replies/replies", {
							params: {
								apiKey: userStateValue.api?.keys[0].key,
								userId: authUser?.uid,
								discussionId: discussionId,
								replyForId: replyForId,
								fromVote: lastReply
									? lastReply.reply.numberOfVotes + 1
									: Number.MAX_SAFE_INTEGER,
								fromDate: lastReply?.reply.createdAt,
							},
						})
						.then((response) => response.data)
						.catch((error) => {
							throw new Error(
								`API (GET - Replies): Fetch replies failed:\n${error.message}`
							);
						});

				if (repliesData.length > 0) {
					setDiscussionStateValue((prev) => ({
						...prev,
						currentDiscussion: {
							...prev.currentDiscussion!,
							discussionReplies: [
								...prev.currentDiscussion!.discussionReplies,
								...repliesData,
							],
						},
					}));
				} else {
					console.log("Mongo: No more replies");
				}
			}
		} catch (error: any) {
			console.log(`MONGO: Fetch Replies Error:\n${error.message}`);
		}
	};

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
