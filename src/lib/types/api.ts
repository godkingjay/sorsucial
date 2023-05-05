import { SiteDiscussion } from "../interfaces/discussion";
import { SiteGroup } from "../interfaces/group";
import { SitePost } from "../interfaces/post";
import { SiteUser } from "../interfaces/user";

export type APIEndpointUsersParams = {
	apiKey: string;
	match: string;
	groupId?: string;
	roles: SiteUser["roles"];
	gender?: SiteUser["gender"];
	stateOrProvince?: string;
	cityOrMunicipality?: string;
	barangay?: string;
	streetAddress?: string;
	lastIndex?: string | number;
	fromConnections?: string | number;
	fromFollowers?: string | number;
	fromDate?: string | Date;
	sortBy: QueryUsersSortBy;
	limit?: string | number;
};

export type APIEndpointPostsParams = {
	apiKey: string;
	userId: string;
	postType: SitePost["postType"];
	privacy: SitePost["privacy"];
	groupId?: string;
	tags?: string;
	creatorId?: string;
	creator?: string;
	lastIndex?: string | number;
	fromLikes?: string | number;
	fromComments?: string | number;
	fromDate?: string | Date;
	sortBy: QueryPostsSortBy;
	limit?: string | number;
};

export type APIEndpointDiscussionsParams = {
	apiKey: string;
	userId: string;
	discussionType: SiteDiscussion["discussionType"];
	privacy: SiteDiscussion["privacy"];
	groupId?: string;
	tags?: string;
	creatorId?: string;
	creator?: string;
	isOpen?: string | boolean;
	lastIndex?: string | number;
	fromVotes?: string | number;
	fromUpVotes?: string | number;
	fromDownVotes?: string | number;
	fromReplies?: string | number;
	fromDate?: string | Date;
	sortBy: QueryDiscussionsSortBy;
	limit?: string | number;
};

export type APIEndpointGroupsParams = {
	apiKey: string;
	userId: string;
	privacy: SiteGroup["privacy"];
	tags?: string;
	creatorId?: string;
	creator?: string;
	lastIndex?: string | number;
	fromMembers?: string | number;
	fromPosts?: string | number;
	fromDiscussions?: string | number;
	fromDate?: string | Date;
	sortBy: QueryGroupsSortBy;
	limit?: string | number;
};

export type QueryUsersSortBy =
	| "name-first-asc"
	| "name-first-desc"
	| "name-last-asc"
	| "name-last-desc"
	| "latest"
	| "oldest"
	| "last-online-asc"
	| "last-online-desc"
	| "top-connection-asc"
	| "top-connection-desc"
	| "top-follow-asc"
	| "top-follow-desc"
	| "rank-today-asc"
	| "rank-today-desc"
	| "rank-week-asc"
	| "rank-week-desc"
	| "rank-month-asc"
	| "rank-month-desc"
	| "rank-year-asc"
	| "rank-year-desc"
	| "top-rank-asc"
	| "top-rank-desc"
	| "newest";

export type QueryPostsSortBy =
	| "name-asc"
	| "name-desc"
	| "latest"
	| "oldest"
	| "likes-asc"
	| "likes-desc"
	| "comments-asc"
	| "comments-desc"
	| "top-today-asc"
	| "top-today-desc"
	| "top-week-asc"
	| "top-week-desc"
	| "top-month-asc"
	| "top-month-desc"
	| "top-year-asc"
	| "top-year-desc"
	| "rank-today-asc"
	| "rank-today-desc"
	| "rank-week-asc"
	| "rank-week-desc"
	| "rank-month-asc"
	| "rank-month-desc"
	| "rank-year-asc"
	| "rank-year-desc"
	| "top-rank-asc"
	| "top-rank-desc"
	| "newest";

export type QueryDiscussionsSortBy =
	| "name-asc"
	| "name-desc"
	| "latest"
	| "oldest"
	| "votes-asc"
	| "votes-desc"
	| "upvotes-asc"
	| "upvotes-desc"
	| "downvotes-asc"
	| "downvotes-desc"
	| "replies-asc"
	| "replies-desc"
	| "top-today-asc"
	| "top-today-desc"
	| "top-week-asc"
	| "top-week-desc"
	| "top-month-asc"
	| "top-month-desc"
	| "top-year-asc"
	| "top-year-desc"
	| "rank-today-asc"
	| "rank-today-desc"
	| "rank-week-asc"
	| "rank-week-desc"
	| "rank-month-asc"
	| "rank-month-desc"
	| "rank-year-asc"
	| "rank-year-desc"
	| "top-rank-asc"
	| "top-rank-desc"
	| "newest";

export type QueryGroupsSortBy =
	| "name-asc"
	| "name-desc"
	| "latest"
	| "oldest"
	| "members-asc"
	| "members-desc"
	| "posts-asc"
	| "posts-desc"
	| "discussions-asc"
	| "discussions-desc"
	| "top-today-asc"
	| "top-today-desc"
	| "top-week-asc"
	| "top-week-desc"
	| "top-month-asc"
	| "top-month-desc"
	| "top-year-asc"
	| "top-year-desc"
	| "rank-today-asc"
	| "rank-today-desc"
	| "rank-week-asc"
	| "rank-week-desc"
	| "rank-month-asc"
	| "rank-month-desc"
	| "rank-year-asc"
	| "rank-year-desc"
	| "top-rank-asc"
	| "top-rank-desc"
	| "newest";
