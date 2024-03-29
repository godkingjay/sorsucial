import { AdminModalState } from "@/atoms/modalAtom";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { SetterOrUpdater } from "recoil";
import AddNewUserTab from "./AddUserModalTabs/AddNewUserTab";
import AddBulkUserTab from "./AddUserModalTabs/AddBulkUserTab";
import AddImportUserTab from "./AddUserModalTabs/AddImportUserTab";
import AddUserListTab from "./AddUserModalTabs/AddUserListTab";
import { BiSend } from "react-icons/bi";
import { FiLoader } from "react-icons/fi";
import { SiteUser } from "@/lib/interfaces/user";

type AddUserModal = {
	adminModalStateValue: AdminModalState;
	setAdminModalStateValue: SetterOrUpdater<AdminModalState>;
	checkUserEmailExists: (string: string) => Promise<boolean>;
	createNewUsers: (newUsers: NewUserType[]) => Promise<void>;
};

export interface NewUserType {
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	middleName?: string;
	roles?: SiteUser["roles"];
	profilePhoto?: {
		name?: string;
		url?: string;
		size?: number;
		type?: string;
	} | null;
	birthdate?: Date;
	gender?: "male" | "female" | "other" | "none";
	streetAddress?: string;
	barangay?: string;
	cityOrMunicipality?: string;
	stateOrProvince?: string;
}

export interface NewUsersFormType {
	users: NewUserType[];
}

const AddUserModal: React.FC<AddUserModal> = ({
	adminModalStateValue,
	setAdminModalStateValue,
	checkUserEmailExists,
	createNewUsers,
}) => {
	const [newUsersForm, setNewUsersForm] = useState<NewUsersFormType>({
		users: [],
	});
	const [addingUsers, setAddingUsers] = useState(false);

	const handleAddUsersSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setAddingUsers(true);
		try {
			if (newUsersForm.users.length > 0) {
				await createNewUsers(newUsersForm.users)
					.then(() => {
						setNewUsersForm({
							users: [],
						});
					})
					.catch((error: any) => {
						console.log("Hook: Create New Users Error: ", error.message);
					});
			} else {
				alert("No users to add!");
			}
		} catch (error: any) {
			console.log("Adding Users Error: ", error.message);
		}
		setAddingUsers(false);
	};

	const handleClose = () => {
		setAdminModalStateValue((prev) => ({
			...prev,
			addUser: {
				...prev.addUser,
				open: false,
			},
		}));
	};

	const handleTabChange = (e: React.MouseEvent<HTMLButtonElement>) => {
		const name = e.currentTarget.name as AdminModalState["addUser"]["tab"];

		setAdminModalStateValue((prev) => ({
			...prev,
			addUser: {
				...prev.addUser,
				tab: name,
			},
		}));
	};

	const handleRemoveUserFromList = (email: string) => {
		setNewUsersForm((prev) => ({
			...prev,
			users: prev.users.filter((user) => user.email !== email),
		}));
	};

	const addNewUser = (newUser: NewUserType) => {
		if (!newUsersForm.users.find((user) => user.email === newUser.email)) {
			setNewUsersForm((prev) => ({
				...prev,
				users: [...prev.users, newUser],
			}));
		}
	};

	return (
		<div className="fixed w-full h-full bg-black bg-opacity-25 z-[1000] flex flex-col items-center px-8 py-16 overflow-y-auto scroll-y-style overflow-x-hidden">
			<div className="modal-container !max-w-lg">
				<div className="bg-cyan-500 py-4 px-2 w-full rounded-t-xl flex flex-row justify-between items-center">
					<p className="font-bold text-lg text-white pl-2">Add New User</p>
					<button
						type="button"
						title="Close"
						className="h-8 w-8 aspect-square rounded-full p-1 text-white hover:text-cyan-800 focus:text-cyan-800"
						onClick={handleClose}
					>
						<IoClose className="h-full w-full" />
					</button>
				</div>
				<div className="w-full flex flex-col">
					<ul className="admin-modal-new-user-tabs">
						<li>
							<button
								type="button"
								title="New User"
								name="single"
								className="admin-modal-new-user-tab !border-green-500 !text-green-500 hover:bg-green-500 hover:!text-white focus:bg-green-500 focus:!text-white data-[active=true]:bg-green-500 data-[active=true]:!text-white"
								data-active={
									adminModalStateValue.addUser.tab === "single" ? true : false
								}
								onClick={handleTabChange}
							>
								New User
							</button>
						</li>
						{/* <li>
							<button
								type="button"
								title="Bulk Add"
								name="bulk"
								className="admin-modal-new-user-tab !border-blue-500 !text-blue-500 hover:bg-blue-500 hover:!text-white focus:bg-blue-500 focus:!text-white data-[active=true]:bg-blue-500 data-[active=true]:!text-white"
								data-active={
									adminModalStateValue.addUser.tab === "bulk" ? true : false
								}
								onClick={handleTabChange}
							>
								Bulk Add
							</button>
						</li>
						<li>
							<button
								type="button"
								title="Import"
								name="import"
								className="admin-modal-new-user-tab !border-cyan-500 !text-cyan-500 hover:bg-cyan-500 hover:!text-white focus:bg-cyan-500 focus:!text-white data-[active=true]:bg-cyan-500 data-[active=true]:!text-white"
								data-active={
									adminModalStateValue.addUser.tab === "import" ? true : false
								}
								onClick={handleTabChange}
							>
								Import Users
							</button>
						</li> */}
						<li className="h-max w-max mx-auto">
							<div className="h-10 w-[1px] bg-black bg-opacity-10"></div>
						</li>
						<li>
							<button
								type="button"
								title="User List"
								name="list"
								className="admin-modal-new-user-tab !border-orange-500 !text-orange-500 hover:bg-orange-500 hover:!text-white focus:bg-orange-500 focus:!text-white data-[active=true]:bg-orange-500 data-[active=true]:!text-white"
								data-active={
									adminModalStateValue.addUser.tab === "list" ? true : false
								}
								onClick={handleTabChange}
							>
								User List
							</button>
						</li>
					</ul>
				</div>
				<form
					className="auth-form w-full flex flex-col p-2"
					onSubmit={handleAddUsersSubmit}
				>
					<div>
						{adminModalStateValue.addUser.tab === "single" && (
							<AddNewUserTab
								addNewUser={addNewUser}
								checkUserEmailExists={checkUserEmailExists}
							/>
						)}
						{adminModalStateValue.addUser.tab === "bulk" && <AddBulkUserTab />}
						{adminModalStateValue.addUser.tab === "import" && (
							<AddImportUserTab />
						)}
						{adminModalStateValue.addUser.tab === "list" && (
							<AddUserListTab
								newUsersForm={newUsersForm}
								handleRemoveUserFromList={handleRemoveUserFromList}
							/>
						)}
					</div>
					<div className="my-2 h-[1px] bg-black bg-opacity-20"></div>
					<div className="ml-auto">
						<button
							type="submit"
							title="Add"
							className="page-button flex flex-row items-center p-2 gap-x-2 px-4 h-max py-2 bg-logo-100 border-logo-100 hover:bg-logo-200 hover:border-logo-200 focus:bg-logo-200 focus:border-logo-200 w-24"
							disabled={addingUsers}
						>
							{!addingUsers ? (
								<>
									<div className="flex flex-col items-center">
										<p className="text-sm">Add</p>
									</div>
									<div className="h-5 w-5">
										<BiSend className="h-full w-full" />
									</div>
								</>
							) : (
								<div className="h-5 w-5 animate-spin">
									<FiLoader className="h-full w-full" />
								</div>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddUserModal;
