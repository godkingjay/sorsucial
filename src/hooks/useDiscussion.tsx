import {
	DiscussionData,
	DiscussionState,
	discussionOptionsState,
	discussionState,
} from "@/atoms/discussionAtom";
import React from "react";
import { useRecoilState } from "recoil";
import useUser from "./useUser";
import { CreateDiscussionType } from "@/components/Modal/DiscussionCreationModal";
import { DiscussionVote, SiteDiscussion } from "@/lib/interfaces/discussion";
import axios from "axios";
import { apiConfig } from "@/lib/api/apiConfig";

const useDiscussion = () => {
	const [discussionStateValue, setDiscussionStateValue] =
		useRecoilState(discussionState);
	const [discussionOptionsStateValue, setDiscussionOptionsStateValue] =
		useRecoilState(discussionOptionsState);
	const { authUser, userStateValue } = useUser();

	const createDiscussion = async (discussionForm: CreateDiscussionType) => {
		try {
			const discussionDate = new Date();

			const newDiscussion: Partial<SiteDiscussion> = {
				creatorId: userStateValue.user.uid,
				privacy: discussionForm.privacy,
				discussionTitle: discussionForm.discussionTitle,
				discussionBody: discussionForm.discussionBody,
				discussionType: discussionForm.discussionType,
				discussionTags: discussionForm.discussionTags,
				isHidden: false,
				isOpen: true,
				numberOfUpVotes: 0,
				numberOfDownVotes: 0,
				numberOfVotes: 0,
				numberOfReplies: 0,
				updatedAt: discussionDate,
				createdAt: discussionDate,
			};

			if (discussionForm.groupId) {
				newDiscussion.groupId = discussionForm.groupId;
			}

			const newDiscussionData: SiteDiscussion = await axios
				.post(apiConfig.apiEndpoint + "discussion/", {
					newDiscussion,
					creator: userStateValue.user,
				})
				.then((response) => response.data.newDiscussion)
				.catch((error: any) => {
					throw new Error(
						`API(Discussion): Discussion Creation Error:  ${error.message}`
					);
				});

			if (newDiscussionData) {
				setDiscussionStateValue(
					(prev) =>
						({
							...prev,
							discussions: [
								{
									discussion: newDiscussionData,
									creator: userStateValue.user,
								},
								...prev.discussions,
							],
						} as DiscussionState)
				);
			} else {
				throw new Error(
					`API(Discussion): Discussion Creation Error:  No Data Returned!`
				);
			}
		} catch (error: any) {
			console.log("Mongo: Creating Discussion Error: ", error.message);
		}
	};

	const onDiscussionVote = async (
		discussionData: DiscussionData,
		voteType: "upVote" | "downVote"
	) => {
		try {
			if (discussionData.userVote) {
				if (
					(voteType === "upVote" && discussionData.userVote.voteValue === 1) ||
					(voteType === "downVote" && discussionData.userVote.voteValue === -1)
				) {
					const { voteDeleted } = await axios
						.delete(apiConfig.apiEndpoint + "discussion/vote/", {
							data: {
								apiKey: userStateValue.api?.keys[0].key,
								discussionId: discussionData.discussion.id,
								userId: userStateValue.user.uid,
							},
						})
						.then((response) => response.data)
						.catch((error: any) => {
							throw new Error(
								`API(Discussion): Discussion Vote Deletion Error:  ${error.message}`
							);
						});

					if (voteDeleted) {
						if (voteType === "upVote") {
							setDiscussionStateValue((prev) => ({
								...prev,
								discussions: prev.discussions.map((discussion) => {
									if (
										discussion.discussion.id === discussionData.discussion.id
									) {
										return {
											...discussion,
											discussion: {
												...discussion.discussion,
												numberOfVotes: discussion.discussion.numberOfVotes - 1,
												numberOfUpVotes:
													discussion.discussion.numberOfUpVotes - 1,
											},
											userVote: null,
										};
									}

									return discussion;
								}),
							}));
						} else if (voteType === "downVote") {
							setDiscussionStateValue((prev) => ({
								...prev,
								discussions: prev.discussions.map((discussion) => {
									if (
										discussion.discussion.id === discussionData.discussion.id
									) {
										return {
											...discussion,
											discussion: {
												...discussion.discussion,
												numberOfVotes: discussion.discussion.numberOfVotes - 1,
												numberOfDownVotes:
													discussion.discussion.numberOfDownVotes - 1,
											},
											userVote: null,
										};
									}

									return discussion;
								}),
							}));
						}
					}
				} else {
					const voteDate = new Date();

					const newDiscussionVote: Partial<DiscussionVote> = {
						userId: discussionData.userVote.userId,
						discussionId: discussionData.userVote.discussionId,
						voteValue: voteType === "upVote" ? 1 : -1,
						updatedAt: voteDate,
					};

					const { voteChanged } = await axios
						.put(apiConfig.apiEndpoint + "discussion/vote/", {
							apiKey: userStateValue.api?.keys[0].key,
							discussionVoteData: newDiscussionVote,
							voteType,
						})
						.then((response) => response.data)
						.catch((error: any) => {
							throw new Error(
								`API(Discussion): Discussion Vote Change Error:  ${error.message}`
							);
						});

					if (voteChanged) {
						if (voteType === "upVote") {
							setDiscussionStateValue(
								(prev) =>
									({
										...prev,
										discussions: prev.discussions.map((discussion) => {
											if (
												discussion.discussion.id === discussionData.discussion.id
											) {
												return {
													...discussion,
													discussion: {
														...discussion.discussion,
														numberOfUpVotes:
															discussion.discussion.numberOfUpVotes + 1,
														numberOfDownVotes:
															discussion.discussion.numberOfDownVotes - 1,
														updatedAt: voteDate,
													},
													userVote: {
														...discussionData.userVote,
														...newDiscussionVote,
													},
												};
											}

											return discussion;
										}),
									} as DiscussionState)
							);
						} else {
							setDiscussionStateValue(
								(prev) =>
									({
										...prev,
										discussions: prev.discussions.map((discussion) => {
											if (
												discussion.discussion.id === discussionData.discussion.id
											) {
												return {
													...discussion,
													discussion: {
														...discussion.discussion,
														numberOfDownVotes:
															discussion.discussion.numberOfDownVotes + 1,
														numberOfUpVotes:
															discussion.discussion.numberOfUpVotes - 1,
														updatedAt: voteDate,
													},
													userVote: {
														...discussionData.userVote,
														...newDiscussionVote,
													},
												};
											}

											return discussion;
										}),
									} as DiscussionState)
							);
						}
					}
				}
			} else {
				const voteDate = new Date();

				const newDiscussionVote: Partial<DiscussionVote> = {
					userId: userStateValue.user.uid,
					discussionId: discussionData.discussion.id,
					voteValue: voteType === "upVote" ? 1 : -1,
					createdAt: voteDate,
					updatedAt: voteDate,
				};

				if (discussionData.discussion.groupId) {
					newDiscussionVote.groupId = discussionData.discussion.groupId;
				}

				const { voteSuccess } = await axios
					.post(apiConfig.apiEndpoint + "discussion/vote/", {
						apiKey: userStateValue.api?.keys[0].key,
						discussionVoteData: newDiscussionVote,
						voteType,
					})
					.then((response) => response.data)
					.catch((error) => {
						throw new Error(
							`API(Discussion): Discussion Vote Error:  ${error.message}`
						);
					});

				if (voteSuccess) {
					if (voteType === "upVote") {
						setDiscussionStateValue(
							(prev) =>
								({
									...prev,
									discussions: prev.discussions.map((discussion) => {
										if (
											discussion.discussion.id === discussionData.discussion.id
										) {
											return {
												...discussion,
												discussion: {
													...discussion.discussion,
													numberOfVotes: discussion.discussion.numberOfVotes + 1,
													numberOfUpVotes:
														discussion.discussion.numberOfUpVotes + 1,
												},
												userVote: newDiscussionVote,
											};
										}

										return discussion;
									}),
								} as DiscussionState)
						);
					} else {
						setDiscussionStateValue(
							(prev) =>
								({
									...prev,
									discussions: prev.discussions.map((discussion) => {
										if (
											discussion.discussion.id === discussionData.discussion.id
										) {
											return {
												...discussion,
												discussion: {
													...discussion.discussion,
													numberOfVotes: discussion.discussion.numberOfVotes + 1,
													numberOfDownVotes:
														discussion.discussion.numberOfDownVotes + 1,
												},
												userVote: newDiscussionVote,
											};
										}

										return discussion;
									}),
								} as DiscussionState)
						);
					}
				}
			}
		} catch (error: any) {
			console.log("Mongo: Voting Discussion Error: ", error.message);
		}
	};

	const fetchDiscussions = async (
		discussionType: SiteDiscussion["discussionType"],
		privacy: SiteDiscussion["privacy"],
		isOpen: SiteDiscussion["isOpen"]
	) => {
		try {
			const lastIndex = discussionStateValue.discussions.reduceRight(
				(acc, discussion, index) => {
					if (
						discussion.discussion.discussionType === discussionType &&
						acc === -1
					) {
						return index;
					}

					return acc;
				},
				-1
			);

			const lastDiscussion = discussionStateValue.discussions[lastIndex] || null;

			const discussions: DiscussionData[] = await axios
				.get(apiConfig.apiEndpoint + "discussion/discussions", {
					params: {
						getUserId: authUser?.uid,
						getDiscussionType: discussionType,
						getPrivacy: privacy,
						getIsOpen: isOpen,
						getFromDate: lastDiscussion?.discussion.createdAt,
					},
				})
				.then((response) => response.data.discussions)
				.catch((error: any) => {
					throw new Error(
						`API (GET - Discussions): Getting Discussions Error: ${error.message}`
					);
				});

			if (discussions.length) {
				setDiscussionStateValue((prev) => ({
					...prev,
					discussions: [...prev.discussions, ...discussions],
				}));
			} else {
				console.log("Mongo: No Discussions Found!");
			}

			return discussions.length;
		} catch (error: any) {
			console.log("Mongo: Fetching Discussions Error: ", error.message);
		}
	};

	return {
		discussionStateValue,
		setDiscussionStateValue,
		discussionOptionsStateValue,
		setDiscussionOptionsStateValue,
		createDiscussion,
		fetchDiscussions,
		onDiscussionVote,
	};
};

export default useDiscussion;
