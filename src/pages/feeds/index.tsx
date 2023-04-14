import VisibleInViewPort from "@/components/Events/VisibleInViewPort";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import PostCard from "@/components/Post/PostCard";
import PostCreationListener from "@/components/Post/PostCreationListener";
import PostCardSkeleton from "@/components/Skeleton/Post/PostCardSkeleton";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";

type FeedsPageProps = {};

const FeedsPage: React.FC<FeedsPageProps> = () => {
	const { userStateValue, userMounted } = useUser();
	const {
		postStateValue,
		postOptionsStateValue,
		setPostOptionsStateValue,
		deletePost,
		fetchPosts,
		onPostLike,
	} = usePost();
	const [loadingFeeds, setLoadingFeeds] = useState(false);
	const [firstLoadingFeeds, setFirstLoadingFeeds] = useState(false);
	const [endReached, setEndReached] = useState(false);
	const feedsMounted = useRef(false);
	const router = useRouter();

	const handleFetchFeeds = useCallback(async () => {
		setLoadingFeeds(true);
		try {
			const fetchedPostLength = await fetchPosts("feed");
			if (fetchedPostLength !== undefined) {
				setEndReached(fetchedPostLength < 10 ? true : false);
			}
		} catch (error: any) {
			console.log("Hook: fetching feeds Error: ", error.message);
		}
		setLoadingFeeds(false);
	}, [fetchPosts]);

	const handleFirstFetchFeeds = useCallback(async () => {
		setFirstLoadingFeeds(true);
		try {
			await handleFetchFeeds();
		} catch (error: any) {
			console.log("First Fetch: fetching feeds Error: ", error.message);
		}
		setFirstLoadingFeeds(false);
	}, []);

	useEffect(() => {
		const feedPostsLength = postStateValue.posts.filter(
			(allPost) => allPost.post.postType === "feed"
		).length;

		if (userMounted) {
			if (!feedsMounted.current && feedPostsLength === 0) {
				feedsMounted.current = true;
				handleFirstFetchFeeds();
			} else {
				feedsMounted.current = true;
			}
		}
	}, [userMounted]);

	return (
		<>
			<Head>
				<title>Feeds | SorSUcial</title>
			</Head>
			<main className="flex flex-col flex-1 py-4 px-4">
				<LimitedBodyLayout>
					<section className="flex flex-col gap-y-4">
						{firstLoadingFeeds && !userMounted ? (
							<>
								<PostCardSkeleton />
								<PostCardSkeleton />
							</>
						) : (
							<>
								<PostCreationListener
									useStateValue={userStateValue}
									postType="feed"
								/>
								{postStateValue.posts
									.filter((allPost) => allPost.post.postType === "feed")
									.map((feed) => (
										<PostCard
											key={feed.post.id}
											userStateValue={userStateValue}
											postData={feed}
											deletePost={deletePost}
											postOptionsStateValue={postOptionsStateValue}
											setPostOptionsStateValue={setPostOptionsStateValue}
											onPostLike={onPostLike}
											router={router}
										/>
									))}
								{loadingFeeds && (
									<>
										<PostCardSkeleton />
										<PostCardSkeleton />
									</>
								)}
								{!endReached && feedsMounted && (
									<VisibleInViewPort
										disabled={endReached || loadingFeeds || firstLoadingFeeds}
										onVisible={handleFetchFeeds}
									></VisibleInViewPort>
								)}
								{endReached && (
									<div className="h-16 flex flex-col items-center justify-center">
										<div className="flex flex-row items-center w-full gap-x-4">
											<div className="flex-1 h-[1px] bg-gray-300"></div>
											<p className="text-gray-400">End of Feeds</p>
											<div className="flex-1 h-[1px] bg-gray-300"></div>
										</div>
									</div>
								)}
							</>
						)}
					</section>
				</LimitedBodyLayout>
			</main>
		</>
	);
};

export default FeedsPage;
