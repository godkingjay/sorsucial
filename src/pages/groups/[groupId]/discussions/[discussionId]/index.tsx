import { DiscussionData, DiscussionState } from "@/atoms/discussionAtom";
import { GroupData, GroupState } from "@/atoms/groupAtom";
import SingleDiscussionView from "@/components/Discussion/SingleDiscussionView";
import GroupPageLoader from "@/components/Group/GroupPageLoader";
import useGroup from "@/hooks/useGroup";
import discussionDb from "@/lib/db/discussionDb";
import groupDb from "@/lib/db/groupDb";
import userDb from "@/lib/db/userDb";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type GroupDiscussionProps = {
	groupPageData: GroupState["currentGroup"];
	discussionPageData: DiscussionState["currentDiscussion"];
	loadingPage: boolean;
};

const GroupDiscussionView: React.FC<GroupDiscussionProps> = ({
	groupPageData,
	discussionPageData,
	loadingPage = true,
}) => {
	const router = useRouter();
	const { groupStateValue } = useGroup();
	const { groupId } = router.query;

	return (
		<>
			<GroupPageLoader
				groupPageData={groupPageData}
				loadingGroup={loadingPage}
			>
				{groupStateValue.currentGroup?.group.id === groupId && (
					<SingleDiscussionView
						discussionPageData={discussionPageData}
						loadingDiscussion={loadingPage}
						type="group-discussion"
					/>
				)}
			</GroupPageLoader>
		</>
	);
};

export default GroupDiscussionView;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const { usersCollection } = await userDb();
		const { groupsCollection } = await groupDb();
		const { discussionsCollection } = await discussionDb();
		const { groupId, discussionId } = context.query;

		const discussionPageData: Partial<DiscussionData> = {
			discussion: (await discussionsCollection.findOne({
				id: discussionId,
				groupId: groupId,
				discussionType: "group",
			})) as unknown as DiscussionData["discussion"],
		};

		const groupPageData: Partial<GroupData> = {
			group: (await groupsCollection.findOne({
				id: groupId,
			})) as unknown as GroupData["group"],
		};

		if (discussionPageData.discussion !== null) {
			discussionPageData.creator = (await usersCollection.findOne({
				uid: discussionPageData.discussion?.creatorId,
			})) as unknown as DiscussionData["creator"];
		}

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
				discussionPageData: discussionPageData.discussion
					? JSON.parse(safeJsonStringify(discussionPageData))
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
