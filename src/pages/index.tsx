import { userState } from "@/atoms/userAtom";
import PostCreationListener from "@/components/Post/PostCreationListener";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

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
						.filter((post) => post.post.postType === "announcement")
						.map((post) => (
							<div
								key={post.post.id}
								className="break-words flex flex-col shadow-page-box-1 bg-white rounded-lg"
							>
								<div className="p-2 flex flex-row h-14 items-center gap-x-4">
									<Link
										href={`/user/${userStateValue.user.uid}`}
										className="h-10 w-10 aspect-square rounded-full border border-transparent text-gray-300"
									>
										{userStateValue.user.imageURL ? (
											<Image
												src={userStateValue.user.imageURL}
												alt="User Profile Picture"
												width={96}
												height={96}
												loading="lazy"
												className="h-full w-full"
											/>
										) : (
											<FaUserCircle className="h-full w-full bg-white" />
										)}
									</Link>
									<div className="flex-1 flex flex-col h-full">
										<p className="text-sm font-semibold">{`${post.creator?.firstName} ${post.creator?.lastName}`}</p>
										<p className="text-2xs text-gray-500">
											{moment(
												new Date(post.post.createdAt.seconds * 1000)
											).fromNow()}
										</p>
									</div>
								</div>
								<p>{JSON.stringify(post)}</p>
							</div>
						))}
				</section>
			</main>
		</>
	);
}
