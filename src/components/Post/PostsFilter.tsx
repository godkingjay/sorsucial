import { PostData } from "@/atoms/postAtom";
import usePost from "@/hooks/usePost";
import { SitePost } from "@/lib/interfaces/post";
import { QueryPostsSortBy } from "@/lib/types/api";
import React, { useCallback, useEffect, useRef, useState } from "react";
import PageEnd from "../Banner/PageBanner/PageEnd";
import VisibleInViewPort from "../Events/VisibleInViewPort";
import PostCard from "./PostCard";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";
import PostCardSkeleton from "../Skeleton/Post/PostCardSkeleton";
import PostCreationListener from "./PostCreationListener";
import PageFilter, { PageFilterProps } from "../Controls/PageFilter";

type PostsFilterProps = {
	postType: SitePost["postType"];
	postCreation?: boolean;
	filter?: boolean;
	sortBy: QueryPostsSortBy;
	privacy: SitePost["privacy"];
	groupId?: string;
	creatorId?: string;
	creator?: string;
	tags?: string;
	pageEnd?: string;
	filterOptions?: PageFilterProps["filterOptions"];
};

const PostsFilter: React.FC<PostsFilterProps> = ({
	postType = "feed",
	privacy = "public",
	creatorId = undefined,
	creator = undefined,
	groupId = undefined,
	tags = undefined,
	sortBy = "latest",
	pageEnd,
	postCreation = false,
	filter = false,
	filterOptions = {
		filterType: "posts",
		options: {
			postType: false,
			privacy: false,
			creatorId: false,
			creator: false,
			groupId: false,
			tags: false,
			likes: false,
			comments: false,
			date: false,
		},
	},
}) => {
	const { userStateValue, userMounted } = useUser();
	const { postStateValue, fetchPosts } = usePost();
	const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
	const [loadingPosts, setLoadingPosts] = useState(false);
	const [firstLoadingPosts, setFirstLoadingPosts] = useState(false);
	const [endReached, setEndReached] = useState(false);
	const postsMounted = useRef(false);
	const filteredPostsLength = filteredPosts.length || -1;
	const regexCreator = new RegExp(creator || "", "i");

	const sortByIndex =
		sortBy +
		(postType ? `-${postType}` : "") +
		(privacy ? `-${privacy}` : "") +
		(groupId ? `-${groupId}` : "") +
		(creatorId ? `-${creatorId}` : "") +
		(creator ? `-${creator}` : "") +
		(tags ? `-${tags}` : "");

	const router = useRouter();
	const { userId } = router.query;

	const handleFilterPosts = useCallback(() => {
		setFilteredPosts(
			postStateValue.posts.filter(
				(post) =>
					(creatorId ? post.post.creatorId === creatorId : true) &&
					(groupId ? post.post.groupId === groupId : true) &&
					(creator
						? post.creator?.firstName.match(regexCreator) ||
						  post.creator?.lastName.match(regexCreator) ||
						  post.creator?.middleName?.match(regexCreator) ||
						  post.creator?.email.match(regexCreator)
						: true) &&
					post.post.privacy === privacy &&
					post.post.postType === postType &&
					post.index &&
					post.index[sortByIndex] !== undefined &&
					post.index[sortByIndex] >= 0
			)
		);
	}, [
		postStateValue.posts,
		creatorId,
		groupId,
		creator,
		regexCreator,
		privacy,
		postType,
		sortByIndex,
	]);

	const handleFetchPosts = useCallback(async () => {
		setLoadingPosts(true);
		try {
			const fetchedPostsLength = await fetchPosts({
				postType: postType,
				privacy: privacy,
				sortBy: sortBy,
				creatorId: creatorId,
				creator: creator,
				tags: tags,
				groupId: groupId,
			});
			if (fetchedPostsLength !== undefined) {
				setEndReached(fetchedPostsLength < 10 ? true : false);
			}
		} catch (error: any) {
			console.log("Hook: fetching posts Error: ", error.message);
		}
		setLoadingPosts(false);
	}, [creator, creatorId, fetchPosts, groupId, postType, privacy, sortBy, tags]);

	const handleFirstFetchPosts = useCallback(async () => {
		setFirstLoadingPosts(true);
		try {
			await handleFetchPosts();
		} catch (error: any) {
			console.log("First Fetch: fetching posts Error: ", error.message);
		}
		setFirstLoadingPosts(false);
	}, [handleFetchPosts]);

	useEffect(() => {
		if (userMounted) {
			if (!postsMounted.current && filteredPostsLength <= 0) {
				postsMounted.current = true;
				handleFirstFetchPosts();
			} else {
				postsMounted.current = true;
			}
		}
	}, [filteredPostsLength, handleFirstFetchPosts, userMounted]);

	useEffect(() => {
		handleFilterPosts();
	}, [postStateValue]);

	return (
		<>
			<div className="flex flex-col gap-y-4">
				{!userMounted || firstLoadingPosts ? (
					<>
						<>
							<PostCardSkeleton />
							<PostCardSkeleton />
						</>
					</>
				) : (
					<>
						{postCreation && (
							<PostCreationListener
								postType={postType}
								useStateValue={userStateValue}
							/>
						)}
						{filter && <PageFilter />}
						{filteredPostsLength > 0 && (
							<>
								{filteredPosts.map((post, index) => (
									<PostCard
										key={post.post.id}
										postData={post}
									/>
								))}
							</>
						)}
						{loadingPosts && (
							<>
								<PostCardSkeleton />
								<PostCardSkeleton />
							</>
						)}
						{!endReached && postsMounted && filteredPostsLength > 0 && (
							<>
								<VisibleInViewPort
									disabled={endReached || loadingPosts || firstLoadingPosts}
									onVisible={() => handleFetchPosts()}
								/>
							</>
						)}
						{endReached && <PageEnd message={pageEnd || "End of Posts"} />}
					</>
				)}
			</div>
		</>
	);
};

export default PostsFilter;
