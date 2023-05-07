import { PostState } from "@/atoms/postAtom";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
import { siteDetails } from "@/lib/host";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LimitedBodyLayout from "../Layout/LimitedBodyLayout";
import PostCardSkeleton from "../Skeleton/Post/PostCardSkeleton";
import PostCard from "./PostCard";
import PostDiscussionNotFound, {
	PostDiscussionNotFoundProps,
} from "../Error/PostDiscussionNotFound";

type SinglePostViewProps = {
	postPageData: PostState["currentPost"];
	loadingPost: boolean;
	type: PostDiscussionNotFoundProps["type"];
};

const SinglePostView: React.FC<SinglePostViewProps> = ({
	postPageData,
	loadingPost,
	type,
}) => {
	const { userMounted } = useUser();
	const { postStateValue, setPostStateValue, fetchUserLike } = usePost();
	const [fetchingPostUserData, setFetchingPostUserData] = useState(true);
	const router = useRouter();
	const { postId } = router.query;

	const fetchPostUserData = async () => {
		setFetchingPostUserData(true);
		try {
			if (postPageData) {
				const userLikeData = await fetchUserLike(postPageData.post);

				const currentPost = postStateValue.posts.find(
					(post) => post.post.id === postPageData.post.id
				);

				setPostStateValue((prev) => ({
					...prev,
					posts: currentPost
						? prev.posts.map((post) => {
								if (post.post.id !== currentPost.post.id) {
									return post;
								}

								return {
									...post,
									...postPageData,
									userLike: userLikeData,
								};
						  })
						: prev.posts,
					currentPost: {
						...postPageData,
						userLike: userLikeData,
						postComments: [],
					},
				}));
			}
		} catch (error: any) {
			console.log("fetchPostUserData: error: ", error.message);
		}
		setFetchingPostUserData(false);
	};

	useEffect(() => {
		if (userMounted) {
			fetchPostUserData();
		}
	}, [userMounted]);

	return (
		<>
			<Head>
				<title>
					{loadingPost || fetchingPostUserData
						? "Loading Post"
						: postStateValue.currentPost === null
						? "Post Not Found"
						: postStateValue.currentPost.post.postTitle}{" "}
					| SorSUcial
				</title>
				<meta
					name="title"
					property="og:title"
					content={postStateValue.currentPost?.post.postTitle || ""}
				/>
				<meta
					name="type"
					property="og:type"
					content="article"
				/>
				<meta
					name="description"
					property="og:description"
					content={
						postStateValue.currentPost?.post.postBody?.slice(0, 512) || ""
					}
				/>
				<meta
					name="url"
					property="og:url"
					content={siteDetails.host + `/${router.asPath.slice(1)}`}
				/>
				<meta
					name="updated_time"
					property="og:updated_time"
					content={
						postStateValue.currentPost?.post.updatedAt?.toString() ||
						new Date().toString()
					}
				/>
			</Head>
			<section className="page-wrapper">
				{loadingPost || fetchingPostUserData || !userMounted ? (
					<>
						<PostCardSkeleton />
					</>
				) : (
					<>
						{!postStateValue.currentPost ? (
							<PostDiscussionNotFound type={type} />
						) : (
							<>
								{postStateValue.currentPost.post.id === postId && (
									<PostCard postData={postStateValue.currentPost!} />
								)}
							</>
						)}
					</>
				)}
			</section>
		</>
	);
};

export default SinglePostView;
