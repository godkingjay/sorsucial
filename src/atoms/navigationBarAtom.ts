import { atom } from "recoil";

export interface NavigationBarState {
	directoryDropdown: {
		open: boolean;
	};
	menuDropdown: {
		open: boolean;
	};
	notificationDropdown: {
		open: boolean;
	};
	userDropdown: {
		open: boolean;
	};
	pageLeftSidebar: {
		open: boolean;
		current: "" | "admin" | "feeds" | "discussions" | "groups" | "none";
	};
	adminPageNavBar: {
		current: "" | "manage-users" | "manage-groups" | "manage-requests" | "none";
	};
}

export const defaultNavigationBarState: NavigationBarState = {
	directoryDropdown: {
		open: false,
	},
	menuDropdown: {
		open: false,
	},
	notificationDropdown: {
		open: false,
	},
	userDropdown: {
		open: false,
	},
	pageLeftSidebar: {
		open: false,
		current: "",
	},
	adminPageNavBar: {
		current: "",
	},
};

export const navigationBarState = atom({
	key: "navigationBarState",
	default: defaultNavigationBarState,
});
