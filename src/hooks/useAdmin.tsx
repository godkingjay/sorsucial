import { adminState } from "@/atoms/adminAtom";
import { adminModalState } from "@/atoms/modalAtom";
import { NewUserType } from "@/components/Modal/AdminModals/AddUserModal";
import { db } from "@/firebase/clientApp";
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
import { useRecoilState } from "recoil";

const useAdmin = () => {
	const [adminStateValue, setAdminStateValue] = useRecoilState(adminState);
	const [adminModalStateValue, setAdminModalStateValue] =
		useRecoilState(adminModalState);

	const createNewUsers = async (newUsers: NewUserType[]) => {
		try {
			const batch = writeBatch(db);

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

									const userDocRef = doc(db, "users", userId);
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

	type DeleteDocumentAndSubcollections = {
		docId: string;
		collectionName: string;
		path?: string;
	};

	const deleteDocumentAndSubcollections = async ({
		docId,
		collectionName,
		path,
	}: DeleteDocumentAndSubcollections) => {
		try {
			if (docId && collectionName && !path) {
				await axios
					.post("/api/admin/delete-document", {
						docId,
						collectionName,
						path,
						privateKey: process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY?.replace(
							/\\n/g,
							"\n"
						),
					})
					.catch((error: any) => {
						console.log({
							message: "API: Delete Document Error: " + error.message,
							docId,
							collectionName,
						});
						throw error;
					});
			}
		} catch (error: any) {
			console.error("Hook: Error deleting document and subcollections!");
			throw error;
		}
	};

	const deleteUser = async (userId: string) => {
		try {
			if (userId) {
				await axios
					.post("/api/admin/delete-user", {
						uid: userId,
						privateKey: process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY?.replace(
							/\\n/g,
							"\n"
						),
					})
					.then(async (res) => {
						const { isDeleted } = res.data;
						if (isDeleted) {
							deleteDocumentAndSubcollections({
								docId: userId,
								collectionName: "users",
							})
								.then(async () => {
									setAdminStateValue((prev) => ({
										...prev,
										manageUsers: prev.manageUsers.filter(
											(user) => user.uid !== userId
										),
									}));

									axios
										.post("/api/admin/delete-files", {
											path: `users/${userId}/images`,
											privateKey:
												process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY?.replace(
													/\\n/g,
													"\n"
												),
										})
										.catch((error: any) => {
											console.log(
												"API: Delete User Images Error: " + error.message
											);
										});
								})
								.catch((error: any) => {
									console.log("API: Delete User Data Error: " + error.message);
								});
						} else {
							throw new Error("User not deleted!");
						}
					})
					.catch((error: any) => {
						console.log(
							"API: Delete User Authentication Error: " + error.message
						);
					});
			} else {
				throw new Error(
					"There is no user id to delete the user from the database and auth system of firebase."
				);
			}
		} catch (error: any) {
			console.log("Hook: Deleting User Error: ", error.message);
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
							collection(db, "users"),
							orderBy("createdAt", "desc"),
							startAfter(
								adminStateValue.manageUsers[
									adminStateValue.manageUsers.length - 1
								].createdAt
							),
							limit(userLimit)
					  )
					: query(
							collection(db, "users"),
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
				collection(db, "users"),
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
		setAdminStateValue,
		adminFetchUsers,
		adminModalStateValue,
		setAdminModalStateValue,
		checkUserEmailExists,
		createNewUsers,
		deleteUser,
	};
};

export default useAdmin;
