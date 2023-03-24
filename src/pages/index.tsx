import PostCard from "@/components/Post/PostCard";
import PostCreationListener from "@/components/Post/PostCreationListener";
import LoadingScreen from "@/components/Skeleton/LoadingScreen";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
import { GetServerSideProps } from "next";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
	const { userStateValue, authUser, authLoading, loadingUser } = useUser();
	const {
		postStateValue,
		setPostStateValue,
		postOptionsStateValue,
		setPostOptionsStateValue,
		deletePost,
		fetchPosts,
		onPostLike,
	} = usePost();
	const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
	const [firstLoadingAnnouncements, setFirstLoadingAnnouncements] =
		useState(false);
	const announcementsMounted = useRef(false);

	const handleFetchAnnouncements = useCallback(async () => {
		setLoadingAnnouncements(true);
		try {
			await fetchPosts("announcement");
		} catch (error: any) {
			console.log("Hook: fetching announcement Error: ", error.message);
		}
		setLoadingAnnouncements(false);
	}, [fetchPosts]);

	useEffect(() => {
		if (
			!announcementsMounted.current &&
			postStateValue.posts.filter(
				(allPost) => allPost.post.postType === "announcement"
			).length === 0
		) {
			announcementsMounted.current = true;
			handleFetchAnnouncements();
		}
	}, []);

	return (
		<>
			<main className="flex flex-col w-full py-4 px-2">
				<section className="flex flex-col gap-y-4">
					{userStateValue.user.roles.includes("admin") && (
						<PostCreationListener
							useStateValue={userStateValue}
							postType="announcement"
						/>
					)}
					{firstLoadingAnnouncements ? (
						<div>Loading</div>
					) : (
						<>
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
									/>
								))}
						</>
					)}
				</section>
			</main>
		</>
	);
}
