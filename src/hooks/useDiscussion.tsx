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

	const actionDeletedDiscussion = (
		discussionDeleted: boolean,
		discussionId: string
	) => {
		setDiscussionStateValue((prev) => ({
			...prev,
			discussions: prev.discussions.map((discussion) => {
				if (discussion.discussion.id === discussionId) {
					return {
						...discussion,
						discussionDeleted: discussionDeleted,
					};
				}

				return discussion;
			}),
			currentDiscussion:
				prev.currentDiscussion?.discussion.id === discussionId
					? {
							...prev.currentDiscussion,
							discussionDeleted: discussionDeleted,
					  }
					: prev.currentDiscussion,
		}));
	};

	/**
	 * *  ██████╗       ██████╗ ██╗███████╗ ██████╗██╗   ██╗███████╗███████╗██╗ ██████╗ ███╗   ██╗
	 * * ██╔════╝██╗    ██╔══██╗██║██╔════╝██╔════╝██║   ██║██╔════╝██╔════╝██║██╔═══██╗████╗  ██║
	 * * ██║     ╚═╝    ██║  ██║██║███████╗██║     ██║   ██║███████╗███████╗██║██║   ██║██╔██╗ ██║
	 * * ██║     ██╗    ██║  ██║██║╚════██║██║     ██║   ██║╚════██║╚════██║██║██║   ██║██║╚██╗██║
	 * * ╚██████╗╚═╝    ██████╔╝██║███████║╚██████╗╚██████╔╝███████║███████║██║╚██████╔╝██║ ╚████║
	 * *  ╚═════╝       ╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
	 */
	/**
	 *
	 *
	 * @param {CreateDiscussionType} discussionForm
	 */
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
				numberOfFirstLevelReplies: 0,
				updatedAt: discussionDate,
				createdAt: discussionDate,
			};

			if (discussionForm.groupId) {
				newDiscussion.groupId = discussionForm.groupId;
			}

			const newDiscussionData: SiteDiscussion = await axios
				.post(apiConfig.apiEndpoint + "/discussions/", {
					apiKey: userStateValue.api?.keys[0].key,
					discussionData: newDiscussion,
					creator: userStateValue.user,
				})
				.then((response) => response.data.newDiscussion)
				.catch((error: any) => {
					throw new Error(
						`=>API(Discussion): Discussion Creation Error:\n${error.message}`
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
					`=>API(Discussion): Discussion Creation Error:\nNo Data Returned!`
				);
			}
		} catch (error: any) {
			console.log(`=>Mongo: Creating Discussion Error:\n${error.message}`);
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
	 *
	 * @param {DiscussionData} discussionData
	 * @param {("upVote" | "downVote")} voteType
	 */
	const onDiscussionVote = async (
		discussionData: DiscussionData,
		voteType: "upVote" | "downVote"
	) => {
		try {
			if (discussionData.userVote) {
				const voteDate = new Date();

				const newDiscussionVote: Partial<DiscussionVote> = {
					userId: discussionData.userVote.userId,
					discussionId: discussionData.userVote.discussionId,
					voteValue: voteType === "upVote" ? 1 : -1,
					updatedAt: voteDate,
				};

				const isDeleteVote =
					(voteType === "upVote" && discussionData.userVote!.voteValue === 1) ||
					(voteType === "downVote" && discussionData.userVote!.voteValue === -1);

				if (isDeleteVote) {
					const { voteDeleted } = await axios
						.delete(apiConfig.apiEndpoint + "/discussions/votes/", {
							data: {
								apiKey: userStateValue.api?.keys[0].key,
								discussionId: discussionData.discussion.id,
								userId: userStateValue.user.uid,
							},
						})
						.then((response) => response.data)
						.catch((error: any) => {
							const { discussionDeleted } = error.response.data;

							if (discussionDeleted && !discussionData.discussionDeleted) {
								actionDeletedDiscussion(
									discussionDeleted,
									discussionData.discussion.id
								);
							}

							throw new Error(
								`=>API(Discussion): Discussion Vote Deletion Error:\n${error.message}`
							);
						});
				} else {
					const { voteChanged } = await axios
						.put(apiConfig.apiEndpoint + "/discussions/votes/", {
							apiKey: userStateValue.api?.keys[0].key,
							discussionVoteData: newDiscussionVote,
							voteType,
						})
						.then((response) => response.data)
						.catch((error: any) => {
							const { discussionDeleted } = error.response.data;

							if (discussionDeleted && !discussionData.discussionDeleted) {
								actionDeletedDiscussion(
									discussionDeleted,
									discussionData.discussion.id
								);
							}

							throw new Error(
								`=>API(Discussion): Discussion Vote Change Error:\n${error.message}`
							);
						});
				}

				setDiscussionStateValue(
					(prev) =>
						({
							...prev,
							discussions: prev.discussions.map((discussion) => {
								if (discussion.discussion.id === discussionData.discussion.id) {
									return {
										...discussion,
										discussion: {
											...discussion.discussion,
											numberOfVotes: isDeleteVote
												? discussion.discussion.numberOfVotes - 1
												: discussion.discussion.numberOfVotes,
											numberOfUpVotes: isDeleteVote
												? voteType === "upVote"
													? discussion.discussion.numberOfUpVotes - 1
													: discussion.discussion.numberOfUpVotes
												: voteType === "upVote"
												? discussion.discussion.numberOfUpVotes + 1
												: discussion.discussion.numberOfUpVotes - 1,
											numberOfDownVotes: isDeleteVote
												? voteType === "downVote"
													? discussion.discussion.numberOfDownVotes - 1
													: discussion.discussion.numberOfDownVotes
												: voteType === "downVote"
												? discussion.discussion.numberOfDownVotes + 1
												: discussion.discussion.numberOfDownVotes - 1,
											updatedAt: voteDate.toISOString(),
										},
										userVote: isDeleteVote ? null : newDiscussionVote,
									};
								}

								return discussion;
							}),
							currentDiscussion:
								prev.currentDiscussion?.discussion.id ===
								discussionData.discussion.id
									? {
											...prev.currentDiscussion,
											discussion: {
												...prev.currentDiscussion.discussion,
												numberOfVotes: isDeleteVote
													? prev.currentDiscussion.discussion.numberOfVotes - 1
													: prev.currentDiscussion.discussion.numberOfVotes,
												numberOfUpVotes: isDeleteVote
													? voteType === "upVote"
														? prev.currentDiscussion.discussion.numberOfUpVotes -
														  1
														: prev.currentDiscussion.discussion.numberOfUpVotes
													: voteType === "upVote"
													? prev.currentDiscussion.discussion.numberOfUpVotes + 1
													: prev.currentDiscussion.discussion.numberOfUpVotes -
													  1,
												numberOfDownVotes: isDeleteVote
													? voteType === "downVote"
														? prev.currentDiscussion.discussion
																.numberOfDownVotes - 1
														: prev.currentDiscussion.discussion.numberOfDownVotes
													: voteType === "downVote"
													? prev.currentDiscussion.discussion.numberOfDownVotes +
													  1
													: prev.currentDiscussion.discussion.numberOfDownVotes -
													  1,
												updatedAt: voteDate.toISOString(),
											},
											userVote: isDeleteVote ? null : newDiscussionVote,
									  }
									: prev.currentDiscussion,
						} as DiscussionState)
				);
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
					.post(apiConfig.apiEndpoint + "/discussions/votes/", {
						apiKey: userStateValue.api?.keys[0].key,
						discussionVoteData: newDiscussionVote,
						voteType,
					})
					.then((response) => response.data)
					.catch((error: any) => {
						const { discussionDeleted } = error.response.data;

						if (discussionDeleted && !discussionData.discussionDeleted) {
							actionDeletedDiscussion(
								discussionDeleted,
								discussionData.discussion.id
							);
						}

						throw new Error(
							`=>API(Discussion): Discussion Vote Error:\n${error.message}`
						);
					});

				if (voteSuccess) {
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
													voteType === "upVote"
														? discussion.discussion.numberOfUpVotes + 1
														: discussion.discussion.numberOfUpVotes,
												numberOfDownVotes:
													voteType === "downVote"
														? discussion.discussion.numberOfDownVotes + 1
														: discussion.discussion.numberOfDownVotes,
												updatedAt: voteDate.toISOString(),
											},
											userVote: newDiscussionVote,
										};
									}

									return discussion;
								}),
								currentDiscussion:
									prev.currentDiscussion?.discussion.id ===
									discussionData.discussion.id
										? {
												...prev.currentDiscussion,
												discussion: {
													...prev.currentDiscussion.discussion,
													numberOfVotes:
														prev.currentDiscussion.discussion.numberOfVotes + 1,
													numberOfUpVotes:
														voteType === "upVote"
															? prev.currentDiscussion.discussion
																	.numberOfUpVotes + 1
															: prev.currentDiscussion.discussion
																	.numberOfUpVotes,
													numberOfDownVotes:
														voteType === "downVote"
															? prev.currentDiscussion.discussion
																	.numberOfDownVotes + 1
															: prev.currentDiscussion.discussion
																	.numberOfDownVotes,
													updatedAt: voteDate.toISOString(),
												},
												userVote: newDiscussionVote,
										  }
										: prev.currentDiscussion,
							} as DiscussionState)
					);
				}
			}
		} catch (error: any) {
			console.log(`=>Mongo: Voting Discussion Error:\n${error.message}`);
		}
	};

	/**
	 * ^ ██████╗        ██████╗ ██╗███████╗ ██████╗██╗   ██╗███████╗███████╗██╗ ██████╗ ███╗   ██╗███████╗
	 * ^ ██╔══██╗██╗    ██╔══██╗██║██╔════╝██╔════╝██║   ██║██╔════╝██╔════╝██║██╔═══██╗████╗  ██║██╔════╝
	 * ^ ██████╔╝╚═╝    ██║  ██║██║███████╗██║     ██║   ██║███████╗███████╗██║██║   ██║██╔██╗ ██║███████╗
	 * ^ ██╔══██╗██╗    ██║  ██║██║╚════██║██║     ██║   ██║╚════██║╚════██║██║██║   ██║██║╚██╗██║╚════██║
	 * ^ ██║  ██║╚═╝    ██████╔╝██║███████║╚██████╗╚██████╔╝███████║███████║██║╚██████╔╝██║ ╚████║███████║
	 * ^ ╚═╝  ╚═╝       ╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
	 */
	/**
	 *
	 *
	 * @param {SiteDiscussion["discussionType"]} discussionType
	 * @param {SiteDiscussion["privacy"]} privacy
	 * @param {SiteDiscussion["isOpen"]} isOpen
	 * @return {*}
	 */
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
				.get(apiConfig.apiEndpoint + "/discussions/discussions", {
					params: {
						apiKey: userStateValue.api?.keys[0].key,
						userId: authUser?.uid,
						discussionType: discussionType,
						privacy: privacy,
						isOpen,
						fromDate:
							lastDiscussion?.discussion.createdAt || new Date().toISOString(),
					},
				})
				.then((response) => response.data.discussions)
				.catch((error: any) => {
					throw new Error(
						`=>API (GET - Discussions): Getting Discussions Error:\n${error.message}`
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
			console.log(`=>Mongo: Fetching Discussions Error:\n${error.message}`);
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
	 * @param {SiteDiscussion} discussion
	 * @return {*}
	 */
	const fetchUserVote = async (discussion: SiteDiscussion) => {
		try {
			if (authUser) {
				const { userVote }: { userVote: DiscussionVote | null } = await axios
					.get(apiConfig.apiEndpoint + "/discussions/votes/", {
						params: {
							apiKey: userStateValue.api?.keys[0].key,
							userId: authUser.uid,
							discussionId: discussion.id,
						},
					})
					.then((response) => response.data)
					.catch((error: any) => {
						throw new Error(
							`=>API (GET - User Vote): Getting User Vote Error:\n${error.message}`
						);
					});

				if (userVote) {
					return userVote;
				} else {
					return null;
				}
			} else {
				throw new Error("User not logged in!");
			}
		} catch (error: any) {
			console.log(
				`=>Mongo: Fetching Discussion User Vote Error:\n${error.message}`
			);
			return null;
		}
	};

	/**
	 * ! ██████╗        ██████╗ ██╗███████╗ ██████╗██╗   ██╗███████╗███████╗██╗ ██████╗ ███╗   ██╗
	 * ! ██╔══██╗██╗    ██╔══██╗██║██╔════╝██╔════╝██║   ██║██╔════╝██╔════╝██║██╔═══██╗████╗  ██║
	 * ! ██║  ██║╚═╝    ██║  ██║██║███████╗██║     ██║   ██║███████╗███████╗██║██║   ██║██╔██╗ ██║
	 * ! ██║  ██║██╗    ██║  ██║██║╚════██║██║     ██║   ██║╚════██║╚════██║██║██║   ██║██║╚██╗██║
	 * ! ██████╔╝╚═╝    ██████╔╝██║███████║╚██████╗╚██████╔╝███████║███████║██║╚██████╔╝██║ ╚████║
	 * ! ╚═════╝        ╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
	 */
	/**
	 *
	 *
	 * @param {DiscussionData} discussionData
	 */
	const deleteDiscussion = async (discussionData: DiscussionData) => {
		try {
			if (userStateValue.user.uid !== discussionData.discussion.creatorId) {
				if (!userStateValue.user.roles.includes("admin")) {
					throw new Error(
						"Permission: You are not authorized to delete this discussion!"
					);
				}
			}

			const { isDeleted } = await axios
				.delete(apiConfig.apiEndpoint + "/discussions/", {
					data: {
						apiKey: userStateValue.api?.keys[0].key,
						discussionData: discussionData.discussion,
					},
				})
				.then((response) => response.data)
				.catch((error) => {
					throw new Error(
						`API (DELETE - Discussion): Deleting Discussion Error: ${error.message}`
					);
				});

			if (isDeleted) {
				setDiscussionStateValue((prev) => ({
					...prev,
					discussions: prev.discussions.filter(
						(discussion) =>
							discussion.discussion.id !== discussionData.discussion.id
					),
					currentDiscussion:
						prev.currentDiscussion?.discussion.id ===
						discussionData.discussion.id
							? null
							: prev.currentDiscussion,
				}));
			}
		} catch (error: any) {
			console.log(`=>Mongo: Deleting Discussion Error:\n${error.message}`);
		}
	};

	return {
		/**
		 *
		 */
		discussionStateValue,
		setDiscussionStateValue,
		/**
		 *
		 */
		discussionOptionsStateValue,
		setDiscussionOptionsStateValue,
		/**
		 *
		 */
		createDiscussion,
		fetchDiscussions,
		deleteDiscussion,
		/**
		 *
		 */
		onDiscussionVote,
		fetchUserVote,
		/**
		 * Actions
		 */
		actionDeletedDiscussion,
	};
};

export default useDiscussion;
