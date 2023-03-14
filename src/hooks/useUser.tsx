import { userState } from "@/atoms/userAtom";
import { CreateUserType } from "@/components/Form/Auth/CreateUser/CreateUserForm";
import { auth, firestore, storage } from "@/firebase/clientApp";
import { SiteUser, UserImage } from "@/lib/interfaces/user";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import {
	Timestamp,
	collection,
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	writeBatch,
} from "firebase/firestore";
import {
	UploadTask,
	getDownloadURL,
	ref,
	uploadBytes,
	uploadString,
} from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useResetRecoilState } from "recoil";

const useUser = () => {
	const [user, loading, error] = useAuthState(auth);
	const [loadingUser, setLoadingUser] = useState(false);
	const [userStateValue, setUserStateValue] = useRecoilState(userState);
	const resetUserStateValue = useResetRecoilState(userState);
	const router = useRouter();

	/**
	 * useMemo Hook to create a memoized version of the current user object.
	 *
	 * @param {object} user - The current user object.
	 *
	 * @return {object} - The memoized user object.
	 *
	 */
	const userMemo = useMemo(() => {
		return user;
	}, [user]);

	/**
	 * Async function to set the current user state and retrieve user data from Firestore.
	 *
	 * @return {void}
	 */
	const setCurrentUserState = async () => {
		/**
		 * Set loading state to true while user data is retrieved
		 */
		setLoadingUser(true);

		/**
		 * If user exists, retrieve user data from Firestore
		 */
		if (user) {
			try {
				/**
				 * Create user document reference
				 */
				const userDocRef = doc(firestore, "users", user.uid);

				/**
				 * Get user document data from Firestore
				 */
				const userDoc = await getDoc(userDocRef).catch((error) => {
					console.log("Hook: Getting User Document Error: ", error.message);
				});

				/**
				 * If user document exists, set user state
				 */
				if (userDoc) {
					/**
					 * Get user document data
					 */
					const userDocData = userDoc.data() as SiteUser;

					/**
					 * Set user state
					 */
					setUserStateValue({
						user: {
							...userDocData,
						},
					});
				}
			} catch (error: any) {
				console.log("Hook(setUser): Setting Current User State Error !");
			}
		}

		// Set loading state to false when user data retrieval is complete
		setLoadingUser(false);
	};

	/**
	 * Async function to create a new user account and user document in Firestore.
	 *
	 * @param {string} email
	 * @param {string} password
	 */
	const createAccount = async (email: string, password: string) => {
		/**
		 * Create new user document in Firestore
		 * and set user state
		 */
		try {
			/**
			 * Create new user document in Firestore
			 */
			await createUserWithEmailAndPassword(auth, email, password)
				.then(async ({ user: userCredential }) => {
					/**
					 * If user document exists, set user state
					 * and create user document in Firestore
					 * with user data
					 */
					if (userCredential) {
						/**
						 * Create user document reference
						 */
						const userDocRef = doc(firestore, "users", userCredential.uid);

						/**
						 * Create new user object
						 */
						const newUser: SiteUser = {
							uid: userCredential.uid,
							email: userCredential.email as string,
							firstName: "",
							lastName: "",
							isFirstLogin: true,
							role: "user",
							numberOfConnections: 0,
							numberOfFollowers: 0,
							createdAt: serverTimestamp() as Timestamp,
						};

						/**
						 * Create user document in Firestore
						 */
						await setDoc(userDocRef, newUser)
							.then(() => {
								setUserStateValue({
									user: {
										...newUser,
									},
								});
							})
							.catch((error: any) => {
								console.log(
									"Hook: Creating User Document Error: ",
									error.message
								);
								throw error;
							});
					}
				})
				.catch((error: any) => {
					console.log("Hook: Create User Error: ", error.message);
					throw error;
				});
		} catch (error: any) {
			console.log("Hook: User Creation Error!");
			throw error;
		}
	};

	const createUser = async (userData: CreateUserType) => {
		try {
			const batch = writeBatch(firestore);
			const imageDocRef = doc(
				collection(firestore, `users/${user?.uid}/images`)
			);

			await uploadProfilePhoto(userData.profilePhoto, imageDocRef.id).catch(
				(error: any) => {
					console.log("Hook: Upload Profile Photo Error: ", error.message);
					throw error;
				}
			);

			const profilePhotoDocRef = doc(
				collection(firestore, `users/${user?.uid}/images`),
				imageDocRef.id
			);
			const profilePhotoDoc = await getDoc(profilePhotoDocRef).catch(
				(error: any) => {
					console.log(
						"Hook: Getting Profile Photo Document Error: ",
						error.message
					);
					throw error;
				}
			);

			if (profilePhotoDoc.exists()) {
				const profilePhotoDocData = profilePhotoDoc.data() as UserImage;

				const userDocRef = doc(collection(firestore, "users"), user?.uid);
				const newUser = {
					firstName: userData.firstName,
					middleName: userData.middleName,
					lastName: userData.lastName,
					isFirstLogin: false,
					imageURL: profilePhotoDocData.fileURL,
					birthDate: userData.birthdate as Timestamp,
					gender: userData.gender as SiteUser["gender"],
					stateOrProvince: userData.stateOrProvince,
					cityOrMunicipality: userData.cityOrMunicipality,
					barangay: userData.barangay,
					streetAddress: userData.streetAddress,
					lastChangeAt: serverTimestamp() as Timestamp,
				};

				batch.update(userDocRef, newUser);

				await batch.commit().catch((error: any) => {
					console.log("Hook: Creating User Document Error: ", error.message);
					throw error;
				});

				setUserStateValue((prev) => ({
					...prev,
					user: {
						...userStateValue.user,
						...newUser,
					},
				}));
			} else {
				console.log("Hook: Profile Photo Document Not Found!");
			}
		} catch (error: any) {
			console.log("Hook: User Creation Error!");
			throw error;
		}
	};

	/**
	 * Async function to upload profile photo to Firebase Storage
	 * and create a new user image document in Firestore.
	 *
	 * @param {CreateUserType["profilePhoto"]} image
	 * @param {string} imageId
	 *
	 * @returns {Promise<void>}
	 *
	 * @throws {Error} If there is an error uploading the profile photo to Firebase Storage.
	 * @throws {Error} If there is an error creating the user image document in Firestore.
	 */
	const uploadProfilePhoto = async (
		image: CreateUserType["profilePhoto"],
		imageId: string
	) => {
		/**
		 * Try to upload the profile photo to Firebase Storage and create a new user image document in Firestore.
		 * If there is an error, throw an error.
		 */
		try {
			/**
			 * Create new user image reference in Firebase Storage.
			 */
			const storageRef = ref(storage, `users/${user?.uid}/images/${imageId}`);
			/**
			 * Fetch the profile photo from the URL.
			 */
			const response = await fetch(image?.url as string);
			/**
			 * Convert the response to a blob.
			 */
			const blob = await response.blob();

			/**
			 * Upload the blob to Firebase Storage.
			 * If there is an error, throw an error.
			 */
			await uploadBytes(storageRef, blob).catch((error: any) => {
				console.log("Hook: Uploading Profile Photo Error: ", error.message);
				throw error;
			});

			/**
			 * Get the download URL of the profile photo from Firebase Storage.
			 * If there is an error, throw an error.
			 *
			 * @param storageRef reference to the profile photo in Firebase Storage.
			 *
			 * @returns {Promise<string>} download URL of the profile photo.
			 *
			 * @throws {Error} If there is an error getting the download URL of the profile photo.
			 */
			const downloadURL = await getDownloadURL(storageRef).catch(
				(error: any) => {
					console.log(
						"Hook: Getting Profile Photo Download URL Error: ",
						error.message
					);
					throw error;
				}
			);

			/**
			 * Upload the profile photo to Firebase Storage.
			 */
			const profilePhotoDocRef = doc(
				firestore,
				`users/${user?.uid}/images`,
				imageId
			);

			/**
			 * Create an object to hold the profile photo from Firebase Storage.
			 * This will be used to create a new user image document in Firestore.
			 */
			const newImage: UserImage = {
				id: imageId,
				userId: user?.uid as string,
				fileName: image?.name as string,
				fileType: image?.type as string,
				filePath: storageRef.fullPath,
				fileURL: downloadURL,
				fileExtension: image?.name.split(".").pop() as string,
				createdAt: serverTimestamp() as Timestamp,
			};

			/**
			 * Create a new user image document in Firestore.
			 * If there is an error, throw an error.
			 * If there is no error, return void.
			 */
			await setDoc(profilePhotoDocRef, newImage).catch((error: any) => {
				console.log(
					"Hook: Creating Profile Photo Document Error: ",
					error.message
				);
				throw error;
			});
		} catch (error: any) {
			console.log("Hook: Upload Profile Photo Error!");
			throw error;
		}
	};

	/**
	 * Sign out the current user.
	 * Reset the user state value.
	 * Redirect to the sign-in page.
	 *
	 * @throws {Error} - An error object containing the error message.
	 * @returns {Promise<void>} - A promise that resolves to void.
	 *
	 * @example
	 * const { logOutUser } = useUser();
	 *
	 * const handleLogOut = async () => {
	 * 	try {
	 * 		await logOutUser();
	 * 	} catch (error) {
	 * 		console.log("Error: ", error.message);
	 * 	}
	 * };
	 */
	const logOutUser = async () => {
		try {
			await signOut(auth).catch((error: any) => {
				console.log("Hook: Sign Out Error: ", error.message);
				throw error;
			});

			resetUserStateValue();

			router.push("/auth/signin");
		} catch (error: any) {
			console.log("Hook: Sign Out Error!");
			throw error;
		}
	};

	/**
	 * useEffect Hook to check if the user is authenticated and redirect to the sign-in page if not.
	 * Also updates the current user state if the user is authenticated and the page is not loading.
	 *
	 * @param {object} user - The current user object.
	 * @param {boolean} loading - Flag indicating whether the page is currently loading.
	 * @param {object} router - The Next.js router object.
	 * @param {function} setCurrentUserState - The function to update the current user state.
	 *
	 * @return {void}
	 */
	useEffect(() => {
		if (!user && !loading && !router.pathname.match(/\/auth\//)) {
			router.push("/auth/signin");
		} else if (user && !loading) {
			setCurrentUserState();
		}
	}, [user, loading]);

	/**
	 * useEffect Hook to check if the user is authenticated and if it is the first login.
	 * Redirects to the "create user" page if the user is authenticated and it's their first login.
	 *
	 * @param {object} userStateValue - The current user state object.
	 * @param {object} router - The Next.js router object.
	 *
	 * @return {void}
	 */
	useEffect(() => {
		if (user && userStateValue.user.isFirstLogin) {
			router.push("/user/create-user");
		}
	}, [userStateValue.user]);

	return {
		authUser: userMemo,
		authLoading: loading,
		authError: error,
		loadingUser,
		setLoadingUser,
		createAccount,
		userStateValue,
		createUser,
		logOutUser,
	};
};

export default useUser;
