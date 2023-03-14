import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { UserState } from "@/atoms/userAtom";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { SetterOrUpdater } from "recoil";
import { GoSignOut } from "react-icons/go";
import { IoSettingsSharp } from "react-icons/io5";

type RightNavProps = {
	userStateValue: UserState;
	navigationBarStateValue: NavigationBarState;
	setNavigationBarStateValue: SetterOrUpdater<NavigationBarState>;
	logOutUser: () => void;
};

const RightNav: React.FC<RightNavProps> = ({
	userStateValue,
	navigationBarStateValue,
	setNavigationBarStateValue,
	logOutUser,
}) => {
	const handleUserDropdown = () => {
		setNavigationBarStateValue((prev) => ({
			...prev,
			userDropdown: {
				...prev.userDropdown,
				open: !prev.userDropdown.open,
			},
		}));
	};

	const handleLogOutUser = () => {
		try {
			logOutUser();
		} catch (error: any) {
			console.log("Loggout Error!");
		}
	};

	return (
		<div className="h-full p-2 px-4">
			<div className="flex flex-row items-center h-full">
				<div className="h-full flex flex-row items-center">
					<button
						type="button"
						title={`${userStateValue.user.firstName} ${userStateValue.user.lastName}`}
						className="h-11 w-1h-11 rounded-full bg-gray-100 text-gray-400"
						onClick={handleUserDropdown}
					>
						{userStateValue.user.imageURL ? (
							<Image
								src={userStateValue.user.imageURL}
								alt="User Profile Picture"
								width={32}
								height={32}
								loading="lazy"
								className="rounded-full h-full w-full"
							/>
						) : userStateValue.user.gender ? (
							<></>
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
											<></>
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
			</div>
		</div>
	);
};

export default RightNav;
