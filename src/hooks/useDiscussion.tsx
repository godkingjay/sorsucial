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
import {
	APIEndpointDiscussionsParams,
	QueryDiscussionsSortBy,
} from "@/lib/types/api";
import useGroup from "./useGroup";

const useDiscussion = () => {
	const [discussionStateValue, setDiscussionStateValue] =
		useRecoilState(discussionState);

	const [discussionOptionsStateValue, setDiscussionOptionsStateValue] =
		useRecoilState(discussionOptionsState);

	const { authUser, userStateValue } = useUser();

	const { groupStateValue, setGroupStateValue } = useGroup();

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

			function createDiscussionIndex() {
				const index = {
					newest: 0,
					["latest" +
					(newDiscussionData.discussionType
						? `-${newDiscussionData.discussionType}`
						: "") +
					(newDiscussionData.privacy ? `-${newDiscussionData.privacy}` : "") +
					(newDiscussionData.groupId ? `-${newDiscussionData.groupId}` : "")]: 0,
					["latest" +
					(newDiscussionData.discussionType
						? `-${newDiscussionData.discussionType}`
						: "") +
					(newDiscussionData.privacy ? `-${newDiscussionData.privacy}` : "") +
					(newDiscussionData.groupId ? `-${newDiscussionData.groupId}` : "") +
					(newDiscussionData.creatorId
						? `-${newDiscussionData.creatorId}`
						: "")]: 0,
				};
				return index;
			}

			if (newDiscussionData) {
				setDiscussionStateValue(
					(prev) =>
						({
							...prev,
							discussions: [
								{
									discussion: newDiscussionData,
									creator: userStateValue.user,
									index: createDiscussionIndex(),
								},
								...prev.discussions,
							],
						} as DiscussionState)
				);

				if (newDiscussion.groupId) {
					setGroupStateValue((prev) => ({
						...prev,
						groups: prev.groups.map((group) => {
							if (group.group.id === newDiscussion.groupId) {
								return {
									...group,
									group: {
										...group.group,
										numberOfDiscussions: group.group.numberOfDiscussions + 1,
									},
								};
							}

							return group;
						}),
						currentGroup:
							prev.currentGroup &&
							prev.currentGroup?.group.id === newDiscussion.groupId
								? {
										...prev.currentGroup,
										group: {
											...prev.currentGroup.group,
											numberOfPosts: prev.currentGroup.group.numberOfPosts + 1,
										},
								  }
								: prev.currentGroup,
					}));
				}
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
			const prevDiscussionVote = discussionData?.userVote;

			const voteDate = new Date();

			const isDeleteVote =
				(voteType === "upVote" && prevDiscussionVote?.voteValue === 1) ||
				(voteType === "downVote" && prevDiscussionVote?.voteValue === -1);

			const newDiscussionVote: Partial<DiscussionVote> = prevDiscussionVote
				? {
						userId: prevDiscussionVote.userId,
						discussionId: prevDiscussionVote.discussionId,
						voteValue: voteType === "upVote" ? 1 : -1,
						updatedAt: voteDate,
				  }
				: {
						userId: userStateValue.user.uid,
						discussionId: discussionData.discussion.id,
						voteValue: voteType === "upVote" ? 1 : -1,
						createdAt: voteDate,
						updatedAt: voteDate,
				  };

			if (discussionData.discussion.groupId) {
				newDiscussionVote.groupId = discussionData.discussion.groupId;
			}

			setDiscussionStateValue(
				(prev) =>
					({
						...prev,
						discussions: prev.discussions.map((discussion) => {
							if (discussion.discussion.id !== discussionData.discussion.id) {
								return discussion;
							}

							const { numberOfVotes, numberOfUpVotes, numberOfDownVotes } =
								discussion.discussion;

							const { createdAt } = discussion.userVote ?? newDiscussionVote;

							return {
								...discussion,
								discussion: {
									...discussion.discussion,
									numberOfVotes: isDeleteVote
										? prevDiscussionVote
											? numberOfVotes - 1
											: numberOfVotes
										: !prevDiscussionVote
										? numberOfVotes + 1
										: numberOfVotes,
									numberOfUpVotes: isDeleteVote
										? voteType === "upVote"
											? numberOfUpVotes - 1
											: numberOfUpVotes
										: !prevDiscussionVote
										? voteType === "upVote"
											? numberOfUpVotes + 1
											: numberOfUpVotes
										: voteType === "upVote"
										? numberOfUpVotes + 1
										: numberOfUpVotes - 1,
									numberOfDownVotes: isDeleteVote
										? voteType === "downVote"
											? numberOfDownVotes - 1
											: numberOfDownVotes
										: !prevDiscussionVote
										? voteType === "downVote"
											? numberOfDownVotes + 1
											: numberOfDownVotes
										: voteType === "downVote"
										? numberOfDownVotes + 1
										: numberOfDownVotes - 1,
									updatedAt: voteDate.toISOString(),
								},
								userVote:
									isDeleteVote && prevDiscussionVote
										? null
										: {
												...newDiscussionVote,
												updatedAt: voteDate.toISOString(),
												createdAt:
													typeof createdAt === "string"
														? createdAt
														: createdAt!.toISOString(),
										  },
							};
						}),
						currentDiscussion:
							prev.currentDiscussion?.discussion.id ===
							discussionData.discussion.id
								? {
										...prev.currentDiscussion,
										discussion: {
											...prev.currentDiscussion.discussion,
											numberOfVotes: isDeleteVote
												? prevDiscussionVote
													? prev.currentDiscussion.discussion.numberOfVotes - 1
													: prev.currentDiscussion.discussion.numberOfVotes
												: !prevDiscussionVote
												? prev.currentDiscussion.discussion.numberOfVotes + 1
												: prev.currentDiscussion.discussion.numberOfVotes,
											numberOfUpVotes: isDeleteVote
												? voteType === "upVote"
													? prev.currentDiscussion.discussion.numberOfUpVotes - 1
													: prev.currentDiscussion.discussion.numberOfUpVotes
												: !prevDiscussionVote
												? voteType === "upVote"
													? prev.currentDiscussion.discussion.numberOfUpVotes + 1
													: prev.currentDiscussion.discussion.numberOfUpVotes
												: voteType === "upVote"
												? prev.currentDiscussion.discussion.numberOfUpVotes + 1
												: prev.currentDiscussion.discussion.numberOfUpVotes - 1,
											numberOfDownVotes: isDeleteVote
												? voteType === "downVote"
													? prev.currentDiscussion.discussion.numberOfDownVotes -
													  1
													: prev.currentDiscussion.discussion.numberOfDownVotes
												: !prevDiscussionVote
												? voteType === "downVote"
													? prev.currentDiscussion.discussion.numberOfDownVotes +
													  1
													: prev.currentDiscussion.discussion.numberOfDownVotes
												: voteType === "downVote"
												? prev.currentDiscussion.discussion.numberOfDownVotes + 1
												: prev.currentDiscussion.discussion.numberOfDownVotes -
												  1,
											updatedAt: voteDate.toISOString(),
										},
										userVote:
											isDeleteVote && prevDiscussionVote
												? null
												: {
														...newDiscussionVote,
														updatedAt: voteDate.toISOString(),
														createdAt: prev.currentDiscussion.userVote?.createdAt
															? prev.currentDiscussion.userVote.createdAt
															: newDiscussionVote.createdAt?.toISOString(),
												  },
								  }
								: prev.currentDiscussion,
					} as DiscussionState)
			);

			const resetUserVote = () => {
				setDiscussionStateValue((prev) => ({
					...prev,
					discussions: prev.discussions.map((discussion) => {
						if (discussion.discussion.id !== discussionData.discussion.id) {
							return discussion;
						}

						return {
							...discussion,
							discussion: discussionData.discussion,
							userVote: prevDiscussionVote,
						};
					}),
					currentDiscussion:
						prev.currentDiscussion?.discussion.id ===
						discussionData.discussion.id
							? {
									...prev.currentDiscussion,
									discussion: discussionData.discussion,
									userVote: prevDiscussionVote,
							  }
							: prev.currentDiscussion,
				}));
			};

			if (discussionData.userVote) {
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

							resetUserVote();

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

							resetUserVote();

							throw new Error(
								`=>API(Discussion): Discussion Vote Change Error:\n${error.message}`
							);
						});
				}

				// setDiscussionStateValue(
				// 	(prev) =>
				// 		({
				// 			...prev,
				// 			discussions: prev.discussions.map((discussion) => {
				// 				if (discussion.discussion.id === discussionData.discussion.id) {
				// 					return {
				// 						...discussion,
				// 						discussion: {
				// 							...discussion.discussion,
				// 							numberOfVotes: isDeleteVote
				// 								? discussion.discussion.numberOfVotes - 1
				// 								: discussion.discussion.numberOfVotes,
				// 							numberOfUpVotes: isDeleteVote
				// 								? voteType === "upVote"
				// 									? discussion.discussion.numberOfUpVotes - 1
				// 									: discussion.discussion.numberOfUpVotes
				// 								: voteType === "upVote"
				// 									? discussion.discussion.numberOfUpVotes + 1
				// 									: discussion.discussion.numberOfUpVotes - 1,
				// 							numberOfDownVotes: isDeleteVote
				// 								? voteType === "downVote"
				// 									? discussion.discussion.numberOfDownVotes - 1
				// 									: discussion.discussion.numberOfDownVotes
				// 								: voteType === "downVote"
				// 								? discussion.discussion.numberOfDownVotes + 1
				// 								: discussion.discussion.numberOfDownVotes - 1,
				// 							updatedAt: voteDate.toISOString(),
				// 						},
				// 						userVote: isDeleteVote ? null : newDiscussionVote,
				// 					};
				// 				}
				// 				return discussion;
				// 			}),
				// 			currentDiscussion:
				// 				prev.currentDiscussion?.discussion.id ===
				// 				discussionData.discussion.id
				// 					? {
				// 							...prev.currentDiscussion,
				// 							discussion: {
				// 								...prev.currentDiscussion.discussion,
				// 								numberOfVotes: isDeleteVote
				// 									? prev.currentDiscussion.discussion.numberOfVotes - 1
				// 									: prev.currentDiscussion.discussion.numberOfVotes,
				// 								numberOfUpVotes: isDeleteVote
				// 									? voteType === "upVote"
				// 										? prev.currentDiscussion.discussion.numberOfUpVotes -
				// 										  1
				// 										: prev.currentDiscussion.discussion.numberOfUpVotes
				// 									: voteType === "upVote"
				// 									? prev.currentDiscussion.discussion.numberOfUpVotes + 1
				// 									: prev.currentDiscussion.discussion.numberOfUpVotes -
				// 									  1,
				// 								numberOfDownVotes: isDeleteVote
				// 									? voteType === "downVote"
				// 										? prev.currentDiscussion.discussion
				// 												.numberOfDownVotes - 1
				// 										: prev.currentDiscussion.discussion.numberOfDownVotes
				// 									: voteType === "downVote"
				// 									? prev.currentDiscussion.discussion.numberOfDownVotes +
				// 									  1
				// 									: prev.currentDiscussion.discussion.numberOfDownVotes -
				// 									  1,
				// 								updatedAt: voteDate.toISOString(),
				// 							},
				// 							userVote: isDeleteVote ? null : newDiscussionVote,
				// 					  }
				// 					: prev.currentDiscussion,
				// 		} as DiscussionState)
				// );
			} else {
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

						resetUserVote();

						throw new Error(
							`=>API(Discussion): Discussion Vote Error:\n${error.message}`
						);
					});

				// if (voteSuccess) {
				// 	setDiscussionStateValue(
				// 		(prev) =>
				// 			({
				// 				...prev,
				// 				discussions: prev.discussions.map((discussion) => {
				// 					if (
				// 						discussion.discussion.id === discussionData.discussion.id
				// 					) {
				// 						return {
				// 							...discussion,
				// 							discussion: {
				// 								...discussion.discussion,
				// 								numberOfVotes: discussion.discussion.numberOfVotes + 1,
				// 								numberOfUpVotes:
				// 									voteType === "upVote"
				// 										? discussion.discussion.numberOfUpVotes + 1
				// 										: discussion.discussion.numberOfUpVotes,
				// 								numberOfDownVotes:
				// 									voteType === "downVote"
				// 										? discussion.discussion.numberOfDownVotes + 1
				// 										: discussion.discussion.numberOfDownVotes,
				// 								updatedAt: voteDate.toISOString(),
				// 							},
				// 							userVote: newDiscussionVote,
				// 						};
				// 					}
				// 					return discussion;
				// 				}),
				// 				currentDiscussion:
				// 					prev.currentDiscussion?.discussion.id ===
				// 					discussionData.discussion.id
				// 						? {
				// 								...prev.currentDiscussion,
				// 								discussion: {
				// 									...prev.currentDiscussion.discussion,
				// 									numberOfVotes:
				// 										prev.currentDiscussion.discussion.numberOfVotes + 1,
				// 									numberOfUpVotes:
				// 										voteType === "upVote"
				// 											? prev.currentDiscussion.discussion
				// 													.numberOfUpVotes + 1
				// 											: prev.currentDiscussion.discussion
				// 													.numberOfUpVotes,
				// 									numberOfDownVotes:
				// 										voteType === "downVote"
				// 											? prev.currentDiscussion.discussion
				// 													.numberOfDownVotes + 1
				// 											: prev.currentDiscussion.discussion
				// 													.numberOfDownVotes,
				// 									updatedAt: voteDate.toISOString(),
				// 								},
				// 								userVote: newDiscussionVote,
				// 						  }
				// 						: prev.currentDiscussion,
				// 			} as DiscussionState)
				// 	);
				// }
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
	const fetchDiscussions = async ({
		discussionType = "discussion" as SiteDiscussion["discussionType"],
		privacy = "public" as SiteDiscussion["privacy"],
		groupId = undefined as string | undefined,
		creatorId = undefined as string | undefined,
		creator = undefined as string | undefined,
		tags = undefined as string | undefined,
		isOpen = undefined as undefined | boolean,
		sortBy = "latest" as QueryDiscussionsSortBy,
	}) => {
		try {
			let refDiscussion;
			let refIndex;
			const sortByIndex =
				sortBy +
				(discussionType ? `-${discussionType}` : "") +
				(privacy ? `-${privacy}` : "") +
				(groupId ? `-${groupId}` : "") +
				(creatorId ? `-${creatorId}` : "") +
				(creator ? `-${creator}` : "") +
				(tags ? `-${tags}` : "") +
				(isOpen !== undefined ? `-${isOpen ? "open" : "close"}` : "");

			switch (sortBy) {
				case "latest": {
					refIndex = discussionStateValue.discussions.reduceRight(
						(acc, discussion, index) => {
							if (discussion?.index[sortByIndex] && acc === -1) {
								return index;
							}

							return acc;
						},
						-1
					);

					refDiscussion = discussionStateValue.discussions[refIndex] || null;
					break;
				}

				default: {
					refDiscussion = null;
					break;
				}
			}

			const {
				discussions,
			}: {
				discussions: DiscussionData[];
			} = await axios
				.get(apiConfig.apiEndpoint + "/discussions/discussions", {
					params: {
						apiKey: userStateValue.api?.keys[0].key,
						userId: authUser?.uid,
						discussionType: discussionType,
						privacy: privacy,
						groupId: groupId,
						tags: tags,
						creatorId: creatorId,
						creator: creator,
						isOpen,
						lastIndex: refDiscussion ? refDiscussion?.index[sortBy] : -1,
						fromVotes: refDiscussion
							? refDiscussion?.discussion.numberOfVotes + 1
							: Number.MAX_SAFE_INTEGER,
						fromUpVotes: refDiscussion
							? refDiscussion?.discussion.numberOfUpVotes + 1
							: Number.MAX_SAFE_INTEGER,
						fromDownVotes: refDiscussion
							? refDiscussion?.discussion.numberOfDownVotes + 1
							: Number.MAX_SAFE_INTEGER,
						fromReplies: refDiscussion
							? refDiscussion?.discussion.numberOfReplies + 1
							: Number.MAX_SAFE_INTEGER,
						fromDate: refDiscussion
							? refDiscussion?.discussion.createdAt
							: new Date().toISOString(),
					} as Partial<APIEndpointDiscussionsParams>,
				})
				.then((response) => response.data)
				.catch((error: any) => {
					throw new Error(
						`=>API (GET - Discussions): Getting Discussions Error:\n${error.message}`
					);
				});

			if (discussions.length) {
				setDiscussionStateValue((prev) => ({
					...prev,
					discussions: prev.discussions
						.map((discussion) => {
							const discussionIndex = discussions.findIndex(
								(discussionData) =>
									discussionData.discussion.id === discussion.discussion.id
							);

							const existingDiscussion =
								discussionIndex !== -1 ? discussions[discussionIndex] : null;

							if (existingDiscussion) {
								discussions.splice(discussionIndex, 1);

								const indices = {
									...discussion.index,
									...existingDiscussion.index,
								};

								return {
									...discussion,
									...existingDiscussion,
									index: indices,
								};
							} else {
								return discussion;
							}
						})
						.concat(discussions),
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

				if (discussionData.discussion.groupId) {
					setGroupStateValue((prev) => ({
						...prev,
						groups: prev.groups.map((group) => {
							if (group.group.id === discussionData.discussion.groupId) {
								return {
									...group,
									group: {
										...group.group,
										numberOfDiscussions: group.group.numberOfDiscussions - 1,
									},
								};
							}

							return group;
						}),
						currentGroup:
							prev.currentGroup &&
							prev.currentGroup?.group.id === discussionData.discussion.groupId
								? {
										...prev.currentGroup,
										group: {
											...prev.currentGroup.group,
											numberOfPosts: prev.currentGroup.group.numberOfPosts - 1,
										},
								  }
								: prev.currentGroup,
					}));
				}
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
