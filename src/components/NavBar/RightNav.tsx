import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { UserState } from "@/atoms/userAtom";
import React from "react";
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import UserDropdown from "./RightNav/UserDropdown";
import MenuDropdown from "./RightNav/MenuDropdown";
import {
	discussionCreationModalState,
	postCreationModalState,
} from "@/atoms/modalAtom";
import { useRouter } from "next/router";

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
	const router = useRouter();

	const setPostCreationModalStateValue = useSetRecoilState(
		postCreationModalState
	);
	const setDiscussionCreationModalStateValue = useSetRecoilState(
		discussionCreationModalState
	);

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

	const handleMenuCreateClick = (
		type: "announcement" | "post" | "discussion" | "group"
	) => {
		switch (type) {
			case "announcement": {
				router.push("/");
				setPostCreationModalStateValue((prev) => ({
					...prev,
					open: true,
					postType: "announcement",
					tab: "post",
				}));
				break;
			}

			case "post": {
				router.push("/feeds");
				setPostCreationModalStateValue((prev) => ({
					...prev,
					open: true,
					postType: "feed",
					tab: "post",
				}));
				break;
			}

			case "discussion": {
				router.push("/discussions");
				setDiscussionCreationModalStateValue((prev) => ({
					...prev,
					open: true,
					discussionType: "discussion",
					tab: "discussion",
				}));
				break;
			}

			case "group": {
				router.push("/groups");
				break;
			}

			default: {
				break;
			}
		}

		setNavigationBarStateValue((prev) => ({
			...prev,
			menuDropdown: {
				open: false,
			},
		}));
	};

	return (
		<div className="h-full p-2 px-4">
			<div className="flex flex-row items-center h-full gap-x-2">
				<MenuDropdown
					userStateValue={userStateValue}
					navigationBarStateValue={navigationBarStateValue}
					handleMenuDropdown={handleMenuDropdown}
					handleMenuCreateClick={handleMenuCreateClick}
				/>
				<UserDropdown
					userStateValue={userStateValue}
					navigationBarStateValue={navigationBarStateValue}
					handleUserDropdown={handleUserDropdown}
					handleLogOutUser={handleLogOutUser}
				/>
			</div>
		</div>
	);
};

export default RightNav;
