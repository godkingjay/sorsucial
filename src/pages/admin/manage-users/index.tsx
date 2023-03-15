import useAdmin from "@/hooks/useAdmin";
import React from "react";
import { TiUserAdd } from "react-icons/ti";

type AdminManageUsersPageProps = {};

const AdminManageUsersPage: React.FC<AdminManageUsersPageProps> = () => {
	const { adminStateValue, adminFetchUsers } = useAdmin();

	return (
		<div className="flex flex-col gap-y-6 py-4">
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
								>
									<div className="h-6 w-6 aspect-square text-white">
										<TiUserAdd className="h-full w-full" />
									</div>
									<div className="h-full flex flex-row items-center flex-1">
										<p className="text-white text-xs font-bold">Add New User</p>
									</div>
								</button>
							</div>
						</div>
					</div>
					<div className="flex flex-col"></div>
				</div>
			</div>
		</div>
	);
};

export default AdminManageUsersPage;
