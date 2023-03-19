import { SitePost } from "./../lib/interfaces/post";
import { SiteGroup } from "@/lib/interfaces/group";
import { SiteUser } from "@/lib/interfaces/user";
import { atom } from "recoil";
import { SiteDiscussion } from "@/lib/interfaces/discussion";

/**
 * This interface is used to define the structure of a user state.
 * This is the object that is stored in the recoil state.
 *
 * ----------------------------------------------------------------
 *
 * @interface UserState
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {SiteUser} user - The user object.
 * @property {SiteUser[]} [userConnections] - The user connections.
 * @property {SiteGroup[]} userGroups - The user groups.
 * @property {SitePost[]} userPosts - The user posts.
 * @property {SiteDiscussion[]} userDiscussions - The user discussions.
 * @property {UserPageState | null} userPage - The user page state.
 *
 * ----------------------------------------------------------------
 *
 * @see {@link UserState}
 */
export interface UserState {
	user: SiteUser;
	userConnections: SiteUser[];
	userGroups: SiteGroup[];
	userPosts: SitePost[];
	userDiscussions: SiteDiscussion[];
	userPage: UserPageState | null;
}

/**
 * This interface is used to define the structure of a user page state.
 * This is the object that is stored in the recoil state.
 *
 * ----------------------------------------------------------------
 *
 * @interface UserPageState
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {SiteUser} user - The user object.
 * @property {SiteUser[]} [userConnections] - The user connections.
 * @property {SiteGroup[]} userGroups - The user groups.
 * @property {SitePost[]} userPosts - The user posts.
 * @property {SiteDiscussion[]} userDiscussions - The user discussions.
 *
 * ----------------------------------------------------------------
 *
 * @see {@link UserPageState}
 */
export interface UserPageState {
	user: SiteUser;
	userConnections?: SiteUser[];
	userGroups?: SiteGroup[];
	userPosts?: SitePost[];
	userDiscussions?: SiteDiscussion[];
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
	userConnections: [],
	userGroups: [],
	userPosts: [],
	userDiscussions: [],
	userPage: null,
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
