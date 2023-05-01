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
			<main className="flex flex-col flex-1 py-4 px-4">
				<LimitedBodyLayout>
					<section className="flex flex-col gap-y-4">
						<PostFilter
							postType="feed"
							postCreation={true}
							filter={true}
							privacy="public"
							sortBy="latest"
							pageEnd="End of Feeds"
						/>
					</section>
				</LimitedBodyLayout>
			</main>
		</>
	);
};

export default FeedsPage;
