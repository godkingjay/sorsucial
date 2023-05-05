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
			<main className="flex flex-col flex-1 p-4">
				<LimitedBodyLayout>
					<section className="flex flex-col gap-y-4">
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
					</section>
				</LimitedBodyLayout>
			</main>
		</>
	);
};

export default GroupsPage;
