import { SitePost } from "./../lib/interfaces/post";
import { SiteGroup } from "@/lib/interfaces/group";
import { SiteUser } from "@/lib/interfaces/user";
import { atom } from "recoil";
import { SiteDiscussion } from "@/lib/interfaces/discussion";
import { SiteUserAPI } from "@/lib/interfaces/api";

export interface UserState {
	user: SiteUser;
	userConnections: SiteUser[];
	userGroups: SiteGroup[];
	userPosts: SitePost[];
	userDiscussions: SiteDiscussion[];
	userPage: UserPageState | null;
	api?: SiteUserAPI | null;
}

export interface UserPageState {
	user: SiteUser;
	userConnections?: SiteUser[];
	userGroups?: SiteGroup[];
	userPosts?: SitePost[];
	userDiscussions?: SiteDiscussion[];
}

export const defaultSiteUser: SiteUser = {
	uid: "",
	firstName: "",
	lastName: "",
	email: "",
	isFirstLogin: true,
	roles: ["user"],
	numberOfConnections: 0,
	numberOfFollowers: 0,
	updatedAt: new Date(),
	createdAt: new Date(),
};

export const defaultUserState: UserState = {
	user: defaultSiteUser,
	userConnections: [],
	userGroups: [],
	userPosts: [],
	userDiscussions: [],
	userPage: null,
	api: null,
};

export const userState = atom<UserState>({
	key: "userState",
	default: defaultUserState,
});
