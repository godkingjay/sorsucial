import { firestore } from "@/firebase/clientApp";
import useAdmin from "@/hooks/useAdmin";
import useUser from "@/hooks/useUser";
import { collection, doc, getDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";

type AdminManageUsersPageProps = {};

const AdminManageUsersPage: React.FC<AdminManageUsersPageProps> = () => {
	const {
		adminStateValue,
		setAdminStateValue,
		adminFetchUsers,
		setAdminModalStateValue,
		deleteUser,
	} = useAdmin();
	const { userStateValue } = useUser();
	const [fetchingUsers, setFetchingUsers] = useState(false);
	const [deletingUser, setDeletingUser] = useState("");
	const fetchingUsersMounted = useRef(false);

	const handleFetchUsers = useCallback(async () => {
		setFetchingUsers(true);
		try {
			await adminFetchUsers({});
		} catch (error: any) {
			console.log("Fetching Users Error!: ", error.message);
			throw error;
		}
		setFetchingUsers(false);
	}, [adminFetchUsers]);

	const handleAddNewUser = () => {
		setAdminModalStateValue((prev) => ({
			...prev,
			addUser: {
				...prev.addUser,
				open: true,
			},
		}));
	};

	const handleDeleteUser = useCallback(async (userId: string) => {
		setDeletingUser(userId);
		try {
			await deleteUser(userId).catch((error: any) => {
				console.log("Hook: Delete User Error: ", error.message);
			});
		} catch (error: any) {
			console.log("Deleting User Error: ", error.message);
		}
		setDeletingUser("");
	}, []);

	useEffect(() => {
		if (
			!fetchingUsersMounted.current &&
			adminStateValue.manageUsers.length === 0
		) {
			fetchingUsersMounted.current = true;
			handleFetchUsers();
		}
	}, []);

	return (
		<div className="flex flex-col">
			<div className="w-max min-w-full flex flex-col gap-y-6 py-4">
				<div className="flex flex-col px-4">
					<div className="flex flex-col shadow-around-sm bg-white rounded-md">
						<div className="w-full p-4 bg-cyan-700 rounded-t-md">
							<p className="font-bold text-xl text-white">Users</p>
						</div>
						<div>
							<p>Item</p>
						</div>
					</div>
				</div>
				<div className="w-full px-4">
					<div className="flex flex-col shadow-around-sm bg-white rounded-md">
						<div className="w-full">
							<div className="w-full">
								<div className="flex flex-row items-center h-20 p-4">
									<button
										type="button"
										title="Add New User"
										className="flex flex-row items-center h-10 p-2 bg-green-500 rounded-md gap-x-2 hover:bg-green-600"
										onClick={handleAddNewUser}
									>
										<div className="h-6 w-6 aspect-square text-white">
											<TiUserAdd className="h-full w-full" />
										</div>
										<div className="h-full flex flex-row items-center flex-1">
											<p className="text-white text-xs font-bold">
												Add New User
											</p>
										</div>
									</button>
								</div>
							</div>
						</div>
						<div className="w-full h-[1px] bg-gray-500 bg-opacity-10"></div>
						<div className="flex flex-col p-4 flex-1">
							<div className="flex flex-col">
								<table className="manage-users-table">
									<tbody className="manage-users-content">
										<tr>
											<td className="index">#</td>
											<td className="email">Email</td>
											<td className="last-name">Last Name</td>
											<td className="first-name">First Name</td>
											<td className="roles">Roles</td>
											<td className="actions">Actions</td>
										</tr>
										{adminStateValue.manageUsers.map((user, index) => {
											return (
												<tr
													key={user.uid}
													className={
														user.uid === deletingUser ? "deleting-user" : ""
													}
												>
													<td className="index">
														<p>{index + 1}</p>
													</td>
													<td className="email">
														<p>{user.email}</p>
													</td>
													<td className="last-name">
														<p>{user.lastName}</p>
													</td>
													<td className="first-name">
														<p>{user.firstName}</p>
													</td>
													<td className="roles">
														{user.roles.map((role) => {
															return (
																<p
																	key={role}
																	className={`role role-${role}`}
																>
																	{role}
																</p>
															);
														})}
													</td>
													<td className="actions">
														<button
															type="button"
															title="Edit"
															className="action-edit action"
															disabled={user.uid === deletingUser}
														>
															<div className="icon-container">
																<FiEdit className="icon" />
															</div>
														</button>
														{user.uid !== userStateValue.user.uid &&
															!user.roles.includes("admin") && (
																<button
																	type="button"
																	title="Delete"
																	className="action-delete action"
																	onClick={() => handleDeleteUser(user.uid)}
																	disabled={user.uid === deletingUser}
																>
																	<div className="icon-container">
																		<MdDelete className="icon" />
																	</div>
																</button>
															)}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminManageUsersPage;
