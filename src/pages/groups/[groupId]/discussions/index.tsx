import { GroupData, GroupState } from "@/atoms/groupAtom";
import DiscussionsFilter from "@/components/Discussion/DiscussionsFilter";
import GroupPageLoader from "@/components/Group/GroupPageLoader";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import useGroup from "@/hooks/useGroup";
import groupDb from "@/lib/db/groupDb";
import userDb from "@/lib/db/userDb";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type GroupPageDiscussionsPageProps = {
	groupPageData: GroupState["currentGroup"];
	loadingPage: boolean;
};

const GroupPageDiscussionsPage: React.FC<GroupPageDiscussionsPageProps> = ({
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
					{groupStateValue.currentGroup?.group.id === groupId && (
						<>
							<DiscussionsFilter
								discussionType="group"
								privacy={groupStateValue.currentGroup?.group.privacy || "public"}
								sortBy="latest"
								groupId={groupStateValue.currentGroup?.group.id}
								discussionCreation={true}
								filter={true}
							/>
						</>
					)}
				</LimitedBodyLayout>
			</GroupPageLoader>
		</>
	);
};

export default GroupPageDiscussionsPage;

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
