import { PostState } from "@/atoms/postAtom";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import PostCard from "@/components/Post/PostCard";
import PostCardSkeleton from "@/components/Skeleton/Post/PostCardSkeleton";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
import { siteDetails } from "@/lib/host";
import clientPromise from "@/lib/mongodb";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import safeJsonStringify from "safe-json-stringify";

type FeedPostViewProps = {
	postPageData: PostState["currentPost"];
	loadingPage: boolean;
};

const FeedPostView: React.FC<FeedPostViewProps> = ({
	postPageData,
	loadingPage = true,
}) => {
	const { userStateValue, userMounted } = useUser();
	const {
		postStateValue,
		setPostStateValue,
		fetchUserLike,
		deletePost,
		postOptionsStateValue,
		setPostOptionsStateValue,
		onPostLike,
	} = usePost();
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
								if (post.post.id === currentPost.post.id) {
									return {
										...postPageData,
										userLike: userLikeData,
									};
								} else {
									return post;
								}
						  })
						: prev.posts,
					currentPost: {
						...postPageData,
						userLike: userLikeData,
						postComments: [],
					},
				}));

				// if (
				// 	!postStateValue.posts.find(
				// 		(post) => post.post.id === postPageData.post.id
				// 	)
				// ) {
				// 	setPostStateValue((prev) => ({
				// 		...prev,
				// 		posts: [
				// 			...prev.posts,
				// 			{
				// 				...postPageData,
				// 				userLike: userLikeData,
				// 			},
				// 		],
				// 	}));
				// }
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
					{loadingPage || fetchingPostUserData
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
			<main className="flex flex-col flex-1 py-4 px-4">
				<LimitedBodyLayout>
					<section className="flex flex-col gap-y-4">
						{loadingPage || fetchingPostUserData || !userMounted ? (
							<>
								<PostCardSkeleton />
							</>
						) : (
							<>
								{!postStateValue.currentPost ? (
									<div>Not Found</div>
								) : (
									<>
										<PostCard
											userStateValue={userStateValue}
											userMounted={userMounted}
											postData={postStateValue.currentPost!}
											deletePost={deletePost}
											postOptionsStateValue={postOptionsStateValue}
											setPostOptionsStateValue={setPostOptionsStateValue}
											onPostLike={onPostLike}
											router={router}
										/>
									</>
								)}
							</>
						)}
					</section>
				</LimitedBodyLayout>
			</main>
		</>
	);
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const postsCollection = db.collection("posts");
		const usersCollection = db.collection("users");
		const { userId, postId } = context.query;

		const postPageData: any = {
			post: await postsCollection.findOne({
				id: postId,
				creatorId: userId,
				postType: "feed",
			}),
		};

		if (postPageData.post !== null) {
			postPageData.creator = await usersCollection.findOne({
				uid: postPageData.post.creatorId,
			});
		}

		return {
			props: {
				postPageData: postPageData.post
					? JSON.parse(safeJsonStringify(postPageData))
					: null,
				loadingPage: false,
			},
		};
	} catch (error: any) {
		return {
			notFound: true,
		};
	}
};

export default FeedPostView;
