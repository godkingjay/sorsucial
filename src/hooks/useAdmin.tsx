import { adminState } from "@/atoms/adminAtom";
import { adminModalState } from "@/atoms/modalAtom";
import { NewUserType } from "@/components/Modal/AdminModals/AddUserModal";
import { apiConfig } from "@/lib/api/apiConfig";
import { SiteUser } from "@/lib/interfaces/user";
import axios from "axios";
import { useRecoilState } from "recoil";
import useUser from "./useUser";
import { useCallback, useMemo } from "react";

/**
 * This is a TypeScript React hook that provides functions for managing users, including creating new
 * users, deleting users, and fetching users from a database.
 *
 * @returns An object containing the following properties and their respective values:
 * - adminStateValue - The current value of the admin state.
 * - setAdminStateValue - The function used to set the admin state.
 * - adminFetchUsers - This function is used to fetch users from the database.
 * - adminModalStateValue - The current value of the admin modal state.
 * - setAdminModalStateValue - The function used to set the admin modal state.
 * - createNewUsers - This function is used to create new users.
 * - deleteUser - This function is used to delete a user from the database.
 *
 * @see {@link https://reactjs.org/docs/hooks-intro.html - Introducing Hooks | React}
 * @see {@link https://reactjs.org/docs/hooks-reference.html - Hooks API Reference | React}
 * @see {@link https://legacy.reactjs.org/docs/hooks-custom.html - Custom Hook}
 */
