import {
	GroupData,
	GroupMemberData,
	GroupState,
	groupState,
} from "@/atoms/groupAtom";
import { CreateGroupType } from "@/components/Modal/GroupCreationModal";
import React, { useCallback, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import useUser from "./useUser";
import { GroupImage, GroupMember, SiteGroup } from "@/lib/interfaces/group";
import { collection, doc } from "firebase/firestore";
import axios from "axios";
import { apiConfig } from "@/lib/api/apiConfig";
import { clientDb, clientStorage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
	APIEndpointGroupsParams,
	APIEndpointGroupMembersGroupParams,
	QueryGroupMembersSortBy,
	QueryGroupsSortBy,
} from "@/lib/types/api";

const useGroup = () => {
	const { authUser, userStateValue } = useUser();

	const [groupStateValue, setGroupStateValue] = useRecoilState(groupState);

	const [fetchingGroupsFor, setFetchingGroupsFor] = useState("");

	const [fetchingGroupMembersFor, setFetchingGroupMembersFor] = useState("");

	const groupStateValueMemo = useMemo(() => groupStateValue, [groupStateValue]);

	const setGroupStateValueMemo = useMemo(
		() => setGroupStateValue,
		[setGroupStateValue]
	);

	const actionGroupDeleted = useCallback(
		(groupDeleted: boolean, groupId: string) => {
			setGroupStateValueMemo((prev) => ({
				...prev,
				groups: prev.groups.map((group) => {
					if (group.group.id === groupId) {
						return {
							...group,
							groupDeleted,
						};
					}

					return group;
				}),
				currentGroup:
					prev.currentGroup?.group.id === groupId
						? {
								...prev.currentGroup,
								groupDeleted,
						  }
						: prev.currentGroup,
			}));
		},
		[]
	);

	const createGroup = useCallback(
		async (group: CreateGroupType) => {
			try {
				const groupDate = new Date();

				const newGroup: Partial<SiteGroup> = {
					name: group.name,
					description: group.description,
					groupTags: group.groupTags,
					privacy: group.privacy,
					creatorId: authUser?.uid,
					numberOfMembers: 1,
					numberOfPosts: 0,
					numberOfDiscussions: 0,
					updatedAt: groupDate,
					createdAt: groupDate,
				};

				const {
					groupData,
					groupMemberData,
				}: { groupData: SiteGroup; groupMemberData: GroupMember } = await axios
					.post(apiConfig.apiEndpoint + "/groups/", {
						apiKey: userStateValue.api?.keys[0].key,
						groupData: newGroup,
					})
					.then((response) => response.data)
					.catch((error) => {
						throw new Error(`=>API: Group Creation Error:\n${error.message}`);
					});

				if (groupData) {
					if (group.image) {
						const groupImageRef = doc(
							collection(clientDb, `groups/${groupData.id}/images`)
						);

						const groupImage = await uploadGroupImage(
							groupData,
							group.image,
							groupImageRef.id,
							"image"
						).catch((error) => {
							throw new Error(
								`=>Hook: Group Image Upload Error:\n${error.message}`
							);
						});

						if (groupImage) {
							groupData.image = groupImage;
						}
					}

					function createGroupIndex() {
						const index = {
							newest: 0,
							["latest" + (groupData.privacy ? `-${groupData.privacy}` : "")]: 0,
							["latest" +
							(groupData.privacy ? `-${groupData.privacy}` : "") +
							(groupData.creatorId ? `-${groupData.creatorId}` : "")]: 0,
						};
						return index;
					}

					setGroupStateValueMemo(
						(prev) =>
							({
								...prev,
								groups: [
									{
										group: groupData,
										creator: userStateValue.user,
										userJoin: groupMemberData,
										index: createGroupIndex(),
									},
									...prev.groups,
								],
							} as GroupState)
					);
				}
			} catch (error: any) {
				console.log(`=>Mongo: Create Group Error:\n${error.message}`);
			}
		},
		[groupStateValueMemo]
	);

	const uploadGroupImage = useCallback(
		async (
			group: SiteGroup,
			image: CreateGroupType["image"],
			imageId: string,
			type: GroupImage["type"]
		) => {
			/**
			 * Try to upload the image to the storage.
			 * If there is an error, then log the error.
			 */
			try {
				/**
				 * The storageRef is the reference to the image in the storage.
				 *
				 * The image will be stored in the storage in the following path:
				 *
				 * https://storage
				 * 	      	/groups
				 * 	      		/groupId
				 * 	      			/images
				 * 	      				/imageId
				 *
				 */
				const storageRef = ref(
					clientStorage,
					`groups/${group.id}/images/${imageId}`
				);

				/**
				 * Fetch the image from the url.
				 */
				const response = await fetch(image?.url as string);

				/**
				 * Convert the image to a blob.
				 */
				const blob = await response.blob();

				/**
				 * After fetching the image from the url,
				 * then upload the image to the storage.
				 *
				 * The uploadBytes function is used to upload the image to the storage.
				 *
				 * The image will be uploaded to the storage in the following path:
				 *
				 * https://storage
				 * 	      	/groups
				 * 	      		/groupId
				 * 	      			/images
				 * 	      				/imageId
				 *
				 * If there is an error, then log the error.
				 */
				await uploadBytes(storageRef, blob).catch((error: any) => {
					throw new Error(
						"=>Firebase Storage: Image Upload Error:\n" + error.message
					);
				});

				/**
				 * After uploading the image to the storage,
				 * then get the download url of the image.
				 * The url will be used to display the image of the group.
				 *
				 * If there is an error, then log the error.
				 */
				const downloadURL = await getDownloadURL(storageRef).catch(
					(error: any) => {
						throw new Error(
							`=>Firebase Storage: Image  Download URL Error:\n${error.message}`
						);
					}
				);

				/**
				 * After getting the download url of the image,
				 * then add the image details to the database.
				 */
				const date = new Date();

				/**
				 * The newPostImageOrVideo is the image to be added.
				 *
				 * The image will be stored in the database in the following path:
				 *
				 * https://
				 * 		database
				 * 			/groups
				 * 				/groupId
				 * 					/images
				 * 						/imageId
				 *
				 */
				const newGroupImage: GroupImage = {
					id: imageId,
					groupId: group.id,
					uploadedBy: userStateValue.user.uid,
					height: image!.height,
					width: image!.width,
					type: type,
					fileName: image!.name,
					fileType: image!.type,
					filePath: storageRef.fullPath,
					fileURL: downloadURL,
					fileExtension: image!.name.split(".").pop() as string,
					fileSize: image!.size,
					updatedAt: date,
					createdAt: date,
				};

				const { groupImageData } = await axios
					.post(apiConfig.apiEndpoint + "/groups/images/", {
						apiKey: userStateValue.api?.keys[0].key,
						type: "image" as GroupImage["type"],
						groupImageData: newGroupImage,
					})
					.then((response) => response.data)
					.catch((error) => {
						throw new Error(
							`=>API: Group Image Creation Error:\n${error.message}`
						);
					});

				/**
				 * After successfully uploading the image to the storage and creating the image details,
				 * return the image details.
				 */
				return groupImageData || null;
			} catch (error: any) {
				console.log("=>Firebase: Uploading Image Error:\n", error.message);
			}

			return null;
		},
		[groupStateValueMemo]
	);

	/**
	 * This code is defining a function called `onJoinGroup` using the `useCallback` hook in a
	 * TypeScript React component. The function takes in a `groupData` object of type `GroupData` as an
	 * argument. The function then makes an API call to either delete the user from the group or add the
	 * user to the group depending on whether the user has already joined the group or not. If the user is
	 * deleted from the group, the function updates the `groupStateValueMemo` state to reflect the change
	 * in the number of members in the group. If the user is added to the group, the function updates the
	 * `groupStateValueMemo` state to reflect the change in the number of members in the group. If there is
	 * an error, then the function logs the error.
	 *
	 * @param {GroupData} groupData The group data.
	 *
	 * @returns {Promise<void>} The promise that resolves when the function finishes executing.
	 *
	 * @see {@link GroupData}
	 * @see {@link groupStateValueMemo}
	 * @see {@link https://reactjs.org/docs/hooks-reference.html#usecallback | React useCallback Hook}
	 */
	const onJoinGroup = useCallback(
		async (groupData: GroupData) => {
			try {
				/**
				 * The date is the current date and time.
				 * The date will be used to update the `updatedAt` property of the group.
				 */
				const date = new Date();

				/**
				 * This is a conditional block that handles the logic for a user joining or leaving a
				 * group. If the user is already a member of the group, the code sends a DELETE request to the API
				 * to remove the user from the group. If the user is not a member of the group, the code sends a
				 * POST request to the API to add the user to the group. The code also updates the state of the
				 * group and the user's membership status accordingly.
				 */
				if (groupData.userJoin !== null) {
					/**
					 * If the user is already a member of the group, then delete the user from the group.
					 * The code sends a DELETE request to the API to remove the user from the group.
					 * If there is an error, then log the error.
					 *
					 * The code also updates the state of the group and the user's membership status accordingly.
					 */

					/**
					 * This code is making an HTTP DELETE request to the specified API endpoint to delete a
					 * member from a group. It is passing the necessary data in the request body, including the API
					 * key, group ID, and user ID. The response data is then returned if the request is successful,
					 * and an error is thrown if there is an error in the request. The response data includes two
					 * properties, `isDeleted` which is a boolean indicating whether the member was successfully
					 * deleted, and `leaveStatus` which is a string indicating whether the member left the group or
					 * the pending request was cancelled.
					 *
					 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE | MDN DELETE Method}
					 */
					const {
						isDeleted,
						leaveStatus,
					}: {
						isDeleted: boolean;
						leaveStatus: "cancel" | "leave";
					} = await axios
						.delete(apiConfig.apiEndpoint + "/groups/members/", {
							data: {
								apiKey: userStateValue.api?.keys[0].key,
								groupId: groupData.group.id,
								userId: userStateValue.user.uid,
							},
						})
						.then((response) => response.data)
						.catch((error) => {
							const { groupDeleted } = error.response.data;

							if (groupDeleted && !groupData.groupDeleted) {
								actionGroupDeleted(groupDeleted, groupData.group.id);
							}

							throw new Error(
								`=>API: Group Member Deletion Error:\n${error.message}`
							);
						});

					if (isDeleted) {
						/**
						 * This code is updating the state of a group in a React component based on whether a user
						 * has left the group or not. It is updating the number of members in the group and the last
						 * updated time stamp. It is also setting the userJoin property to null for the group and the
						 * currentGroup if the user has left the current group. The code is using the
						 * setGroupStateValueMemo function to update the state in a memoized way.
						 */
						setGroupStateValueMemo(
							(prev) =>
								({
									...prev,
									groups: prev.groups.map((group) => {
										if (group.group.id === groupData.group.id) {
											return {
												...group,
												group: {
													...group.group,
													numberOfMembers:
														leaveStatus === "leave"
															? group.group.numberOfMembers - 1
															: group.group.numberOfMembers,
													updatedAt: date.toISOString(),
												},
												userJoin: null,
											};
										}

										return group;
									}),
									currentGroup:
										groupData.group.id === prev.currentGroup?.group.id
											? {
													...prev.currentGroup,
													group: {
														...prev.currentGroup?.group,
														numberOfMembers:
															leaveStatus === "leave"
																? prev.currentGroup?.group.numberOfMembers - 1
																: prev.currentGroup?.group.numberOfMembers,
														updatedAt: date.toISOString(),
													},
													userJoin: null,
											  }
											: prev.currentGroup,
								} as GroupState)
						);
					}
				} else {
					/**
					 * If the user is not a member of the group, then add the user to the group.
					 * The code sends a POST request to the API to add the user to the group.
					 * If there is an error, then log the error.
					 *
					 * The code also updates the state of the group and the user's membership status accordingly.
					 */

					/**
					 * This code is creating a new object of type `Partial<GroupMember>` with some properties
					 * assigned values. The `userId` property is assigned the value of `userStateValue.user.uid`, the
					 * `groupId` property is assigned the value of `groupData.group.id`, the `roles` property is
					 * assigned an array of strings based on the `privacy` property of `groupData.group`, the
					 * `updatedAt` property is assigned the value of `date`, the `acceptedAt` property is assigned the
					 * value of `date` if the `privacy` property of `groupData.group` is "public or undefined, and the
					 * `requestedAt` property is assigned the value of `date`.
					 *
					 * @see {@link https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype | TypeScript Partial<Type> Utility Type}
					 */
					const newGroupMember: Partial<GroupMember> = {
						userId: userStateValue.user.uid,
						groupId: groupData.group.id,
						roles:
							groupData.group.privacy === "public" ? ["member"] : ["pending"],
						updatedAt: date,
						acceptedAt: groupData.group.privacy === "public" ? date : undefined,
						requestedAt: date,
					};

					/**
					 * The code is checking if the current user is the creator of a group. If the user is the creator,
					 * then a new group member is being created with roles set to "owner", "admin", "moderator", and
					 * "member", and the acceptedAt property is being set to the current date.
					 */
					if (groupData.group.creatorId === userStateValue.user.uid) {
						newGroupMember.roles = ["owner", "admin", "moderator", "member"];
						newGroupMember.acceptedAt = date;
					}

					/**
					 * This code is making a POST request to an API endpoint to create a new group member. It is
					 * sending an API key and the data for the new group member as the request payload. The response
					 * from the API is then assigned to the variables `groupMemberData` and `joinStatus`. If there is
					 * an error in the API request, an error message is thrown.
					 *
					 * @param {string} apiConfig.apiEndpoint - The API endpoint to send the request to.
					 * @param {string} userStateValue.api?.keys[0].key - The API key to send with the request.
					 * @param {Partial<GroupMember>} newGroupMember - The data for the new group member to send with the request.
					 *
					 * @returns {Promise<{ groupMemberData: GroupMember; joinStatus: "accepted" | "added" }>} The response from the API.
					 *
					 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST | MDN POST Method}
					 */
					const {
						groupMemberData,
						joinStatus,
					}: { groupMemberData: GroupMember; joinStatus: "accepted" | "added" } =
						await axios
							.post(apiConfig.apiEndpoint + "/groups/members/", {
								apiKey: userStateValue.api?.keys[0].key,
								groupMemberData: newGroupMember,
							})
							.then((response) => response.data)
							.catch((error) => {
								const { groupDeleted } = error.response.data;

								if (groupDeleted && !groupData.groupDeleted) {
									actionGroupDeleted(groupDeleted, groupData.group.id);
								}

								throw new Error(
									`=>API: Group Member Creation Error:\n${error.message}`
								);
							});

					/**
					 * This code is updating the state of a group and its members based on a join status. It is
					 * checking if the group ID matches the current group and updating the number of members
					 * accordingly. It is also updating the userJoin property with newGroupMember. The code
					 * is using the setGroupStateValueMemo function to update the state of the group.
					 * This function is a memoized version of the setGroupStateValue function.
					 */
					if (groupMemberData) {
						setGroupStateValueMemo(
							(prev) =>
								({
									...prev,
									groups: prev.groups.map((group) => {
										if (group.group.id === groupData.group.id) {
											return {
												...group,
												group: {
													...group.group,
													numberOfMembers:
														joinStatus === "added"
															? group.group.numberOfMembers + 1
															: group.group.numberOfMembers,
												},
												userJoin: newGroupMember,
											};
										}

										return group;
									}),
									currentGroup:
										groupData.group.id === prev.currentGroup?.group.id
											? {
													...prev.currentGroup,
													group: {
														...prev.currentGroup?.group,
														numberOfMembers:
															joinStatus === "added"
																? prev.currentGroup?.group.numberOfMembers + 1
																: prev.currentGroup?.group.numberOfMembers,
													},
													userJoin: newGroupMember,
											  }
											: prev.currentGroup,
								} as GroupState)
						);
					}
				}
			} catch (error: any) {
				console.log(`=>Mongo: Join Group Error:\n${error.message}`);
			}
		},
		[groupStateValueMemo]
	);

	const fetchGroups = useCallback(
		async ({
			sortBy = "latest" as QueryGroupsSortBy,
			privacy = "public" as SiteGroup["privacy"],
			userPageId = undefined as string | undefined,
			creatorId = undefined as string | undefined,
			creator = undefined as string | undefined,
			tags = undefined as string | undefined,
		}) => {
			try {
				let refGroup;
				let refIndex;
				const sortByIndex =
					sortBy +
					(privacy ? `-${privacy}` : "") +
					(userPageId ? `-${userPageId}` : "") +
					(creatorId ? `-${creatorId}` : "") +
					(creator ? `-${creator}` : "") +
					(tags ? `-${tags}` : "");

				if (fetchingGroupsFor !== sortByIndex) {
					setFetchingGroupsFor(sortByIndex);

					switch (sortBy) {
						case "latest": {
							refIndex = groupStateValueMemo.groups.reduceRight(
								(acc, group, index) => {
									if (group.index[sortByIndex] && acc === -1) {
										return index;
									}

									return acc;
								},
								-1
							);

							refGroup = groupStateValueMemo.groups[refIndex] || null;
							break;
						}

						default: {
							refGroup = null;
							break;
						}
					}

					const { groups }: { groups: GroupData[] } = await axios
						.get(apiConfig.apiEndpoint + "/groups/groups", {
							params: {
								apiKey: userStateValue.api?.keys[0].key,
								userId: authUser?.uid,
								privacy: privacy,
								tags: tags,
								userPageId: userPageId,
								creatorId: creatorId,
								creator: creator,
								lastIndex: refGroup?.index[sortByIndex] || -1,
								fromMembers:
									refGroup?.group.numberOfMembers || Number.MAX_SAFE_INTEGER,
								fromPosts:
									refGroup?.group.numberOfPosts || Number.MAX_SAFE_INTEGER,
								fromDiscussions:
									refGroup?.group.numberOfDiscussions || Number.MAX_SAFE_INTEGER,
								fromDate: refGroup?.group.createdAt || null,
								sortBy: sortBy,
							} as Partial<APIEndpointGroupsParams>,
						})
						.then((res) => res.data)
						.catch((err) => {
							throw new Error(
								`=>API (GET): Getting Groups error:\n${err.message}`
							);
						});

					const fetchedLength = groups.length || 0;

					if (groups.length) {
						setGroupStateValueMemo((prev) => ({
							...prev,
							groups: prev.groups
								.map((groupData) => {
									const groupIndex = groups.findIndex(
										(group) => group.group.id === groupData.group.id
									);

									const existingGroup =
										groupIndex !== -1 ? groups[groupIndex] : null;

									if (existingGroup) {
										groups.splice(groupIndex, 1);

										const indices = {
											...groupData.index,
											...existingGroup.index,
										};

										return {
											...groupData,
											...existingGroup,
											index: indices,
										};
									} else {
										return groupData;
									}
								})
								.concat(groups),
						}));
					} else {
						console.log("Mongo: No groups found!");
					}

					setFetchingGroupsFor("");

					return fetchedLength;
				} else {
					return null;
				}
			} catch (error: any) {
				console.log(`=>MONGO: Error while fetching groups:\n${error.message}`);

				setFetchingGroupsFor("");

				return null;
			}
		},
		[
			authUser?.uid,
			fetchingGroupsFor,
			groupStateValueMemo.groups,
			setGroupStateValueMemo,
			userStateValue.api?.keys,
		]
	);

	const fetchGroupMembers = useCallback(
		async ({
			sortBy = "accepted-desc" as QueryGroupMembersSortBy,
			groupId = "" as string,
			roles = ["member"] as GroupMember["roles"],
		}) => {
			try {
				if (!groupStateValueMemo.currentGroup) {
					return;
				}

				let refGroupMember: GroupMemberData | null;
				let refIndex: number = -1;

				const sortByIndex =
					sortBy + `-${groupId}` + (roles ? `-${roles.join("_")}` : "");

				if (fetchingGroupMembersFor !== sortByIndex) {
					setFetchingGroupMembersFor(sortByIndex);

					switch (sortBy) {
						case "accepted-desc": {
							refIndex = groupStateValueMemo.currentGroup?.members?.reduceRight(
								(acc, member, index) => {
									if (member.index[sortByIndex] >= 0 && acc === -1) {
										return index;
									}

									return acc;
								},
								-1
							);

							refGroupMember =
								groupStateValueMemo.currentGroup?.members[refIndex] || null;

							break;
						}

						default: {
							refGroupMember = null;
							break;
						}
					}

					const {
						members,
					}: {
						members: GroupMemberData[];
					} = await axios
						.get(apiConfig.apiEndpoint + "/groups/members/members/", {
							params: {
								apiKey: userStateValue.api?.keys[0].key,
								userId: authUser?.uid,
								sortBy: sortBy,
								lastIndex: refGroupMember?.index[sortByIndex] || -1,
								groupId: groupId,
								roles: roles,
								fromUpdated: refGroupMember?.member?.updatedAt || null,
								fromRequested: refGroupMember?.member?.requestedAt || null,
								fromAccepted: refGroupMember?.member?.acceptedAt || null,
								fromRejected: refGroupMember?.member?.rejectedAt || null,
							} as Partial<APIEndpointGroupMembersGroupParams>,
						})
						.then((response) => response.data)
						.catch((error: any) => {
							throw new Error(
								`=>API (GET): Getting Group Members error:\n${error.message}`
							);
						});

					const fetchedLength = members.length || 0;

					if (fetchedLength) {
						setGroupStateValueMemo((prev) => ({
							...prev,
							currentGroup: prev.currentGroup
								? {
										...prev.currentGroup,
										members: prev.currentGroup.members
											.map((memberData) => {
												const memberIndex = members.findIndex(
													(member) =>
														member.member.userId === memberData.member.userId
												);

												const existingMember =
													memberIndex !== -1 ? members[memberIndex] : null;

												if (existingMember) {
													members.splice(memberIndex, 1);

													const indices = {
														...memberData.index,
														...existingMember.index,
													};

													return {
														...memberData,
														...existingMember,
														index: indices,
													};
												} else {
													return memberData;
												}
											})
											.concat(members),
								  }
								: prev.currentGroup,
						}));
					} else {
						console.log("Mongo: No members found!");
					}

					setFetchingGroupMembersFor("");

					return fetchedLength;
				} else {
					return null;
				}
			} catch (error: any) {
				console.log(
					`=>MONGO: Error while fetching group members:\n${error.message}`
				);

				setFetchingGroupMembersFor("");
				return null;
			}
		},
		[
			authUser?.uid,
			fetchingGroupMembersFor,
			groupStateValueMemo.currentGroup,
			setGroupStateValueMemo,
			userStateValue.api?.keys,
		]
	);

	const fetchUserJoin = useCallback(async (groupId: string, userId: string) => {
		try {
			const { userJoin } = await axios
				.get(apiConfig.apiEndpoint + "/groups/members/", {
					params: {
						apiKey: userStateValue.api?.keys[0].key,
						groupId: groupId,
						userId: userId,
					},
				})
				.then((response) => response.data)
				.catch((error: any) => {
					throw new Error(
						`=>API (GET): Getting User Join error:\n${error.message}`
					);
				});

			return userJoin || null;
		} catch (error: any) {
			console.log(`=>MONGO: Error while fetching user join:\n${error.message}`);
			return null;
		}
	}, []);

	return {
		groupStateValue: groupStateValueMemo,
		setGroupStateValue: setGroupStateValueMemo,
		createGroup,
		onJoinGroup,
		fetchGroups,
		fetchGroupMembers,
		fetchUserJoin,
	};
};

export default useGroup;
