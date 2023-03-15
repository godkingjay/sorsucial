import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { UserState } from "@/atoms/userAtom";
import React from "react";
import { SetterOrUpdater } from "recoil";
import UserDropdown from "./RightNav/UserDropdown";
import MenuDropdown from "./RightNav/MenuDropdown";

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
	const handleMenuDropdown = () => {
		setNavigationBarStateValue((prev) => ({
			...prev,
			directoryDropdown: {
				...prev.directoryDropdown,
				open: false,
			},
			menuDropdown: {
				...prev.menuDropdown,
				open: !prev.menuDropdown.open,
			},
			userDropdown: {
				...prev.userDropdown,
				open: false,
			},
		}));
	};

	const handleUserDropdown = () => {
		setNavigationBarStateValue((prev) => ({
			...prev,
			directoryDropdown: {
				...prev.directoryDropdown,
				open: false,
			},
			menuDropdown: {
				...prev.menuDropdown,
				open: false,
			},
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
			<div className="flex flex-row items-center h-full gap-x-2">
				<UserDropdown
					userStateValue={userStateValue}
					navigationBarStateValue={navigationBarStateValue}
					handleUserDropdown={handleUserDropdown}
					handleLogOutUser={handleLogOutUser}
				/>
				<MenuDropdown
					userStateValue={userStateValue}
					navigationBarStateValue={navigationBarStateValue}
					handleMenuDropdown={handleMenuDropdown}
				/>
			</div>
		</div>
	);
};

export default RightNav;
