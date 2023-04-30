import { adminState } from "@/atoms/adminAtom";
import { adminModalState } from "@/atoms/modalAtom";
import { navigationBarState } from "@/atoms/navigationBarAtom";
import { userState } from "@/atoms/userAtom";
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

const useUser = () => {
	const [user, loading, error] = useAuthState(clientAuth);
	const [loadingUser, setLoadingUser] = useState(false);
	const [userStateValue, setUserStateValue] = useRecoilState(userState);
	const router = useRouter();
	const currentUserMounted = useRef(false);
	const resetUserStateValue = useResetRecoilState(userState);
	const resetNavigationBarStateValue = useResetRecoilState(navigationBarState);
	const resetAdminStateValue = useResetRecoilState(adminState);
	const resetAdminModalStateValue = useResetRecoilState(adminModalState);

	const userMemo = useMemo(() => user, [user]);
	const userStateValueMemo = useMemo(() => userStateValue, [userStateValue]);
	const setUserStateValueMemo = useMemo(
		() => setUserStateValue,
		[setUserStateValue]
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
	const uploadProfilePhoto = useCallback(
		async (image: CreateUserType["profilePhoto"], imageId: string) => {
			try {
				const storageRef = ref(
					clientStorage,
					`users/${userMemo?.uid}/images/${imageId}`
				);
				const response = await fetch(image?.url as string);
				const blob = await response.blob();

				await uploadBytes(storageRef, blob).catch((error: any) => {
					console.log(
						"Firebase Storage: Uploading Profile Photo Error: ",
						error.message
					);
					throw error;
				});

				const downloadURL = await getDownloadURL(storageRef).catch(
					(error: any) => {
						console.log(
							"Firebase Storage: Getting Profile Photo Download URL Error: ",
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
					fileName: image?.name as string,
					fileType: image?.type as string,
					filePath: storageRef.fullPath,
					fileURL: downloadURL,
					fileExtension: image?.name.split(".").pop() as string,
					fileSize: image?.size as number,
					createdAt: new Date(),
				};

				await axios.post(apiConfig.apiEndpoint + "/users/images/", {
					newImage,
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

					const userProfilePhoto = await uploadProfilePhoto(
						userData.profilePhoto,
						imageDocRef.id
					).catch((error: any) => {
						console.log("Hook: Upload Profile Photo Error: ", error.message);
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
						console.log("API: Create User Error: ", error.message);
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
			uploadProfilePhoto,
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
		setLoadingUser(true);
		try {
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
		} catch (error: any) {
			console.log("Setting Current User State Error !");
		}

		setLoadingUser(false);
	}, [setUserStateValueMemo, userMemo]);

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
		} catch (error: any) {
			console.log("Hook: Reset User Data Error!");
			throw error;
		}
	}, [
		resetAdminModalStateValue,
		resetAdminStateValue,
		resetNavigationBarStateValue,
		resetUserStateValue,
	]);

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
			await signOut(clientAuth).catch((error: any) => {
				console.log("Hook: Sign Out Error: ", error.message);
				throw error;
			});

			await resetUserData();
		} catch (error: any) {
			console.log("Hook: Sign Out Error!");
			throw error;
		}
	}, [resetUserData]);

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
	}, [userMemo, loading, setCurrentUserState]);

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
		userMounted: currentUserMounted.current,
		createUser,
		logOutUser,
	};
};

export default useUser;
