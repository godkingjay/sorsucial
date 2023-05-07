import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import PostFilter from "@/components/Post/PostsFilter";
import Head from "next/head";
import React from "react";

type FeedsPageProps = {};

const FeedsPage: React.FC<FeedsPageProps> = () => {
	return (
		<>
			<Head>
				<title>Feeds | SorSUcial</title>
			</Head>
			<LimitedBodyLayout>
				<PostFilter
					postType="feed"
					postCreation={true}
					filter={true}
					privacy="public"
					sortBy="latest"
					pageEnd="End of Feeds"
					filterOptions={{
						filterType: "posts",
						options: {
							postType: false,
							privacy: true,
							creatorId: true,
							creator: true,
							groupId: false,
							tags: true,
							likes: true,
							comments: true,
							date: true,
						},
					}}
				/>
			</LimitedBodyLayout>
		</>
	);
};

export default FeedsPage;
