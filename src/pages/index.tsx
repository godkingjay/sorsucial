import PostCard from "@/components/Post/PostCard";
import PostCreationListener from "@/components/Post/PostCreationListener";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
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
	const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
	const announcementsMounted = useRef(false);

	const fetchAnnouncements = useCallback(async () => {
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
			postStateValue.posts.length === 0 &&
			userStateValue.user &&
			authUser &&
			!loadingUser &&
			!authLoading
		) {
			announcementsMounted.current = true;
			fetchAnnouncements();
		}
	}, [
		announcementsMounted,
		fetchAnnouncements,
		postStateValue.posts,
		authUser,
		userStateValue.user,
		loadingUser,
		authLoading,
	]);

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
					{postStateValue.posts
						.filter((post) => post.post.postType === "announcement")
						.map((post) => (
							<PostCard
								key={post.post.id}
								userStateValue={userStateValue}
								postData={post}
								deletePost={deletePost}
								postOptionsStateValue={postOptionsStateValue}
								setPostOptionsStateValue={setPostOptionsStateValue}
								onPostLike={onPostLike}
							/>
						))}
				</section>
			</main>
		</>
	);
}
