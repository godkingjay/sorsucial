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

type GroupPageMembersPageProps = {
	groupPageData: GroupState["currentGroup"];
	loadingPage: boolean;
};

const GroupPageMembersPage: React.FC<GroupPageMembersPageProps> = ({
	groupPageData,
	loadingPage = true,
}) => {
	const { groupStateValue } = useGroup();
	const router = useRouter();
	const { groupId } = router.query;

	return (
		<>
			<GroupPageLoader
				groupPageData={groupPageData}
				loadingGroup={loadingPage}
			>
				<LimitedBodyLayout>
					{groupStateValue.currentGroup &&
						groupStateValue.currentGroup?.group.id === groupId && (
							<>
								<MembersFilter
									addMember={true}
									filter={true}
									groupId={groupId as string}
									sortBy="accepted-desc"
									roles={["member"]}
									filterOptions={{
										filterType: "group-members",
										options: {
											roles: true,
											date: true,
										},
									}}
								/>
							</>
						)}
				</LimitedBodyLayout>
			</GroupPageLoader>
		</>
	);
};

export default GroupPageMembersPage;

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
