import { PostState } from "@/atoms/postAtom";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import SinglePostView from "@/components/Post/SinglePostView";
import clientPromise from "@/lib/mongodb";
import { GetServerSidePropsContext } from "next";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type Props = {
	postPageData: PostState["currentPost"];
	loadingPage: boolean;
};

const AnnouncementView: React.FC<Props> = ({
	postPageData,
	loadingPage = true,
}) => {
	return (
		<>
			<LimitedBodyLayout>
				<SinglePostView
					loadingPost={loadingPage}
					postPageData={postPageData}
					type="announcement"
				/>
			</LimitedBodyLayout>
		</>
	);
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const postsCollection = db.collection("posts");
		const usersCollection = db.collection("users");
		const { postId } = context.query;

		const postPageData: any = {
			post: await postsCollection.findOne({
				id: postId,
				postType: "announcement",
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

export default AnnouncementView;
