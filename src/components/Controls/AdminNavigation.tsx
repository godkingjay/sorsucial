import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { GoRequestChanges } from "react-icons/go";
import { HiUserGroup } from "react-icons/hi";
import { MdSpaceDashboard } from "react-icons/md";

type AdminNavigationProps = {};

const AdminNavigation: React.FC<AdminNavigationProps> = () => {
	return (
		<div className="sticky top-14">
			<div className="h-14 w-full shadow-md bg-slate-700 overflow-x-auto scroll-x-style">
				<ul className="h-full w-max flex flex-row items-center p-2 gap-x-1">
					<li>
						<button
							type="button"
							title="Dashboard"
							className="flex flex-row items-center p-2 text-white gap-x-3 duration-200 hover:bg-slate-600 hover:rounded-md"
						>
							<div className="h-6 w-6 aspect-square">
								<MdSpaceDashboard className="h-full w-full" />
							</div>
							<div className="flex flex-1 flex-row h-full items-center">
								<p className="font-semibold text-sm">Dashboard</p>
							</div>
						</button>
					</li>
					<li className="h-full">
						<div className="h-full w-[1px] bg-white bg-opacity-20 mx-2"></div>
					</li>
					<li>
						<button
							type="button"
							title="Users"
							className="flex flex-row items-center p-2 text-white gap-x-3 duration-200 hover:bg-slate-600 hover:rounded-md"
						>
							<div className="h-6 w-6 aspect-square">
								<FaUserCircle className="h-full w-full" />
							</div>
							<div className="flex flex-1 flex-row h-full items-center">
								<p className="font-semibold text-sm">Users</p>
							</div>
						</button>
					</li>
					<li>
						<button
							type="button"
							title="Groups"
							className="flex flex-row items-center p-2 text-white gap-x-3 duration-200 hover:bg-slate-600 hover:rounded-md"
						>
							<div className="h-6 w-6 aspect-square">
								<HiUserGroup className="h-full w-full" />
							</div>
							<div className="flex flex-1 flex-row h-full items-center">
								<p className="font-semibold text-sm">Groups</p>
							</div>
						</button>
					</li>
					<li>
						<button
							type="button"
							title="Requests"
							className="flex flex-row items-center p-2 text-white gap-x-3 duration-200 hover:bg-slate-600 hover:rounded-md"
						>
							<div className="h-6 w-6 aspect-square">
								<GoRequestChanges className="h-full w-full" />
							</div>
							<div className="flex flex-1 flex-row h-full items-center">
								<p className="font-semibold text-sm">Requests</p>
							</div>
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default AdminNavigation;
