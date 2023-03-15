import {
	NavigationBarState,
	navigationBarState,
} from "@/atoms/navigationBarAtom";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { GoRequestChanges } from "react-icons/go";
import { HiUserGroup } from "react-icons/hi";
import { MdSpaceDashboard } from "react-icons/md";
import { SetterOrUpdater } from "recoil";

type AdminNavigationProps = {
	navigationBarStateValue: NavigationBarState;
	setNavigationBarStateValue: SetterOrUpdater<NavigationBarState>;
};

const AdminNavigation: React.FC<AdminNavigationProps> = () => {
	return (
		<div className="sticky top-14">
			<div className="admin-nav-wrapper">
				<ul className="admin-nav-container">
					<li>
						<button
							type="button"
							title="Dashboard"
							className="admin-nav-group"
						>
							<div className="icon-container">
								<MdSpaceDashboard className="icon" />
							</div>
							<div className="label-container">
								<p className="label">Dashboard</p>
							</div>
						</button>
					</li>
					<li className="divider-container">
						<div className="divider"></div>
					</li>
					<li>
						<button
							type="button"
							title="Users"
							className="admin-nav-group"
						>
							<div className="icon-container">
								<FaUserCircle className="icon" />
							</div>
							<div className="label-container">
								<p className="label">Users</p>
							</div>
						</button>
					</li>
					<li>
						<button
							type="button"
							title="Groups"
							className="admin-nav-group"
						>
							<div className="icon-container">
								<HiUserGroup className="icon" />
							</div>
							<div className="label-container">
								<p className="label">Groups</p>
							</div>
						</button>
					</li>
					<li className="divider-container">
						<div className="divider"></div>
					</li>
					<li>
						<button
							type="button"
							title="Requests"
							className="admin-nav-group"
						>
							<div className="icon-container">
								<GoRequestChanges className="icon" />
							</div>
							<div className="label-container">
								<p className="label">Requests</p>
							</div>
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default AdminNavigation;
