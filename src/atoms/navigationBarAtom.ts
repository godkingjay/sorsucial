import { atom } from "recoil";

export interface NavigationBarState {
	userDropdown: {
		open: boolean;
	};
}

export const defaultNavigationBarState: NavigationBarState = {
	userDropdown: {
		open: false,
	},
};

export const navigationBarState = atom({
	key: "navigationBarState",
	default: defaultNavigationBarState,
});