const useAdmin = () => {
	/**
	 * This code is using the `useRecoilState` hook from the `Recoil` library to declare a state
	 * variable called `adminStateValue` and a corresponding function called `setAdminStateValue` to
	 * update the state. The `adminState` variable is likely defined elsewhere in the code and is being
	 * passed as an argument to the `useRecoilState` hook to initialize the state. This code is likely
	 * part of a React component and is used to manage the state of the component.
	 *
	 * @see {@link https://recoiljs.org/docs/api-reference/core/useRecoilState - useRecoilState}
	 */
	const [adminStateValue, setAdminStateValue] = useRecoilState(adminState);

	/**
	 * This code is using the `useRecoilState` hook from the `Recoil` library to get the current
	 * value and a function to update the value of the `adminModalState` atom. The current value is stored
	 * in the `adminModalStateValue` variable and the function to update the value is stored in the
	 * `setAdminModalStateValue` variable. This code is typically used in a React component to manage the
	 * state of a `Recoil` atom.
	 *
	 * @see {@link https://recoiljs.org/docs/api-reference/core/useRecoilState - useRecoilState}
	 */
	const [adminModalStateValue, setAdminModalStateValue] =
		useRecoilState(adminModalState);

	/**
	 * This code is using the `useUser` hook to retrieve the `userStateValue` from the user state in
	 * a TypeScript React component. It is likely that the `userStateValue` contains information about the
	 * currently logged in user.
	 *
	 * The `useUser` hook is defined in the `src\hooks\useUser.tsx` file and is used to retrieve the
	 * `userStateValue` from the user state in a TypeScript React component.
	 *
	 * @see {@link useUser}
	 */
	const { userStateValue } = useUser();

	/**
	 * This code is using the `useMemo` hook in a React functional component to memoize the
	 * `adminStateValue` and `setAdminStateValue` values. This means that the values will only be
	 * recomputed if the dependencies (in this case, `adminStateValue` and `setAdminStateValue`) change.
	 * The memoized values are then returned as an array and assigned to the `adminStateValueMemo` and
	 * `setAdminStateValueMemo` variables using array destructuring.
	 *
	 * @see {@link https://reactjs.org/docs/hooks-reference.html#usememo - useMemo}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment - Destructuring assignment}
	 */
	const [adminStateValueMemo, setAdminStateValueMemo] = useMemo(
		() => [adminStateValue, setAdminStateValue],
		[adminStateValue, setAdminStateValue]
	);

	/**
	 * The above code is using the `useMemo` hook from React to memoize the state value and state setter
	 * function for an admin modal. This means that the values will only be recomputed if the dependencies
	 * (in this case, the state value and state setter function) change. This can help improve performance
	 * by avoiding unnecessary re-renders.
	 *
	 * @see {@link https://reactjs.org/docs/hooks-reference.html#usememo - useMemo}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment - Destructuring assignment}
	 */
	const [adminModalStateValueMemo, setAdminModalStateValueMemo] = useMemo(
		() => [adminModalStateValue, setAdminModalStateValue],
		[adminModalStateValue, setAdminModalStateValue]
	);

	/**
	 * This code is a TypeScript React function that creates new users in a database and adds them to
	 * the admin state. It takes in an array of new users as an argument and uses Axios to send requests
	 * to an API to create new accounts and user documents in the database. It then adds the new users to
	 * the admin state using the setAdminStateValueMemo function. The function is wrapped in a useCallback
	 * hook and uses async/await and Promise.all to handle asynchronous operations.
	 *
	 * @param newUsers - The list of new users to be added to the admin state.
	 *
	 * @returns This function does not return anything.
	 *
	 * @see {@link NewUserType}
	 * @see {@link https://reactjs.org/docs/hooks-reference.html#usecallback - useCallback}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function - async/await}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all - Promise.all}
	 * @see {@link axios}
	 */
	const createNewUsers = useCallback(
		async (newUsers: NewUserType[]) => {
			try {
				/**
				 * This code is declaring a new constant variable named "newAdminStateUsers" which is an array
				 * of objects of type "SiteUser". The array is currently empty. This code is written in TypeScript
				 * and is likely used in a React application.
				 *
				 * @see {@link SiteUser}
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
									.post(apiConfig.apiEndpoint + "/admin/manage/accounts/", {
										email: email,
										password: password,
										privateKey: apiConfig.privateKey,
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
												.post(apiConfig.apiEndpoint + "/users/", {
													apiKey: userStateValue.api?.keys[0].key,
													privateKey: apiConfig.privateKey,
													userData: newUserDoc,
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
											console.log(
												"API: Creating Account Error: ",
												newUser.email
											);
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
				setAdminStateValueMemo((prev) => ({
					...prev,
					manageUsers: [...newAdminStateUsers, ...prev.manageUsers],
				}));
			} catch (error: any) {
				console.log("Mongo: Creating New Users Error!: ", error.message);
			}
		},
		[setAdminStateValueMemo, userStateValue.api?.keys]
	);

	/**
	 * This will delete a user from the database.
	 *
	 * This will send a request to the API to delete the user account in firebase.
	 *
	 * This will send another request to the API to delete the user document in the database.
	 *
	 * This will then delete the user from the admin state.
	 *
	 * If an error occurs, it will catch the error and log it to the console.
	 *
	 *  @param userId - The user id of the user to be deleted.
	 */
	const deleteUser = useCallback(
		async (userId: string) => {
			/**
			 * Try to delete the user from the database.
			 *
			 * If an error occurs, it will catch the error and log it to the console.
			 */
			try {
				/**
				 * If a user id is provided, it will send a request to the API to delete the user account in firebase.
				 *
				 * If the request is successful, it will send another request to the API to delete the user document in the database.
				 *
				 * If the request is not successful, it will log an error to the console.
				 */
				if (userId) {
					/**
					 * This will send a request to the API to delete the user account in firebase.
					 *
					 * This request will return a boolean value indicating if the user was deleted.
					 *
					 * If the request is successful, it will send another request to the API to delete the user document in the database.
					 *
					 * If the request is not successful, it will log an error to the console.
					 */
					await axios
						.delete(apiConfig.apiEndpoint + "/admin/manage/accounts/", {
							data: {
								privateKey: apiConfig.privateKey,
								userId: userId,
							},
						})
						.then(async (res) => {
							/**
							 * The response data from the request sent.
							 */
							const { isDeleted } = res.data;

							/**
							 * If the user was deleted, it will send another request to the API to delete the user document in the database.
							 *
							 * Else it will throw an error.
							 */
							if (isDeleted) {
								/**
								 * This will send another request to the API to delete the user document in the database.
								 */
								await axios.delete(apiConfig.apiEndpoint + "/users/", {
									data: {
										apiKey: userStateValue.api?.keys[0].key,
										privateKey: apiConfig.privateKey,
										userId,
									},
								});

								/**
								 * This will send another request to the API to delete the user's profile photo.
								 */
								await axios.delete(
									apiConfig.apiEndpoint + "/users/images/profile-photos",
									{
										data: {
											deleteUserId: userId,
										},
									}
								);

								/**
								 * This will delete the user from the admin state.
								 */
								setAdminStateValueMemo((prev) => ({
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
					throw new Error(
						"There is no user id to delete the user from the database and auth system of firebase."
					);
				}
			} catch (error: any) {
				console.log("Hook: Deleting User Error: ", error.message);
			}
		},
		[setAdminStateValueMemo, userStateValue.api?.keys]
	);

	/**
	 * This will fetch the users from the database.
	 *
	 * This will send a request to the API to fetch the users from the database.
	 *
	 * This will then add the users to the admin state.
	 *
	 * If an error occurs, it will catch the error and log it to the console.
	 *
	 * @param userLimit - The number of users to fetch from the database.
	 */
	const adminFetchUsers = useCallback(
		async ({ userLimit = 25 }: { userLimit?: number }) => {
			/**
			 * Try to fetch the users from the database.
			 *
			 * If an error occurs, it will catch the error and log it to the console.
			 */
			try {
				/**
				 * The last user in the admin state.
				 *
				 * This will be used to get the users from the database that were created after the last user in the admin state.
				 */
				const lastUser = adminStateValue.manageUsers.length
					? adminStateValue.manageUsers[adminStateValue.manageUsers.length - 1]
					: null;

				/**
				 * This will send a request to the API to fetch the users from the database.
				 *
				 * This will return an array of users.
				 *
				 * If the request is successful, it will add the users to the admin state.
				 *
				 * If the request is not successful, it will log an error to the console.
				 */
				const usersData: SiteUser[] = await axios
					.get(apiConfig.apiEndpoint + "/admin/manage/users/users", {
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

				/**
				 * If there are users to add to the admin state, it will add the users to the admin state.
				 *
				 * Else it will throw an error.
				 */
				if (usersData.length) {
					setAdminStateValueMemo((prev) => ({
						...prev,
						manageUsers: [...prev.manageUsers, ...usersData] as SiteUser[],
					}));
				} else {
					throw new Error("No more users to fetch!");
				}
			} catch (error: any) {
				console.log("Mongo: Fetching Users Error!: ", error.message);
			}
		},
		[adminStateValue.manageUsers, setAdminStateValueMemo]
	);

	return {
		adminStateValue: adminStateValueMemo,
		setAdminStateValue: setAdminStateValueMemo,
		adminFetchUsers,
		adminModalStateValue: adminModalStateValueMemo,
		setAdminModalStateValue: setAdminModalStateValueMemo,
		createNewUsers,
		deleteUser,
	};
};

export default useAdmin;
