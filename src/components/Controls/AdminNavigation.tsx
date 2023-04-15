import { NavigationBarState } from "@/atoms/navigationBarAtom";
import Link from "next/link";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { GoRequestChanges } from "react-icons/go";
import { HiUserGroup } from "react-icons/hi";
import { MdSpaceDashboard } from "react-icons/md";

type AdminNavigationProps = {
	navigationBarStateValue: NavigationBarState;
};

const AdminNavigation: React.FC<AdminNavigationProps> = ({
	navigationBarStateValue,
}) => {
	return (
		<div className="sticky top-14 z-[500] entrance-animation-float-down">
			<div className="admin-nav-wrapper">
				<ul className="admin-nav-container">
					<li>
						<Link
							href="/admin"
							type="button"
							title="Dashboard"
							className="admin-nav-group"
							data-active={
								navigationBarStateValue.adminPageNavBar.current === ""
							}
						>
							<div className="icon-container">
								<MdSpaceDashboard className="icon" />
							</div>
							<div className="label-container">
								<p className="label">Dashboard</p>
							</div>
						</Link>
					</li>
					<li className="divider-container">
						<div className="divider"></div>
					</li>
					<li>
						<Link
							href="/admin/manage-users"
							type="button"
							title="Users"
							className="admin-nav-group"
							data-active={
								navigationBarStateValue.adminPageNavBar.current ===
								"manage-users"
							}
						>
							<div className="icon-container">
								<FaUserCircle className="icon" />
							</div>
							<div className="label-container">
								<p className="label">Users</p>
							</div>
						</Link>
					</li>
					<li>
						<Link
							href="/admin/manage-groups"
							type="button"
							title="Groups"
							className="admin-nav-group"
							data-active={
								navigationBarStateValue.adminPageNavBar.current ===
								"manage-groups"
							}
						>
							<div className="icon-container">
								<HiUserGroup className="icon" />
							</div>
							<div className="label-container">
								<p className="label">Groups</p>
							</div>
						</Link>
					</li>
					<li className="divider-container">
						<div className="divider"></div>
					</li>
					<li>
						<Link
							href="/admin/manage-requests"
							type="button"
							title="Requests"
							className="admin-nav-group"
							data-active={
								navigationBarStateValue.adminPageNavBar.current ===
								"manage-requests"
							}
						>
							<div className="icon-container">
								<GoRequestChanges className="icon" />
							</div>
							<div className="label-container">
								<p className="label">Requests</p>
							</div>
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default AdminNavigation;
