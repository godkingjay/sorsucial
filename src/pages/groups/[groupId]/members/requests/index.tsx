import { GroupData, GroupState } from "@/atoms/groupAtom";
import GroupPageLoader from "@/components/Group/GroupPageLoader";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import MembersFilter from "@/components/Member/MembersFilter";
import useGroup from "@/hooks/useGroup";
import groupDb from "@/lib/db/groupDb";
import userDb from "@/lib/db/userDb";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type GroupPageMembersRequestsPageProps = {
	groupPageData: GroupState["currentGroup"];
	loadingPage: boolean;
};

const GroupPageMembersRequestsPage: React.FC<
	GroupPageMembersRequestsPageProps
> = ({ groupPageData, loadingPage = true }) => {
	const { groupStateValue } = useGroup();
	const router = useRouter();
	const { groupId } = router.query;

	return (
		<>
			<LimitedBodyLayout>
				<GroupPageLoader
					groupPageData={groupPageData}
					loadingGroup={loadingPage}
				>
					{groupStateValue.currentGroup &&
						groupStateValue.currentGroup?.group.id === groupId && (
							<>
								<MembersFilter
									addMember={true}
									filter={true}
									groupId={groupId as string}
									sortBy="requested-desc"
									roles={["pending"]}
									filterOptions={{
										filterType: "group-members",
										options: {
											roles: false,
											date: true,
										},
									}}
								/>
							</>
						)}
				</GroupPageLoader>
			</LimitedBodyLayout>
		</>
	);
};

export default GroupPageMembersRequestsPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const { usersCollection } = await userDb();
		const { groupsCollection } = await groupDb();

		const { groupId } = context.query;

		const groupPageData: Partial<GroupData> = {
			group: (await groupsCollection.findOne({
				id: groupId,
			})) as unknown as GroupData["group"],
		};

		if (groupPageData.group !== null) {
			groupPageData.creator = (await usersCollection.findOne({
				uid: groupPageData.group?.creatorId,
			})) as unknown as GroupData["creator"];
		}

		return {
			props: {
				groupPageData: groupPageData.group
					? JSON.parse(safeJsonStringify(groupPageData))
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
