import { adminState } from "@/atoms/adminAtom";
import { discussionOptionsState, discussionState } from "@/atoms/discussionAtom";
import { groupState } from "@/atoms/groupAtom";
import {
	adminModalState,
	discussionCreationModalState,
	postCreationModalState,
} from "@/atoms/modalAtom";
import { navigationBarState } from "@/atoms/navigationBarAtom";
import { postOptionsState, postState } from "@/atoms/postAtom";
import { UserData, userOptionsState, userState } from "@/atoms/userAtom";
import { CreateUserType } from "@/components/Form/Auth/CreateUser/CreateUserForm";
import { clientAuth, clientDb, clientStorage } from "@/firebase/clientApp";
import { apiConfig } from "@/lib/api/apiConfig";
import { SiteUser, UserImage } from "@/lib/interfaces/user";
import axios from "axios";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useResetRecoilState } from "recoil";
import { ImageOrVideoType } from "./useInput";

const useUser = () => {
	const [user, loading, error] = useAuthState(clientAuth);
	const [loadingUser, setLoadingUser] = useState(false);
	const [userStateValue, setUserStateValue] = useRecoilState(userState);
	const [userOptionsStateValue, setUserOptionsStateValue] =
		useRecoilState(userOptionsState);

	const router = useRouter();
	const currentUserMounted = useRef(false);

	const resetUserStateValue = useResetRecoilState(userState);
	const resetNavigationBarStateValue = useResetRecoilState(navigationBarState);
	const resetAdminStateValue = useResetRecoilState(adminState);
	const resetAdminModalStateValue = useResetRecoilState(adminModalState);
	const resetPostStateValue = useResetRecoilState(postState);
	const resetPostOptionStateValue = useResetRecoilState(postOptionsState);
	const resetPostCreationModalStateValue = useResetRecoilState(
		postCreationModalState
	);
	const resetDiscussionStateValue = useResetRecoilState(discussionState);
	const resetDiscussionOptionStateValue = useResetRecoilState(
		discussionOptionsState
	);
	const resetDiscussionCreationModalStateValue = useResetRecoilState(
		discussionCreationModalState
	);
	const resetGroupStateValue = useResetRecoilState(groupState);

	const userMemo = useMemo(() => user, [user]);

	const userStateValueMemo = useMemo(() => userStateValue, [userStateValue]);

	const setUserStateValueMemo = useMemo(
		() => setUserStateValue,
		[setUserStateValue]
	);

	const userOptionsStateValueMemo = useMemo(
		() => userOptionsStateValue,
		[userOptionsStateValue]
	);

	const setUserOptionsStateValueMemo = useMemo(
		() => setUserOptionsStateValue,
		[setUserOptionsStateValue]
	);

	/**
	 * *  ██████╗        █████╗  ██████╗ ██████╗ ██████╗ ██╗   ██╗███╗   ██╗████████╗
	 * * ██╔════╝██╗    ██╔══██╗██╔════╝██╔════╝██╔═══██╗██║   ██║████╗  ██║╚══██╔══╝
	 * * ██║     ╚═╝    ███████║██║     ██║     ██║   ██║██║   ██║██╔██╗ ██║   ██║
	 * * ██║     ██╗    ██╔══██║██║     ██║     ██║   ██║██║   ██║██║╚██╗██║   ██║
	 * * ╚██████╗╚═╝    ██║  ██║╚██████╗╚██████╗╚██████╔╝╚██████╔╝██║ ╚████║   ██║
	 * *  ╚═════╝       ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝
	 */
	/**
	 *
	 *
	 * @param {string} email
	 * @param {string} password
	 */
	const createAccount = useCallback(
		async (email: string, password: string) => {
			try {
				await createUserWithEmailAndPassword(clientAuth, email, password)
					.then(async ({ user: userCredential }) => {
						if (userCredential) {
							const date = new Date();

							const newUser: SiteUser = {
								uid: userCredential.uid,
								email: userCredential.email as string,
								firstName: "",
								lastName: "",
								isFirstLogin: true,
								roles: ["user"],
								numberOfConnections: 0,
								numberOfFollowers: 0,
								updatedAt: date,
								createdAt: date,
							};

							const newUserData = await axios
								.post(apiConfig.apiEndpoint + "/users/", {
									privateKey: apiConfig.privateKey,
									userData: newUser,
								})
								.then((res) => res.data.newUser)
								.catch((error) => {
									console.log("API: Create Account Error: ", error.message);
								});

							if (newUserData) {
								setUserStateValueMemo((prev) => ({
									...prev,
									user: {
										...newUserData,
									},
								}));
							}
						}
					})
					.catch((error: any) => {
						console.log("Auth: Create Account Error: ", error.message);
					});
			} catch (error: any) {
				console.log("Firebase: Account Creation Error!");
			}
		},
		[setUserStateValueMemo]
	);

	/**
	 * *  ██████╗       ██████╗ ██████╗  ██████╗ ███████╗██╗██╗     ███████╗    ██████╗ ██╗  ██╗ ██████╗ ████████╗ ██████╗
	 * * ██╔════╝██╗    ██╔══██╗██╔══██╗██╔═══██╗██╔════╝██║██║     ██╔════╝    ██╔══██╗██║  ██║██╔═══██╗╚══██╔══╝██╔═══██╗
	 * * ██║     ╚═╝    ██████╔╝██████╔╝██║   ██║█████╗  ██║██║     █████╗      ██████╔╝███████║██║   ██║   ██║   ██║   ██║
	 * * ██║     ██╗    ██╔═══╝ ██╔══██╗██║   ██║██╔══╝  ██║██║     ██╔══╝      ██╔═══╝ ██╔══██║██║   ██║   ██║   ██║   ██║
	 * * ╚██████╗╚═╝    ██║     ██║  ██║╚██████╔╝██║     ██║███████╗███████╗    ██║     ██║  ██║╚██████╔╝   ██║   ╚██████╔╝
	 * *  ╚═════╝       ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝
	 */
	/**
	 *
	 *
	 * @param {CreateUserType["profilePhoto"]} image
	 * @param {string} imageId
	 * @return {*}
	 */
	const uploadUserPhoto = useCallback(
		async (
			image: ImageOrVideoType,
			imageId: string,
			type: UserImage["type"]
		) => {
			try {
				const storageRef = ref(
					clientStorage,
					`users/${userMemo?.uid}/images/${imageId}`
				);
				const response = await fetch(image?.url as string);
				const blob = await response.blob();

				await uploadBytes(storageRef, blob).catch((error: any) => {
					console.log(
						"Firebase Storage: Uploading User Photo Error: ",
						error.message
					);
					throw error;
				});

				const downloadURL = await getDownloadURL(storageRef).catch(
					(error: any) => {
						console.log(
							"Firebase Storage: Getting User Photo Download URL Error: ",
							error.message
						);
						throw error;
					}
				);

				const newImage: UserImage = {
					id: imageId,
					userId: userMemo?.uid as string,
					height: image?.height as number,
					width: image?.width as number,
					type: type,
					fileName: image?.name as string,
					fileType: image?.type as string,
					filePath: storageRef.fullPath,
					fileURL: downloadURL,
					fileExtension: image?.name.split(".").pop() as string,
					fileSize: image?.size as number,
					createdAt: new Date(),
				};

				await axios
					.post(apiConfig.apiEndpoint + "/users/images/", {
						newImage,
					})
					.catch((error) => {
						console.log(`=>API: Upload User Photo Error:\n${error.message}`);
					});

				return newImage;
			} catch (error: any) {
				console.log("Firebase Storage: Upload Profile Photo Error!");
				throw error;
			}
		},
		[userMemo?.uid]
	);

	/**
	 * *  ██████╗       ██╗   ██╗███████╗███████╗██████╗
	 * * ██╔════╝██╗    ██║   ██║██╔════╝██╔════╝██╔══██╗
	 * * ██║     ╚═╝    ██║   ██║███████╗█████╗  ██████╔╝
	 * * ██║     ██╗    ██║   ██║╚════██║██╔══╝  ██╔══██╗
	 * * ╚██████╗╚═╝    ╚██████╔╝███████║███████╗██║  ██║
	 * *  ╚═════╝        ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
	 */
	/**
	 *
	 *
	 * @param {CreateUserType} userData
	 */
	const createUser = useCallback(
		async (userData: CreateUserType) => {
			try {
				const newUser = {
					firstName: userData.firstName,
					middleName: userData.middleName,
					lastName: userData.lastName,
					isFirstLogin: false,
					imageURL: "",
					birthDate: userData.birthdate,
					gender: userData.gender as SiteUser["gender"],
					stateOrProvince: userData.stateOrProvince,
					cityOrMunicipality: userData.cityOrMunicipality,
					barangay: userData.barangay,
					streetAddress: userData.streetAddress,
					updatedAt: new Date(),
				};

				if (userData.profilePhoto?.url) {
					const imageDocRef = doc(
						collection(clientDb, `users/${userMemo?.uid}/images`)
					);

					const userProfilePhoto = await uploadUserPhoto(
						userData.profilePhoto,
						imageDocRef.id,
						"profile"
					).catch((error: any) => {
						throw new Error(
							`=>Hook: Upload User Photo Error:\n${error.message}`
						);
					});

					if (userProfilePhoto) {
						newUser.imageURL = userProfilePhoto.fileURL;
					}
				}

				const newUserData = await axios
					.put(apiConfig.apiEndpoint + "/users/", {
						apiKey: userStateValueMemo.api?.keys[0].key,
						userData: newUser,
						userId: userMemo?.uid,
					})
					.then((res) => res.data.newUser)
					.catch((error) => {
						throw new Error(`=>API: Create User Error:\n${error.message}`);
					});

				setUserStateValueMemo((prev) => ({
					...prev,
					user: {
						...userStateValueMemo.user,
						...newUserData,
					},
				}));
			} catch (error: any) {
				console.log("Hook: User Creation Error!");
			}
		},
		[
			setUserStateValueMemo,
			uploadUserPhoto,
			userMemo?.uid,
			userStateValueMemo.api?.keys,
			userStateValueMemo.user,
		]
	);

	const changePhoto = useCallback(
		async ({
			image = undefined as ImageOrVideoType | undefined,
			type = undefined as UserImage["type"] | undefined,
		}) => {
			try {
				if (image && user) {
					const imageDocRef = doc(
						collection(clientDb, `users/${userMemo?.uid}/images`)
					);

					const userPhoto = await uploadUserPhoto(
						image,
						imageDocRef.id,
						"profile"
					).catch((error: any) => {
						throw new Error(
							`=>Hook: Upload User Photo Error:\n${error.message}`
						);
					});

					if (userPhoto) {
						const { _id, ...currentUser } =
							userStateValueMemo.user as SiteUser & { _id: any };

						const newUserData = await axios
							.put(apiConfig.apiEndpoint + "/users/", {
								apiKey: userStateValueMemo.api?.keys[0].key,
								userData: {
									...currentUser,
									imageURL:
										type === "profile"
											? userPhoto.fileURL
											: userStateValueMemo.user.imageURL,
									coverImageURL:
										type === "cover"
											? userPhoto.fileURL
											: userStateValueMemo.user.coverImageURL,
								},
								userId: userMemo?.uid,
							})
							.then((res) => res.data.newUser)
							.catch((error) => {
								throw new Error(`=>API: Create User Error:\n${error.message}`);
							});

						switch (type) {
							case "profile": {
								setUserStateValueMemo((prev) => ({
									...prev,
									user: {
										...newUserData,
										imageURL: userPhoto.fileURL,
									},
									userPage:
										prev.user.uid === userPhoto.userId && prev.userPage
											? {
													...prev.userPage,
													user: {
														...newUserData,
														imageURL: userPhoto.fileURL,
													},
											  }
											: prev.userPage,
								}));

								break;
							}

							case "cover": {
								setUserStateValueMemo((prev) => ({
									...prev,
									user: {
										...prev.user,
										coverImageURL: userPhoto.fileURL,
									},
									userPage:
										prev.user.uid === userPhoto.userId && prev.userPage
											? {
													...prev.userPage,
													user: {
														...prev.userPage.user,
														coverImageURL: userPhoto.fileURL,
													},
											  }
											: prev.userPage,
								}));

								break;
							}

							default: {
								throw new Error("Invalid Image Type!");
								break;
							}
						}
					}
				}
			} catch (error: any) {
				console.log(`=>Mongo: Changing User Photo Error:\n${error.message}`);
			}
		},
		[
			setUserStateValueMemo,
			uploadUserPhoto,
			user,
			userMemo?.uid,
			userStateValueMemo.api?.keys,
			userStateValueMemo.user,
		]
	);

	/**
	 * ^ ██████╗         ██████╗██╗   ██╗██████╗ ██████╗ ███████╗███╗   ██╗████████╗    ██╗   ██╗███████╗███████╗██████╗
	 * ^ ██╔══██╗██╗    ██╔════╝██║   ██║██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝    ██║   ██║██╔════╝██╔════╝██╔══██╗
	 * ^ ██████╔╝╚═╝    ██║     ██║   ██║██████╔╝██████╔╝█████╗  ██╔██╗ ██║   ██║       ██║   ██║███████╗█████╗  ██████╔╝
	 * ^ ██╔══██╗██╗    ██║     ██║   ██║██╔══██╗██╔══██╗██╔══╝  ██║╚██╗██║   ██║       ██║   ██║╚════██║██╔══╝  ██╔══██╗
	 * ^ ██║  ██║╚═╝    ╚██████╗╚██████╔╝██║  ██║██║  ██║███████╗██║ ╚████║   ██║       ╚██████╔╝███████║███████╗██║  ██║
	 * ^ ╚═╝  ╚═╝        ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝        ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
	 */
	/**
	 *
	 *
	 */
	const setCurrentUserState = useCallback(async () => {
		try {
			if (!loadingUser && !userStateValue.api && userMemo) {
				setLoadingUser(true);

				if (userMemo) {
					const { userData, userAPI } = await axios
						.post(apiConfig.apiEndpoint + "/auth/signin", {
							privateKey: apiConfig.privateKey,
							userId: userMemo.uid,
						})
						.then((res) => res.data)
						.catch((error) => {
							console.log("API: Get User Error: ", error.message);
						});

					if (userData) {
						setUserStateValueMemo((prev) => ({
							...prev,
							user: userData,
							api: userAPI,
						}));
					} else {
						console.log("Mongo: User does not exist in the database!");
					}
				} else {
					console.log("Firebase Auth: User is not logged in !");
				}
				setLoadingUser(false);
			}
		} catch (error: any) {
			console.log(
				`=>Mongo: Setting Current User State Error:\n${error.message}`
			);
			setLoadingUser(false);
		}
	}, [loadingUser, setUserStateValueMemo, userMemo, userStateValue.api]);

	const updateUser = useCallback(
		async (userData: Partial<SiteUser>) => {
			try {
				const { newUser } = await axios
					.put(apiConfig.apiEndpoint + "/users/", {
						apiKey: userStateValueMemo.api?.keys[0].key,
						userData: userData,
						userId: userMemo?.uid,
					})
					.then((response) => response.data)
					.catch((error) => {
						throw new Error(`=>API: Update User Error:\n${error.message}`);
					});

				if (newUser) {
					setUserStateValueMemo((prev) => ({
						...prev,
						user: {
							...prev.user,
							...newUser,
						},
						userPage:
							prev.userPage && prev.userPage.user.uid === userMemo?.uid
								? {
										...prev.userPage,
										user: {
											...prev.userPage.user,
											...newUser,
										},
								  }
								: prev.userPage,
					}));
				}
			} catch (error: any) {
				console.log(`=>Mongo: Error updating user:\n${error.message}`);
			}
		},
		[setUserStateValueMemo, userMemo?.uid, userStateValueMemo.api?.keys]
	);

	const changePassword = useCallback(
		async (oldPassword: string, newPassword: string) => {
			try {
				if (userMemo) {
					await axios
						.post(apiConfig.apiEndpoint + "/auth/change-password", {
							apiKey: userStateValueMemo.api?.keys[0].key,
							privateKey: apiConfig.privateKey,
							oldPassword,
							newPassword,
						})
						.catch((error: any) => {
							const { error: apiError } = error.response.data;

							throw new Error(`=>API: Change Password Error:\n${error.message}`);
						});
				}
			} catch (error: any) {
				console.log(`=>Mongo: Error changing password:\n${error.message}`);
			}
		},
		[userMemo, userStateValueMemo.api?.keys]
	);

	/**
	 * ~ ██████╗ ███████╗███████╗███████╗████████╗    ██╗   ██╗███████╗███████╗██████╗     ███████╗████████╗ █████╗ ████████╗███████╗
	 * ~ ██╔══██╗██╔════╝██╔════╝██╔════╝╚══██╔══╝    ██║   ██║██╔════╝██╔════╝██╔══██╗    ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝
	 * ~ ██████╔╝█████╗  ███████╗█████╗     ██║       ██║   ██║███████╗█████╗  ██████╔╝    ███████╗   ██║   ███████║   ██║   █████╗
	 * ~ ██╔══██╗██╔══╝  ╚════██║██╔══╝     ██║       ██║   ██║╚════██║██╔══╝  ██╔══██╗    ╚════██║   ██║   ██╔══██║   ██║   ██╔══╝
	 * ~ ██║  ██║███████╗███████║███████╗   ██║       ╚██████╔╝███████║███████╗██║  ██║    ███████║   ██║   ██║  ██║   ██║   ███████╗
	 * ~ ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝   ╚═╝        ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝    ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝
	 */
	/**
	 *
	 *
	 */
	const resetUserData = useCallback(async () => {
		try {
			resetUserStateValue();
			resetNavigationBarStateValue();
			resetAdminStateValue();
			resetAdminModalStateValue();
			resetPostStateValue();
			resetPostOptionStateValue();
			resetPostCreationModalStateValue();
			resetDiscussionStateValue();
			resetDiscussionOptionStateValue();
			resetDiscussionCreationModalStateValue();
			resetGroupStateValue();
		} catch (error: any) {
			console.log("Hook: Reset User Data Error!");
			throw error;
		}
	}, [userStateValueMemo]);

	/**
	 * ~ ██╗      ██████╗  ██████╗      ██████╗ ██╗   ██╗████████╗    ██╗   ██╗███████╗███████╗██████╗
	 * ~ ██║     ██╔═══██╗██╔════╝     ██╔═══██╗██║   ██║╚══██╔══╝    ██║   ██║██╔════╝██╔════╝██╔══██╗
	 * ~ ██║     ██║   ██║██║  ███╗    ██║   ██║██║   ██║   ██║       ██║   ██║███████╗█████╗  ██████╔╝
	 * ~ ██║     ██║   ██║██║   ██║    ██║   ██║██║   ██║   ██║       ██║   ██║╚════██║██╔══╝  ██╔══██╗
	 * ~ ███████╗╚██████╔╝╚██████╔╝    ╚██████╔╝╚██████╔╝   ██║       ╚██████╔╝███████║███████╗██║  ██║
	 * ~ ╚══════╝ ╚═════╝  ╚═════╝      ╚═════╝  ╚═════╝    ╚═╝        ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
	 */
	/**
	 *
	 *
	 */
	const logOutUser = useCallback(async () => {
		try {
			if (!loadingUser) {
				setLoadingUser(true);
				await signOut(clientAuth).catch((error: any) => {
					throw new Error(`=>Hook: Sign Out Error:\n${error.message}`);
				});

				await resetUserData();
				setLoadingUser(false);
			}
		} catch (error: any) {
			console.log(`=>Hook: Log Out User Error:\n${error.message}`);
			setLoadingUser(false);
		}
	}, [loadingUser, resetUserData]);

	useEffect(() => {
		if (
			!userMemo &&
			!loading &&
			!loadingUser &&
			!router.pathname.match(/\/auth\//)
		) {
			router.push("/auth/signin");
		} else if (userMemo && !loading && !currentUserMounted.current) {
			currentUserMounted.current = true;
			setCurrentUserState();
		}
	}, [
		userMemo,
		loading,
		setCurrentUserState,
		loadingUser,
		userStateValue.user.uid,
		router,
	]);

	useEffect(() => {
		if (
			!loading &&
			!loadingUser &&
			userStateValueMemo.user.uid &&
			userStateValueMemo.user.isFirstLogin &&
			currentUserMounted.current
		) {
			router.push("/user/create-user");
		}
	}, [
		userStateValueMemo.user.uid,
		userStateValueMemo.user.isFirstLogin,
		currentUserMounted.current,
	]);

	return {
		authUser: userMemo,
		authLoading: loading,
		authError: error,
		loadingUser,
		setLoadingUser,
		createAccount,
		userStateValue: userStateValueMemo,
		setUserStateValue: setUserStateValueMemo,
		userOptionsStateValue: userOptionsStateValueMemo,
		setUserOptionsStateValue: setUserOptionsStateValueMemo,
		userMounted: currentUserMounted.current,
		createUser,
		updateUser,
		changePassword,
		changePhoto,
		logOutUser,
	};
};

export default useUser;
