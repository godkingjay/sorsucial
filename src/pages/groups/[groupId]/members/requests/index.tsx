import { GroupData, GroupState } from "@/atoms/groupAtom";
import GroupPageLoader from "@/components/Group/GroupPageLoader";
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

	const renderItems = () => {
		const result = [];
		for (let i = 0; i < 20; i++) {
			result.push(
				<div
					key={i}
					className="bg-white rounded-lg shadow-page-box-1 p-4 flex flex-row gap-x-2"
				>
					<div className="h-16 w-16 rounded-full skeleton-color animate-pulse"></div>
					<div className="flex flex-1 flex-col gap-y-2">
						<div className="h-3 w-full rounded-full skeleton-color"></div>
						<div className="h-2 w-[50%] rounded-full skeleton-color"></div>
						<div className="my-2 flex flex-col gap-y-1">
							<div className="h-2 w-full rounded-full skeleton-color"></div>
						</div>
					</div>
				</div>
			);
		}
		return result;
	};

	return (
		<>
			<div className="flex-1">
				<GroupPageLoader
					groupPageData={groupPageData}
					loadingGroup={loadingPage}
				>
					{groupStateValue.currentGroup &&
						groupStateValue.currentGroup?.group.id === groupId && (
							<>
								<div className="grid grid-cols-2 gap-4">{renderItems()}</div>
							</>
						)}
				</GroupPageLoader>
			</div>
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
