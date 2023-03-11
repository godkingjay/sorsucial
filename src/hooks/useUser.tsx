import { userState } from "@/atoms/userAtom";
import { auth, firestore } from "@/firebase/clientApp";
import { SiteUser } from "@/lib/interfaces/user";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
	Timestamp,
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";

const useUser = () => {
	const [user, loading, error] = useAuthState(auth);
	const [loadingUser, setLoadingUser] = useState(false);
	const [userStateValue, setUserStateValue] = useRecoilState(userState);
	const router = useRouter();

	const getUserDetails = async () => {};

	const userMemo = useMemo(() => {
		return user;
	}, [user]);

	const setCurrentUserState = async () => {
		if (user) {
			try {
				const userDocRef = doc(firestore, "users", user.uid);
				const userDoc = await getDoc(userDocRef).catch((error) => {
					console.log("Hook: Getting User Document Error: ", error.message);
				});
				if (userDoc) {
					const userDocData = userDoc.data() as SiteUser;
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
	};

	const createUser = async (email: string, password: string) => {
		try {
			await createUserWithEmailAndPassword(auth, email, password)
				.then(async ({ user: userCredential }) => {
					if (userCredential) {
						const userDocRef = doc(firestore, "users", userCredential.uid);
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

	useEffect(() => {
		setLoadingUser(true);
		if (!user && !loading && !router.pathname.match(/\/auth\//)) {
			setLoadingUser(false);
			router.push("/auth/signin");
		} else {
			getUserDetails();
		}
	}, [user, loading]);

	useEffect(() => {
		if (user && !loading) {
			setCurrentUserState();
		}
	}, [user, loading]);

	return {
		authUser: userMemo,
		authLoading: loading,
		authError: error,
		loadingUser,
		setLoadingUser,
		createUser,
		userStateValue,
	};
};

export default useUser;
