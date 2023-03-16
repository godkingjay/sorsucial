import { SiteUser } from "@/lib/interfaces/user";
import { atom } from "recoil";

/**
 * This interface is used to define the structure of a user state.
 * This is the object that is stored in the recoil state.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface UserState
 * @category Interfaces
 * @see {@link SiteUser}
 *
 * ----------------------------------------------------------------
 *
 * @property {SiteUser} user - The user object.
 *
 */
export interface UserState {
	user: SiteUser;
}

/**
 * This is the default user state.
 * This is the object that is stored in the recoil state.
 * This is the default value of the recoil state.
 * This is the value of the recoil state when the user is not logged in.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @const {UserState} defaultUserState - The default user state.
 *
 * @see {@link UserState}
 */
export const defaultSiteUser: SiteUser = {
	uid: "",
	firstName: "",
	lastName: "",
	email: "",
	isFirstLogin: true,
	roles: ["user"],
	numberOfConnections: 0,
	numberOfFollowers: 0,
	createdAt: null,
};

/**
 * This is the default user state.
 * This is the object that is stored in the recoil state.
 * This is the default value of the recoil state.
 * This is the value of the recoil state when the user is not logged in.
 */
export const defaultUserState: UserState = {
	user: defaultSiteUser,
};

/**
 * This is the user state.
 * This is the object that is stored in the recoil state.
 *
 * ----------------------------------------------------------------
 *
 * @const {RecoilState<UserState>} userState - The user state.
 *
 * @see {@link UserState}
 */
export const userState = atom<UserState>({
	key: "userState",
	default: defaultUserState,
});
