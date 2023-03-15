import { atom } from "recoil";

export interface NavigationBarState {
	directoryDropdown: {
		open: boolean;
	};
	menuDropdown: {
		open: boolean;
	};
	userDropdown: {
		open: boolean;
	};
	pageLeftSidebar: {
		open: boolean;
		current: "" | "admin" | "feeds" | "discussions" | "groups" | "none";
	};
}

export const defaultNavigationBarState: NavigationBarState = {
	directoryDropdown: {
		open: false,
	},
	menuDropdown: {
		open: false,
	},
	userDropdown: {
		open: false,
	},
	pageLeftSidebar: {
		open: false,
		current: "",
	},
};

export const navigationBarState = atom({
	key: "navigationBarState",
	default: defaultNavigationBarState,
});
