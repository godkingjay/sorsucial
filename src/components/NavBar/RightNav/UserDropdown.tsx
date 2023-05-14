import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { UserState } from "@/atoms/userAtom";
import UserIcon from "@/components/Icons/UserIcon";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";
import { FaUserCircle } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { IoSettingsSharp } from "react-icons/io5";

type UserDropdownProps = {
	userStateValue: UserState;
	navigationBarStateValue: NavigationBarState;
	handleUserDropdown: () => void;
	handleLogOutUser: () => void;
};

const UserDropdown: React.FC<UserDropdownProps> = ({
	userStateValue,
	navigationBarStateValue,
	handleUserDropdown,
	handleLogOutUser,
}) => {
	return (
		<div className="h-full flex flex-row items-center">
			<button
				type="button"
				title={`${userStateValue.user.firstName} ${userStateValue.user.lastName}`}
				className="h-11 w-11 rounded-full bg-gray-100 text-gray-300"
				onClick={handleUserDropdown}
			>
				<UserIcon
					user={userStateValue.user}
					disabled={true}
				/>
			</button>
			<div
				className="user-dropdown-wrapper !max-w-sm"
				data-open={navigationBarStateValue.userDropdown.open}
			>
				<div className="user-dropdown">
					<div className="flex flex-col gap-y-2">
						<Link
							href={`/user/${userStateValue.user.uid}`}
							className="user-dropdown-group"
							title={`${userStateValue.user.firstName} ${userStateValue.user.lastName}`}
						>
							<div className="image-container flex relative">
								{userStateValue.user.imageURL ? (
									<Image
										src={userStateValue.user.imageURL}
										alt={userStateValue.user.firstName}
										sizes="256px"
										fill
										className="image !bg-center !object-cover"
									/>
								) : (
									<FaUserCircle className="h-full w-full" />
								)}
							</div>
							<div className="label-container">
								<p className="label">{userStateValue.user.firstName}</p>
							</div>
						</Link>
						<div className="divider"></div>
						<ul className="flex flex-col">
							<li>
								<Link
									href={`/user/settings/`}
									title="Settings"
									className="user-dropdown-group"
								>
									<div className="icon-container">
										<IoSettingsSharp className="icon" />
									</div>
									<div className="label-container">
										<p className="label-2">Settings</p>
									</div>
								</Link>
							</li>
							<li>
								<button
									type="button"
									title="Log Out"
									className="user-dropdown-group log-out"
									onClick={handleLogOutUser}
								>
									<div className="icon-container">
										<GoSignOut className="icon translate-x-[10%] translate-y-[10%]" />
									</div>
									<div className="label-container">
										<p className="label-2">Log Out</p>
									</div>
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserDropdown;
