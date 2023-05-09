import { GroupImage, GroupMember, SiteGroup } from "@/lib/interfaces/group";
import { SiteUser } from "@/lib/interfaces/user";
import { QueryGroupsSortBy, QueryGroupMembersSortBy } from "@/lib/types/api";
import { atom } from "recoil";

export interface GroupOptionsState {
	menu: string;
	share: string;
	memberMenu: string;
}

export const defaultGroupOptionsState: GroupOptionsState = {
	menu: "",
	share: "",
	memberMenu: "",
};

export const postOptionsState = atom<GroupOptionsState>({
	key: "postOptionsState",
	default: defaultGroupOptionsState,
});

export interface GroupMemberData {
	user: SiteUser | null;
	member: GroupMember;
	index: {
		[sortBy in QueryGroupMembersSortBy]: number;
	};
}

export interface GroupData {
	group: SiteGroup;
	creator: SiteUser | null;
	members: GroupMemberData[];
	images: GroupImage[];
	userJoin: GroupMember | null;
	groupDeleted?: boolean;
	index: {
		[sortBy in QueryGroupsSortBy]: number;
	};
}

export interface GroupState {
	groups: GroupData[];
	currentGroup: GroupData | null;
}

export const defaultGroupState: GroupState = {
	groups: [],
	currentGroup: null,
};

export const groupState = atom<GroupState>({
	key: "groupState",
	default: defaultGroupState,
});
