import { userState } from "@/atoms/userAtom";
import PostCreationListener from "@/components/Post/PostCreationListener";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
import { useEffect, useRef, useState } from "react";

export default function Home() {
	const { userStateValue } = useUser();
	const { postStateValue, setPostStateValue, fetchPosts } = usePost();
	const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
	const anouncementsMounted = useRef(false);

	const fetchAnnouncements = async () => {
		setLoadingAnnouncements(true);
		try {
			await fetchPosts("announcement");
		} catch (error: any) {
			console.log("Hook: fetching announcement Error: ", error.message);
		}
		setLoadingAnnouncements(false);
	};

	useEffect(() => {
		if (!anouncementsMounted.current && postStateValue.posts.length === 0) {
			anouncementsMounted.current = true;
			fetchAnnouncements();
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
					{postStateValue.posts
						.filter((post) => post.postType === "announcement")
						.map((post) => (
							<div key={post.id}>{post.postTitle}</div>
						))}
				</section>
			</main>
		</>
	);
}
