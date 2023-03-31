import { adminState } from "@/atoms/adminAtom";
import { adminModalState } from "@/atoms/modalAtom";
import { NewUserType } from "@/components/Modal/AdminModals/AddUserModal";
import { apiConfig } from "@/lib/api/apiConfig";
import { SiteUser } from "@/lib/interfaces/user";
import axios from "axios";
import { useRecoilState } from "recoil";

/**
 * useAdmin
 *
 * This hook is used to manage the admin state and admin modal state.
 *
 * @returns {object} - {adminStateValue, setAdminStateValue, adminModalStateValue, setAdminModalStateValue, createNewUsers, deleteUser}
 */
const useAdmin = () => {
	/**
	 * adminStateValue - The current value of the admin state.
	 *
	 * setAdminStateValue - The function used to set the admin state.
	 *
	 * @param {object} - {manageUsers: SiteUser[], manageGroups: SiteGroup[], manageDiscussions: SiteDiscussion[], manageFeeds: SiteFeed[]}
	 *
	 * manageUsers - The list of users to be managed.
	 *
	 * manageGroups - The list of groups to be managed.
	 *
	 * manageDiscussions - The list of discussions to be managed.
	 *
	 * manageFeeds - The list of feeds to be managed.
	 */
	const [adminStateValue, setAdminStateValue] = useRecoilState(adminState);
	/**
	 * adminModalStateValue - The current value of the admin modal state.
	 *
	 * setAdminModalStateValue - The function used to set the admin modal state.
	 *
	 * @param {object} - {isOpen: boolean, modalType: string, modalProps: object}
	 *
	 * isOpen - The boolean value that determines if the modal is open or not.
	 *
	 * modalType - The type of modal to be opened.
	 *
	 * modalProps - The props to be passed to the modal.
	 */
	const [adminModalStateValue, setAdminModalStateValue] =
		useRecoilState(adminModalState);

	/**
	 * createNewUsers
	 *
	 * This function is used to create new users.
	 *
	 * This function will create a new user in the admin state and in the database.
	 * It will send a request to the API to create a new account in firebase account.
	 * After creating an account in firebase, it will send another request to the API to create a new user document in the database.
	 * After creating a new user, it will then add the new user to the admin state.
	 *
	 * @param {NewUserType[]} newUsers - The list of new users to be created.
	 */
	const createNewUsers = async (newUsers: NewUserType[]) => {
		try {
			/**
			 * newAdminStateUsers - The list of new users to be added to the admin state.
			 *
			 * This list will be used to add the new users to the admin state.
			 *
			 * @type {SiteUser[]}
			 */
			const newAdminStateUsers: SiteUser[] = [];

			/**
			 * This will loop through the list of new users and create a new user in the database.
			 * This will create a new user in the database and add the new user to the admin state.
			 */
			await Promise.all(
				/**
				 * This will loop through the list of new users.
				 */
				newUsers.map(async (newUser) => {
					/**
					 * This will try to create a new user in the database.
					 * This will send a request to the API to create a new account in firebase account.
					 * This will send another request to the API to create a new user document in the database.
					 * This will then add the new user to the admin state.
					 *
					 * If an error occurs, it will catch the error and log it to the console.
					 */
					try {
						/**
						 * email - The email of the new user.
						 * password - The password of the new user.
						 */
						const { email, password } = newUser;

						/**
						 * This will try to create a new user in the database.
						 * This will send a request to the API to create a new account in firebase account.
						 * This will send another request to the API to create a new user document in the database.
						 * This will then add the new user to the admin state.
						 *
						 * If an error occurs, it will catch the error and log it to the console.
						 */
						try {
							/**
							 * This will send a request to the API to create a new account in firebase account.
							 * If the request is successful, it will get the user id of the new user returned by the request sent.
							 */
							await axios
								.post(apiConfig.apiEndpoint + "admin/manage/account/account", {
									newUserEmail: email,
									newUserPassword: password,
									postPrivateKey: apiConfig.privateKey,
								})
								.then(async (res) => {
									/**
									 * userId - The user id of the new user.
									 */
									const { userId } = res.data;

									/**
									 * This date will be used to set the createdAt and updatedAt fields of the new user.
									 */
									const date = new Date();

									/**
									 * If a user id is returned by the request sent, it will create a new user document in the database.
									 *
									 * If a user id is not returned by the request sent, it will log an error to the console.
									 */
									if (userId) {
										/**
										 * newUserDoc - The new user document to be created in the database.
										 *
										 * This will be used to create a new user document in the database.
										 */
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

										/**
										 * This will send a request to the API to create a new user document in the database.
										 *
										 * If the request is successful, it will get the new user returned by the request sent.
										 *
										 * If the request is not successful, it will log an error to the console.
										 */
										const newUserData = await axios
											.post(apiConfig.apiEndpoint + "user/user", {
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

										/**
										 * This will add the new user to the list of new users.
										 */
										newAdminStateUsers.push({
											...newUserData,
										} as SiteUser);
									} else {
										console.log("API: Creating Account Error: ", newUser.email);
										throw new Error(
											"API: Creating Account Error: " + newUser.email
										);
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

			/**
			 * This will add the new users to the admin state.
			 */
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
					.delete(apiConfig.apiEndpoint + "admin/manage/account/account", {
						data: {
							deleteUserId: userId,
							deletePrivateKey: apiConfig.privateKey,
						},
					})
					.then(async (res) => {
						const { isDeleted } = res.data;
						if (isDeleted) {
							await axios.delete(apiConfig.apiEndpoint + "user/user", {
								data: {
									userId,
								},
							});

							axios.delete(
								apiConfig.apiEndpoint + "user/image/profile-photos",
								{
									data: {
										deleteUserId: userId,
									},
								}
							);

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
				await axios.delete(
					apiConfig.apiEndpoint + "admin/manage/account/account",
					{
						data: {
							deleteUserId: userId,
							deletePrivateKey: apiConfig.privateKey,
						},
					}
				);
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
				.get(apiConfig.apiEndpoint + "admin/manage/user/users", {
					params: {
						getFromDate: lastUser?.createdAt,
						getPrivateKey: apiConfig.privateKey,
						getUserLimit: userLimit,
					},
				})
				.then((response) => {
					return response.data.users;
				})
				.catch((error: any) => {
					console.log("API: Fetching Users Error!: ", error.message);
				});

			if (usersData.length) {
				setAdminStateValue((prev) => ({
					...prev,
					manageUsers: [...prev.manageUsers, ...usersData] as SiteUser[],
				}));
			} else {
				throw new Error("No more users to fetch!");
			}
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
