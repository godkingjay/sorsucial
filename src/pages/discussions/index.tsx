import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import Head from "next/head";
import React from "react";
import DiscussionsFilter from "@/components/Discussion/DiscussionsFilter";

type DiscussionsPageProps = {};

const DiscussionsPage: React.FC<DiscussionsPageProps> = () => {
	return (
		<>
			<Head>
				<title>Discussions | SorSUcial</title>
			</Head>
			<main className="flex flex-col flex-1 py-4 px-4">
				<LimitedBodyLayout>
					<DiscussionsFilter
						privacy="public"
						discussionType="discussion"
						sortBy="latest"
						discussionCreation={true}
						filter={true}
					/>
				</LimitedBodyLayout>
			</main>
		</>
	);
};

export default DiscussionsPage;
