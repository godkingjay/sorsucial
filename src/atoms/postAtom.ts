import { SitePost } from "@/lib/interfaces/post";
import { SiteUser } from "@/lib/interfaces/user";
import { atom } from "recoil";

export interface PostData {
	post: SitePost;
	creator: SiteUser | null;
}

export interface PostState {
	posts: PostData[];
	currentPost: SitePost | null;
}

export const defaultPostState: PostState = {
	posts: [],
	currentPost: null,
};

export const postState = atom<PostState>({
	key: "postState",
	default: defaultPostState,
});
