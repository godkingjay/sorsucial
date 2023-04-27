import { GroupImage, GroupMember, SiteGroup } from "@/lib/interfaces/group";
import { SiteUser } from "@/lib/interfaces/user";
import { atom } from "recoil";

export interface GroupData {
	group: SiteGroup;
	creator: SiteUser | null;
	members: GroupMember[];
	images: GroupImage[];
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
