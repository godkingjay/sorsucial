import { GroupData, GroupState, groupState } from "@/atoms/groupAtom";
import { CreateGroupType } from "@/components/Modal/GroupCreationModal";
import React, { useCallback, useMemo } from "react";
import { useRecoilState } from "recoil";
import useUser from "./useUser";
import { GroupImage, GroupMember, SiteGroup } from "@/lib/interfaces/group";
import { collection, doc } from "firebase/firestore";
import axios from "axios";
import { apiConfig } from "@/lib/api/apiConfig";
import { clientDb, clientStorage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { QueryGroupsSortBy } from "@/lib/types/api";

const useGroup = () => {
	const [groupStateValue, setGroupStateValue] = useRecoilState(groupState);
	const { authUser, userStateValue } = useUser();

	const groupStateValueMemo = useMemo(() => groupStateValue, [groupStateValue]);

	const setGroupStateValueMemo = useMemo(
		() => setGroupStateValue,
		[setGroupStateValue]
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
						throw new Error(`API: Group Creation Error:\n${error.message}`);
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
								`Hook: Group Image Upload Error:\n${error.message}`
							);
						});

						if (groupImage) {
							groupData.image = groupImage;
						}
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
										index: {
											newest: 0,
											latest: 0,
										},
									},
									...prev.groups,
								],
							} as GroupState)
					);
				}
			} catch (error: any) {
				console.log(`Mongo: Create Group Error:\n${error.message}`);
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
						"Firebase Storage: Image Upload Error:\n" + error.message
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
							"Firebase Storage: Image  Download URL Error:\n" + error.message
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
							`API: Group Image Creation Error:\n${error.message}`
						);
					});

				/**
				 * After successfully uploading the image to the storage and creating the image details,
				 * return the image details.
				 */
				return groupImageData || null;
			} catch (error: any) {
				console.log("Firebase: Uploading Image Error:\n", error.message);
			}

			return null;
		},
		[groupStateValueMemo]
	);

	const onJoinGroup = useCallback(
		async (groupData: GroupData) => {
			try {
				// Check if user already joined.

				if (groupData.userJoin !== null) {
					// If user already joined, then remove.
					const date = new Date();

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
							throw new Error(
								`API: Group Member Deletion Error:\n${error.message}`
							);
						});

					if (isDeleted) {
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
					// If user not joined, then join.

					const date = new Date();

					const newGroupMember: Partial<GroupMember> = {
						userId: userStateValue.user.uid,
						groupId: groupData.group.id,
						roles:
							groupData.group.privacy === "public" ? ["member"] : ["pending"],
						updatedAt: date,
						acceptedAt: groupData.group.privacy === "public" ? date : undefined,
						requestedAt: date,
					};

					if (groupData.group.creatorId === userStateValue.user.uid) {
						newGroupMember.roles = ["owner", "admin", "moderator", "member"];
						newGroupMember.acceptedAt = date;
					}

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
								throw new Error(
									`API: Group Member Creation Error:\n${error.message}`
								);
							});

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
				console.log(`Mongo: Join Group Error:\n${error.message}`);
			}
		},
		[groupStateValueMemo]
	);

	const fetchGroups = useCallback(
		async ({
			privacy = "public" as SiteGroup["privacy"],
			sortBy = "latest" as QueryGroupsSortBy,
		}) => {
			try {
				let refGroup;

				switch (sortBy) {
					case "latest": {
						const refIndex = groupStateValueMemo.groups.reduceRight(
							(acc, group, index) => {
								if (group.index[sortBy] && acc === -1) {
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
					}
				}

				const { groups }: { groups: GroupData[] } = await axios
					.get(apiConfig.apiEndpoint + "/groups/groups", {
						params: {
							apiKey: userStateValue.api?.keys[0].key,
							userId: authUser?.uid,
							privacy: privacy,
							lastIndex: refGroup?.index[sortBy] || -1,
							fromMember:
								refGroup?.group.numberOfMembers || Number.MAX_SAFE_INTEGER,
							fromDate: refGroup?.group.createdAt || null,
						},
					})
					.then((res) => res.data)
					.catch((err) => {
						throw new Error(`API (GET): Getting Groups error:\n ${err.message}`);
					});

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

									return {
										...existingGroup,
										...groupData,
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

				return groups.length;
			} catch (error: any) {
				console.log(`MONGO: Error while fetching groups:\n${error.message}`);
			}
		},
		[groupStateValueMemo]
	);

	return {
		groupStateValue: groupStateValueMemo,
		setGroupStateValue: setGroupStateValueMemo,
		createGroup,
		onJoinGroup,
		fetchGroups,
	};
};

export default useGroup;
