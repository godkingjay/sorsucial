import { adminState } from "@/atoms/adminAtom";
import { adminModalState } from "@/atoms/modalAtom";
import { NewUserType } from "@/components/Modal/AdminModals/AddUserModal";
import { firestore } from "@/firebase/clientApp";
import { SiteUser } from "@/lib/interfaces/user";
import axios from "axios";
import {
	Timestamp,
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	serverTimestamp,
	startAfter,
	where,
	writeBatch,
} from "firebase/firestore";
import React from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import useUser from "./useUser";

const useAdmin = () => {
	const [adminStateValue, setAdminStateValue] = useRecoilState(adminState);
	const [adminModalStateValue, setAdminModalStateValue] =
		useRecoilState(adminModalState);
	const resetAdminStateValue = useResetRecoilState(adminState);

	const createNewUsers = async (newUsers: NewUserType[]) => {
		try {
			const batch = writeBatch(firestore);

			const newAdminStateUsers: SiteUser[] = [];

			await Promise.all(
				newUsers.map(async (newUser) => {
					try {
						const { email, password } = newUser;

						try {
							await axios
								.post("/api/admin/create-user", {
									email,
									password,
									privateKey:
										process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY?.replace(
											/\\n/g,
											"\n"
										),
								})
								.then(async (res) => {
									const { uid: userId } = res.data;

									const userDocRef = doc(firestore, "users", userId);
									const userDoc = await getDoc(userDocRef);

									if (!userDoc.exists()) {
										const newUserDoc: SiteUser = {
											uid: userId,
											email: newUser.email,
											firstName: newUser.firstName || "User",
											lastName: newUser.lastName || "Account",
											middleName: newUser.middleName || "",
											isFirstLogin: false,
											roles: newUser.roles as SiteUser["roles"],
											numberOfConnections: 0,
											numberOfFollowers: 0,
											imageURL: "",
											birthDate: newUser.birthdate as Timestamp,
											gender: newUser.gender as SiteUser["gender"],
											stateOrProvince: newUser.stateOrProvince,
											cityOrMunicipality: newUser.cityOrMunicipality,
											barangay: newUser.barangay,
											streetAddress: newUser.streetAddress,
											createdAt: serverTimestamp() as Timestamp,
										};
										batch.set(userDocRef, newUserDoc);
										newAdminStateUsers.push({
											...newUserDoc,
										} as SiteUser);
									}
								})
								.catch((error: any) => {
									console.log("Create User Error: ", error.message);
								});
						} catch (error: any) {
							console.log("Create User Error: ", error.message);
						}
					} catch (error: any) {
						console.log(
							`Error Creating User ${newUser.email}: ${error.message}`
						);
					}
				})
			);

			await batch.commit();
			setAdminStateValue((prev) => ({
				...prev,
				manageUsers: [...newAdminStateUsers, ...prev.manageUsers],
			}));
		} catch (error: any) {
			console.log("Creating New Users Error!: ", error.message);
			throw error;
		}
	};

	const adminFetchUsers = async ({
		userLimit = 25,
	}: {
		userLimit?: number;
	}) => {
		try {
			const usersQuery =
				adminStateValue.manageUsers.length > 0
					? query(
							collection(firestore, "users"),
							orderBy("createdAt", "desc"),
							startAfter(
								adminStateValue.manageUsers[
									adminStateValue.manageUsers.length - 1
								].createdAt
							),
							limit(userLimit)
					  )
					: query(
							collection(firestore, "users"),
							orderBy("createdAt", "desc"),
							limit(userLimit)
					  );

			const usersSnapshot = await getDocs(usersQuery);

			const users = usersSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setAdminStateValue((prev) => ({
				...prev,
				manageUsers: [...prev.manageUsers, ...users] as SiteUser[],
			}));
		} catch (error: any) {
			console.log("Fetching Users Error!: ", error.message);
			throw error;
		}
	};

	const checkUserEmailExists = async (userEmail: string): Promise<boolean> => {
		try {
			const usersQuery = query(
				collection(firestore, "users"),
				where("email", "==", userEmail),
				limit(1)
			);

			const usersSnapshot = await getDocs(usersQuery);

			if (usersSnapshot.docs.length > 0) {
				return true;
			} else {
				return false;
			}
		} catch (error: any) {
			console.log("Fetching Users Error!: ", error.message);
			throw error;
		}
	};

	return {
		adminStateValue,
		adminFetchUsers,
		adminModalStateValue,
		setAdminModalStateValue,
		checkUserEmailExists,
		createNewUsers,
	};
};

export default useAdmin;
