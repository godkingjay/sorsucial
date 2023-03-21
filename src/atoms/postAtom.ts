import { SitePost } from "@/lib/interfaces/post";
import { atom } from "recoil";

export interface PostState {
	posts: SitePost[];
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
