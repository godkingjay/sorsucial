import {
	DiscussionVote,
	Reply,
	ReplyVote,
	SiteDiscussion,
} from "@/lib/interfaces/discussion";
import { SiteUser } from "@/lib/interfaces/user";
import { atom } from "recoil";

export interface DiscussionReplyData {
	reply: Reply;
	creator: SiteUser | null;
	userReplyVote: ReplyVote | null;
}

export interface DiscussionData {
	discussion: SiteDiscussion;
	creator: SiteUser | null;
	userVote: DiscussionVote | null;
	discussionReplies: DiscussionReplyData[];
}

export interface DiscussionState {
	discussions: DiscussionData[];
	currentDiscussion: DiscussionData | null;
}

export const defaultDiscussionState: DiscussionState = {
	discussions: [],
	currentDiscussion: null,
};

export const discussionState = atom<DiscussionState>({
	key: "discussionState",
	default: defaultDiscussionState,
});
