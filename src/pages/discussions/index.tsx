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
			<LimitedBodyLayout>
				<DiscussionsFilter
					privacy="public"
					discussionType="discussion"
					sortBy="latest"
					discussionCreation={true}
					filter={true}
				/>
			</LimitedBodyLayout>
		</>
	);
};

export default DiscussionsPage;
