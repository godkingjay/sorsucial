import { SiteUser } from "@/lib/interfaces/user";
import { atom } from "recoil";

export interface UserState {
	user: SiteUser;
}

export const defaultSiteUser: SiteUser = {
	uid: "",
	firstName: "",
	lastName: "",
	email: "",
	isFirstLogin: true,
	role: "user",
	numberOfConnections: 0,
	numberOfFollowers: 0,
	createdAt: null,
};

export const defaultUserState: UserState = {
	user: defaultSiteUser,
};

export const userState = atom<UserState>({
	key: "userState",
	default: defaultUserState,
});
