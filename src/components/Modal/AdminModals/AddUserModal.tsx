import { AdminModalState } from "@/atoms/modalAtom";
import React from "react";
import { IoClose } from "react-icons/io5";
import { SetterOrUpdater } from "recoil";

type AddUserModal = {
	adminModalStateValue: AdminModalState;
	setAdminModalStateValue: SetterOrUpdater<AdminModalState>;
};

const AddUserModal: React.FC<AddUserModal> = ({
	adminModalStateValue,
	setAdminModalStateValue,
}) => {
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

	return (
		<div className="fixed w-full h-full bg-black bg-opacity-25 z-[1000] grid place-items-center px-8 py-16 overflow-y-auto scroll-y-style">
			<div className="w-full max-w-xl bg-white flex flex-col rounded-xl shadow-around-sm pointer-events-auto">
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
				<div className="w-full">
					<ul className="flex flex-row items-center overflow-x-auto scroll-x-style p-2 gap-x-2 bg-slate-700">
						<li>
							<button
								type="button"
								title="New User"
								name="single"
								className="flex flex-row items-center h-10 p-2  gap-x-2 text-white font-semibold text-sm"
								data-active={
									adminModalStateValue.addUser.tab === "single" ? true : false
								}
								onClick={handleTabChange}
							>
								New User
							</button>
						</li>
					</ul>
				</div>
				<div className="w-full p-4"></div>
			</div>
		</div>
	);
};

export default AddUserModal;
