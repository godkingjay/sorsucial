import GroupsFilter from "@/components/Group/GroupsFilter";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import Head from "next/head";
import React from "react";

type GroupsPageProps = {};

const GroupsPage: React.FC<GroupsPageProps> = () => {
	return (
		<>
			<Head>
				<title>Groups | SorSUcial</title>
			</Head>
			<LimitedBodyLayout>
				<GroupsFilter
					groupCreation={true}
					filter={true}
					privacy="public"
					sortBy="latest"
					pageEnd="End of Groups"
					filterOptions={{
						filterType: "groups",
						options: {
							creatorId: true,
							creator: true,
							privacy: true,
							tags: true,
							members: true,
							date: true,
							posts: true,
							discussions: true,
						},
					}}
				/>
			</LimitedBodyLayout>
		</>
	);
};

export default GroupsPage;
