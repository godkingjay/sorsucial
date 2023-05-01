import { PostState } from "@/atoms/postAtom";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import PostCard from "@/components/Post/PostCard";
import SinglePostView from "@/components/Post/SinglePostView";
import PostCardSkeleton from "@/components/Skeleton/Post/PostCardSkeleton";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
import postDb from "@/lib/db/postDb";
import userDb from "@/lib/db/userDb";
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
	return (
		<>
			<SinglePostView
				loadingPost={loadingPage}
				postPageData={postPageData}
				type="user-post"
			/>
		</>
	);
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const { usersCollection } = await userDb();
		const { postsCollection } = await postDb();
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
