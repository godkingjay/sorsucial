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
import PageFilter from "../Controls/PageFilter";

type PostsFilterProps = {
	postType: SitePost["postType"];
	postCreation?: boolean;
	filter?: boolean;
	sortBy: QueryPostsSortBy;
	privacy: SitePost["privacy"];
	groupId?: string;
	creator?: string;
	tags?: string;
	pageEnd?: string;
};

const PostsFilter: React.FC<PostsFilterProps> = ({
	postType,
	postCreation,
	filter,
	sortBy,
	privacy,
	groupId,
	creator,
	tags,
	pageEnd,
}) => {
	const { userStateValue, userMounted } = useUser();
	const {
		postStateValue,
		deletePost,
		postOptionsStateValue,
		setPostOptionsStateValue,
		onPostLike,
		fetchPosts,
	} = usePost();
	const [filteredGroups, setFilteredGroups] = useState<PostData[]>([]);
	const [loadingPosts, setLoadingPosts] = useState(false);
	const [firstLoadingPosts, setFirstLoadingPosts] = useState(false);
	const [endReached, setEndReached] = useState(false);
	const postsMounted = useRef(false);
	const filteredGroupsLength = filteredGroups.length || -1;
	const regexCreator = new RegExp(creator || "", "i");
	const router = useRouter();

	const handleFilterPosts = useCallback(() => {
		setFilteredGroups(
			postStateValue.posts.filter(
				(post) =>
					(groupId ? post.post.groupId === groupId : true) &&
					(creator
						? post.creator?.uid.match(regexCreator) ||
						  post.creator?.firstName.match(regexCreator) ||
						  post.creator?.lastName.match(regexCreator) ||
						  post.creator?.middleName?.match(regexCreator) ||
						  post.creator?.email.match(regexCreator)
						: true) &&
					post.post.privacy === privacy &&
					post.post.postType === postType &&
					post.index &&
					post.index[sortBy] !== undefined &&
					post.index[sortBy] >= 0
			)
		);
	}, [
		postStateValue.posts,
		groupId,
		creator,
		regexCreator,
		privacy,
		postType,
		sortBy,
	]);

	const handleFetchPosts = useCallback(async () => {
		setLoadingPosts(true);
		try {
			const fetchedPostLength = await fetchPosts({
				postType: postType,
				privacy: privacy,
				sortBy: sortBy,
				groupId: groupId || undefined,
			});
			if (fetchedPostLength !== undefined) {
				setEndReached(fetchedPostLength < 10 ? true : false);
			}
		} catch (error: any) {
			console.log("Hook: fetching feeds Error: ", error.message);
		}
		setLoadingPosts(false);
	}, [fetchPosts, groupId, postType, privacy, sortBy]);

	const handleFirstFetchPosts = useCallback(async () => {
		setFirstLoadingPosts(true);
		try {
			await handleFetchPosts();
		} catch (error: any) {
			console.log("First Fetch: fetching feeds Error: ", error.message);
		}
		setFirstLoadingPosts(false);
	}, [handleFetchPosts]);

	useEffect(() => {
		if (userMounted) {
			if (!postsMounted.current && filteredGroupsLength <= 0) {
				postsMounted.current = true;
				handleFirstFetchPosts();
			} else {
				postsMounted.current = true;
			}
		}
	}, [filteredGroupsLength, handleFirstFetchPosts, userMounted]);

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
						{filteredGroupsLength > 0 && (
							<>
								{filteredGroups.map((post, index) => (
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
						{!endReached && postsMounted && filteredGroupsLength > 0 && (
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
