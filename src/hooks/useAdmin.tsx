import { adminState } from "@/atoms/adminAtom";
import { adminModalState } from "@/atoms/modalAtom";
import { firestore } from "@/firebase/clientApp";
import { SiteUser } from "@/lib/interfaces/user";
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from "firebase/firestore";
import React from "react";
import { useRecoilState, useResetRecoilState } from "recoil";

const useAdmin = () => {
	const [adminStateValue, setAdminStateValue] = useRecoilState(adminState);
	const [adminModalStateValue, setAdminModalStateValue] =
		useRecoilState(adminModalState);
	const resetAdminStateValue = useResetRecoilState(adminState);

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
	};
};

export default useAdmin;
