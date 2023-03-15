import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdSpaceDashboard } from "react-icons/md";
import { BsFillPersonBadgeFill } from "react-icons/bs";

type AdminPageLayoutProps = {
	children: React.ReactNode;
};

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({ children }) => {
	return (
		<div className="flex flex-col flex-1">
			<div className="sticky top-14">
				<div className="h-14 w-full shadow-md bg-slate-700">
					<ul className="h-full w-full flex flex-row items-center p-2 gap-x-1">
						<li>
							<button
								type="button"
								title="Dashboard"
								className="flex flex-row items-center p-2 text-white gap-x-2 duration-200 hover:bg-slate-600 hover:rounded-md"
							>
								<div className="h-8 w-8 aspect-square">
									<MdSpaceDashboard className="h-full w-full" />
								</div>
								<div className="flex-1 flex flex-row h-full items-center">
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
								className="flex flex-row items-center p-2 text-white gap-x-2 duration-200 hover:bg-slate-600 hover:rounded-md"
							>
								<div className="h-8 w-8 aspect-square">
									<FaUserCircle className="h-full w-full" />
								</div>
								<div className="flex-1 flex flex-row h-full items-center">
									<p className="font-semibold text-sm">Users</p>
								</div>
							</button>
						</li>
						<li>
							<button
								type="button"
								title="Groups"
								className="flex flex-row items-center p-2 text-white gap-x-2 duration-200 hover:bg-slate-600 hover:rounded-md"
							>
								<div className="h-8 w-8 aspect-square">
									<HiUserGroup className="h-full w-full" />
								</div>
								<div className="flex-1 flex flex-row h-full items-center">
									<p className="font-semibold text-sm">Groups</p>
								</div>
							</button>
						</li>
						<li>
							<button
								type="button"
								title="Requests"
								className="flex flex-row items-center p-2 text-white gap-x-2 duration-200 hover:bg-slate-600 hover:rounded-md"
							>
								<div className="h-8 w-8 aspect-square">
									<BsFillPersonBadgeFill className="h-full w-full" />
								</div>
								<div className="flex-1 flex flex-row h-full items-center">
									<p className="font-semibold text-sm">Requests</p>
								</div>
							</button>
						</li>
					</ul>
				</div>
			</div>
			<div className="flex-1 w-full">{children}</div>
		</div>
	);
};

export default AdminPageLayout;
