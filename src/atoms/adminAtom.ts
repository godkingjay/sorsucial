import { SiteUser } from "@/lib/interfaces/user";
import { atom } from "recoil";

export interface AdminState {
	manageUsers: SiteUser[];
}

export const defaultAdminState: AdminState = {
	manageUsers: [],
};

export const adminState = atom({
	key: "adminState",
	default: defaultAdminState,
});
