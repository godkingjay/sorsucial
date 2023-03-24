import { adminState } from "@/atoms/adminAtom";
import { adminModalState } from "@/atoms/modalAtom";
import { NewUserType } from "@/components/Modal/AdminModals/AddUserModal";
import { apiConfig } from "@/lib/api/apiConfig";
import { SiteUser } from "@/lib/interfaces/user";
import axios from "axios";
import { useRecoilState } from "recoil";

const useAdmin = () => {
	const [adminStateValue, setAdminStateValue] = useRecoilState(adminState);
	const [adminModalStateValue, setAdminModalStateValue] =
		useRecoilState(adminModalState);

	const createNewUsers = async (newUsers: NewUserType[]) => {
		try {
			const newAdminStateUsers: SiteUser[] = [];

			await Promise.all(
				newUsers.map(async (newUser) => {
					try {
						const { email, password } = newUser;

						try {
							await axios
								.post(apiConfig.apiEndpoint + "admin/create-account", {
									email,
									password,
									privateKey: apiConfig.privateKey,
								})
								.then(async (res) => {
									const { uid: userId } = res.data;

									const date = new Date();

									if (userId) {
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
											birthDate: newUser.birthdate,
											gender: newUser.gender as SiteUser["gender"],
											stateOrProvince: newUser.stateOrProvince,
											cityOrMunicipality: newUser.cityOrMunicipality,
											barangay: newUser.barangay,
											streetAddress: newUser.streetAddress,
											createdAt: date,
											updatedAt: date,
										};

										const newUserData = await axios
											.post(apiConfig.apiEndpoint + "user/create-user", {
												newUser: newUserDoc,
											})
											.then((response) => response.data.newUser)
											.catch((error: any) => {
												console.log(
													"API: Creating User Error: ",
													newUserDoc.firstName,
													newUserDoc.lastName
												);
											});

										newAdminStateUsers.push({
											...newUserData,
										} as SiteUser);
									}
								})
								.catch((error: any) => {
									console.log("API: Creating Account Error: ", newUser.email);
								});
						} catch (error: any) {
							console.log("Mongo: Creating Account Error: ", error.message);
						}
					} catch (error: any) {
						console.log("Mongo: Error Creating Users Error:", error.message);
					}
				})
			);

			setAdminStateValue((prev) => ({
				...prev,
				manageUsers: [...newAdminStateUsers, ...prev.manageUsers],
			}));
		} catch (error: any) {
			console.log("Mongo: Creating New Users Error!: ", error.message);
		}
	};

	const deleteUser = async (userId: string) => {
		try {
			if (userId) {
				await axios
					.post(apiConfig.apiEndpoint + "admin/delete-account", {
						uid: userId,
						privateKey: apiConfig.privateKey,
					})
					.then(async (res) => {
						const { isDeleted } = res.data;
						if (isDeleted) {
							await axios.delete(apiConfig.apiEndpoint + "user/user", {
								data: {
									userId,
								},
							});

							setAdminStateValue((prev) => ({
								...prev,
								manageUsers: prev.manageUsers.filter(
									(user) => user.uid !== userId
								),
							}));
						} else {
							throw new Error("Account not deleted!");
						}
					})
					.catch((error: any) => {
						console.log(
							"API: Delete User Authentication Error: " + error.message
						);
					});
			} else {
				axios.delete(apiConfig.apiEndpoint + "admin/delete-user", {
					data: {
						userId,
						privateKey: apiConfig.privateKey,
					},
				});
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
			const lastUser = adminStateValue.manageUsers.length
				? adminStateValue.manageUsers[adminStateValue.manageUsers.length - 1]
				: null;

			const usersData: SiteUser[] = await axios
				.post(apiConfig.apiEndpoint + "admin/get-users", {
					lastUser,
					privateKey: apiConfig.privateKey,
					userLimit,
				})
				.then((response) => {
					return response.data.users;
				})
				.catch((error: any) => {
					console.log("API: Fetching Users Error!: ", error.message);
				});

			setAdminStateValue((prev) => ({
				...prev,
				manageUsers: [...prev.manageUsers, ...usersData] as SiteUser[],
			}));
		} catch (error: any) {
			console.log("Mongo: Fetching Users Error!: ", error.message);
		}
	};

	return {
		adminStateValue,
		setAdminStateValue,
		adminFetchUsers,
		adminModalStateValue,
		setAdminModalStateValue,
		createNewUsers,
		deleteUser,
	};
};

export default useAdmin;
