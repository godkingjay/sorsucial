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
	const sortByIndex =
		sortBy +
		(postType ? `-${postType}` : "") +
		(privacy ? `-${privacy}` : "") +
		(groupId ? `-${groupId}` : "") +
		(creatorId ? `-${postType === "announcement" ? "sorsu" : creatorId}` : "") +
		(creator ? `-${postType === "announcement" ? "sorsu" : creator}` : "") +
		(tags ? `-${tags}` : "");

	const { userStateValue, userMounted } = useUser();
	const { postStateValue, fetchPosts } = usePost();
	const [filteredPosts, setFilteredPosts] = useState<PostData[]>(
		postStateValue.posts
			.filter((post) => post.index[sortByIndex] >= 0)
			.sort((a, b) => a.index[sortByIndex] - b.index[sortByIndex])
	);

	const [filteringPosts, setFilteringPosts] = useState(false);
	const [loadingPosts, setLoadingPosts] = useState(false);
	const [firstLoadingPosts, setFirstLoadingPosts] = useState(false);
	const [endReached, setEndReached] = useState(false);
	const postsMounted = useRef(false);
	const regexCreator = new RegExp(creator || "", "i");

	const router = useRouter();
	const { userId } = router.query;

	const handleFilterPosts = useCallback(async () => {
		if (!filteringPosts) {
			setFilteringPosts(true);

			setFilteredPosts(
				postStateValue.posts
					.filter((post) => post.index[sortByIndex] >= 0)
					.sort((a, b) => a.index[sortByIndex] - b.index[sortByIndex])
			);

			setFilteringPosts(false);
		}
	}, [filteringPosts, postStateValue.posts, sortByIndex]);

	const handleFetchPosts = useCallback(async () => {
		try {
			if (!loadingPosts && !filteringPosts) {
				setLoadingPosts(true);

				const fetchedPostsLength = await fetchPosts({
					postType: postType,
					privacy: privacy,
					sortBy: sortBy,
					creatorId: creatorId,
					creator: creator,
					tags: tags,
					groupId: groupId,
				});

				if (fetchedPostsLength !== null && fetchedPostsLength !== undefined) {
					setEndReached(fetchedPostsLength < 10 ? true : false);
					setLoadingPosts(false);
				}
			}
		} catch (error: any) {
			console.log("Hook: fetching posts Error: ", error.message);
			setLoadingPosts(false);
		}
	}, [
		loadingPosts,
		filteringPosts,
		fetchPosts,
		postType,
		privacy,
		sortBy,
		creatorId,
		creator,
		tags,
		groupId,
	]);

	const handleFirstFetchPosts = useCallback(async () => {
		try {
			if (!firstLoadingPosts) {
				setFirstLoadingPosts(true);
				await handleFetchPosts();
				setFirstLoadingPosts(false);
			}
		} catch (error: any) {
			console.log("First Fetch: fetching posts Error: ", error.message);
			setFirstLoadingPosts(false);
		}
	}, [firstLoadingPosts, handleFetchPosts]);

	useEffect(() => {
		if (!filteringPosts && !loadingPosts) {
			handleFilterPosts();
		}
	}, [filteringPosts, loadingPosts, handleFilterPosts, postStateValue.posts]);

	useEffect(() => {
		if (userMounted) {
			if (!postsMounted.current && filteredPosts.length <= 0) {
				postsMounted.current = true;
				handleFirstFetchPosts();
			} else {
				postsMounted.current = true;
			}
		}
	}, [userMounted]);

	return (
		<>
			<div className="page-wrapper">
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
						<>
							{filteredPosts.map((post, index) => (
								<React.Fragment key={post.post.id}>
									<PostCard postData={post} />
								</React.Fragment>
							))}
						</>
						{(loadingPosts || filteringPosts) && !endReached && (
							<>
								<PostCardSkeleton />
								<PostCardSkeleton />
							</>
						)}
						{!loadingPosts &&
							!firstLoadingPosts &&
							!endReached &&
							userMounted &&
							postsMounted && (
								<>
									<VisibleInViewPort
										disabled={
											loadingPosts ||
											firstLoadingPosts ||
											filteringPosts ||
											endReached ||
											!userMounted ||
											!postsMounted
										}
										onVisible={() =>
											loadingPosts ||
											firstLoadingPosts ||
											endReached ||
											!userMounted ||
											!postsMounted
												? () => {}
												: handleFetchPosts()
										}
									/>
								</>
							)}
						{endReached ? (
							<>
								<PageEnd message={pageEnd || "End of Posts"} />
							</>
						) : (
							<>
								<PostCardSkeleton />
								<PostCardSkeleton />
							</>
						)}
					</>
				)}
			</div>
		</>
	);
};

export default PostsFilter;
