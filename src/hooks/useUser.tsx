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
import { useEffect, useState, useMemo, useRef } from "react";
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

	const userMemo = useMemo(() => {
		return user;
	}, [user]);

	const setCurrentUserState = async () => {
		setLoadingUser(true);
		try {
			if (user) {
				const userData = await axios
					.post(apiConfig.apiEndpoint + "user/get-user", {
						userId: user.uid,
					})
					.then((res) => res.data.userData)
					.catch((error) => {
						console.log("API: Get User Error: ", error.message);
					});

				if (userData) {
					setUserStateValue((prev) => ({
						...prev,
						user: userData,
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
	};

	const createAccount = async (email: string, password: string) => {
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
							.post(apiConfig.apiEndpoint + "user/create-user", {
								newUser,
							})
							.then((res) => res.data.newUser)
							.catch((error) => {
								console.log("API: Create Account Error: ", error.message);
							});

						if (newUserData) {
							setUserStateValue((prev) => ({
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
	};

	const createUser = async (userData: CreateUserType) => {
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
					collection(clientDb, `users/${user?.uid}/images`)
				);

				const userProfilePhoto = await uploadProfilePhoto(
					userData.profilePhoto,
					imageDocRef.id
				).catch((error: any) => {
					console.log("Hook: Upload Profile Photo Error: ", error.message);
					throw error;
				});

				if (userProfilePhoto) {
					newUser.imageURL = userProfilePhoto.fileURL;
				}
			}

			const newUserData = await axios
				.post(apiConfig.apiEndpoint + "user/update-user", {
					newUser,
					userId: user?.uid,
				})
				.then((res) => res.data.newUser)
				.catch((error) => {
					console.log("API: Create User Error: ", error.message);
				});

			setUserStateValue((prev) => ({
				...prev,
				user: {
					...userStateValue.user,
					...newUserData,
				},
			}));
		} catch (error: any) {
			console.log("Hook: User Creation Error!");
			throw error;
		}
	};

	const uploadProfilePhoto = async (
		image: CreateUserType["profilePhoto"],
		imageId: string
	) => {
		try {
			const storageRef = ref(
				clientStorage,
				`users/${user?.uid}/images/${imageId}`
			);
			const response = await fetch(image?.url as string);
			const blob = await response.blob();

			await uploadBytes(storageRef, blob).catch((error: any) => {
				console.log("Hook: Uploading Profile Photo Error: ", error.message);
				throw error;
			});

			const downloadURL = await getDownloadURL(storageRef).catch(
				(error: any) => {
					console.log(
						"Hook: Getting Profile Photo Download URL Error: ",
						error.message
					);
					throw error;
				}
			);

			const newImage: UserImage = {
				id: imageId,
				userId: user?.uid as string,
				fileName: image?.name as string,
				fileType: image?.type as string,
				filePath: storageRef.fullPath,
				fileURL: downloadURL,
				fileExtension: image?.name.split(".").pop() as string,
				createdAt: new Date(),
			};

			await axios.put(apiConfig.apiEndpoint + "user/upload-profile-photo", {
				newImage,
			});

			return newImage;
		} catch (error: any) {
			console.log("Hook: Upload Profile Photo Error!");
			throw error;
		}
	};

	const logOutUser = async () => {
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
	};

	const resetUserData = async () => {
		try {
			resetUserStateValue();
			resetNavigationBarStateValue();
			resetAdminStateValue();
			resetAdminModalStateValue();
		} catch (error: any) {
			console.log("Hook: Reset User Data Error!");
			throw error;
		}
	};

	useEffect(() => {
		if (
			!user &&
			!loading &&
			!loadingUser &&
			!router.pathname.match(/\/auth\//)
		) {
			router.push("/auth/signin");
		} else if (user && !loading && !currentUserMounted.current) {
			setCurrentUserState().then(() => {
				currentUserMounted.current = true;
			});
		}
	}, [user, loading]);

	useEffect(() => {
		if (
			user &&
			userStateValue.user.isFirstLogin &&
			!loading &&
			!loadingUser &&
			userStateValue.user.uid
		) {
			router.push("/user/create-user");
		}
	}, [
		user,
		userStateValue.user.uid,
		userStateValue.user.isFirstLogin,
		loading,
		loadingUser,
	]);

	return {
		authUser: userMemo,
		authLoading: loading,
		authError: error,
		loadingUser,
		setLoadingUser,
		createAccount,
		userStateValue,
		setUserStateValue,
		userMounted: currentUserMounted.current,
		createUser,
		logOutUser,
	};
};

export default useUser;
