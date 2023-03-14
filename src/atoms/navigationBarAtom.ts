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
};

export const navigationBarState = atom({
	key: "navigationBarState",
	default: defaultNavigationBarState,
});
