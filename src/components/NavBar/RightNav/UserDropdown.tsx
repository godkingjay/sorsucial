import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { UserState } from "@/atoms/userAtom";
import Image from "next/image";
import Link from "next/link";
import React from "react";
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
				className="h-11 w-11 rounded-full bg-gray-100 text-gray-400"
				onClick={handleUserDropdown}
			>
				{userStateValue.user.imageURL ? (
					<Image
						src={userStateValue.user.imageURL}
						alt="User Profile Picture"
						width={48}
						height={48}
						loading="lazy"
						className="rounded-full h-full w-full"
					/>
				) : (
					<FaUserCircle className="h-full w-full" />
				)}
			</button>
			<div
				className={`
						absolute w-full top-0 px-4 max-w-sm right-0 duration-75 max-h-screen pt-14 pb-4 flex flex-col pointer-events-none
						${
							navigationBarStateValue.userDropdown.open
								? " "
								: " translate-y-[-8px] opacity-0 [&_*]:pointer-events-none"
						}
					`}
			>
				<div className="user-dropdown !max-h-[384px]">
					<div className="flex flex-col gap-y-2">
						<Link
							href={"/"}
							className="user-dropdown-group"
							title={`${userStateValue.user.firstName} ${userStateValue.user.lastName}`}
						>
							<div className="image-container">
								{userStateValue.user.imageURL ? (
									<Image
										src={userStateValue.user.imageURL}
										alt={userStateValue.user.firstName}
										height={256}
										width={256}
										className="image"
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
									href={"/"}
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
