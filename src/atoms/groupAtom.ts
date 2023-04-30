import { GroupImage, GroupMember, SiteGroup } from "@/lib/interfaces/group";
import { SiteUser } from "@/lib/interfaces/user";
import { QueryGroupsSortBy } from "@/lib/types/api";
import { atom } from "recoil";

export interface GroupData {
	group: SiteGroup;
	creator: SiteUser | null;
	members: GroupMember[];
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
