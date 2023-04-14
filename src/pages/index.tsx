import VisibleInViewPort from "@/components/Events/VisibleInViewPort";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import PostCard from "@/components/Post/PostCard";
import PostCreationListener from "@/components/Post/PostCreationListener";
import PostCardSkeleton from "@/components/Skeleton/Post/PostCardSkeleton";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
	const router = useRouter();
	const { userStateValue, userMounted } = useUser();
	const {
		postStateValue,
		postOptionsStateValue,
		setPostOptionsStateValue,
		deletePost,
		fetchPosts,
		onPostLike,
	} = usePost();
	const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
	const [firstLoadingAnnouncements, setFirstLoadingAnnouncements] =
		useState(false);
	const [endReached, setEndReached] = useState(false);
	const announcementsMounted = useRef(false);

	const handleFetchAnnouncements = useCallback(async () => {
		setLoadingAnnouncements(true);
		try {
			const fetchedPostLength = await fetchPosts("announcement");
			if (fetchedPostLength !== undefined) {
				setEndReached(fetchedPostLength < 10 ? true : false);
			}
		} catch (error: any) {
			console.log("Hook: fetching announcement Error: ", error.message);
		}
		setLoadingAnnouncements(false);
	}, [fetchPosts]);

	const handleFirstFetchAnnouncements = useCallback(async () => {
		setFirstLoadingAnnouncements(true);
		try {
			await handleFetchAnnouncements();
		} catch (error: any) {
			console.log("First Fetch: fetching announcement Error: ", error.message);
		}
		setFirstLoadingAnnouncements(false);
	}, []);

	useEffect(() => {
		const announcementPostsLength = postStateValue.posts.filter(
			(allPost) => allPost.post.postType === "announcement"
		).length;

		if (userMounted) {
			if (!announcementsMounted.current && announcementPostsLength === 0) {
				announcementsMounted.current = true;
				handleFirstFetchAnnouncements();
			} else {
				announcementsMounted.current = true;
			}
		}
	}, [userMounted]);

	return (
		<>
			<Head>
				<title>Announcements | SorSUcial</title>
			</Head>
			<main className="flex flex-col flex-1 py-4 px-4">
				<LimitedBodyLayout>
					<section className="flex flex-col gap-y-4">
						{firstLoadingAnnouncements || !userMounted ? (
							<>
								<PostCardSkeleton />
								<PostCardSkeleton />
							</>
						) : (
							<>
								{userStateValue.user.roles.includes("admin") && (
									<PostCreationListener
										useStateValue={userStateValue}
										postType="announcement"
									/>
								)}
								{postStateValue.posts
									.filter((allPost) => allPost.post.postType === "announcement")
									.map((announcement) => (
										<PostCard
											key={announcement.post.id}
											userStateValue={userStateValue}
											postData={announcement}
											deletePost={deletePost}
											postOptionsStateValue={postOptionsStateValue}
											setPostOptionsStateValue={setPostOptionsStateValue}
											onPostLike={onPostLike}
											router={router}
										/>
									))}
								{loadingAnnouncements && (
									<>
										<PostCardSkeleton />
										<PostCardSkeleton />
									</>
								)}
								{!endReached && announcementsMounted && (
									<VisibleInViewPort
										disabled={
											endReached ||
											loadingAnnouncements ||
											firstLoadingAnnouncements
										}
										onVisible={handleFetchAnnouncements}
									></VisibleInViewPort>
								)}
								{endReached && (
									<div className="h-16 flex flex-col items-center justify-center">
										<div className="flex flex-row items-center w-full gap-x-4">
											<div className="flex-1 h-[1px] bg-gray-300"></div>
											<p className="text-gray-400">End of Announcements</p>
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
}
