import { GroupData, GroupState } from "@/atoms/groupAtom";
import ButtonJoinLeaveGroup from "@/components/Group/Buttons/ButtonJoinLeaveGroup";
import GroupPageHeader from "@/components/Group/GroupPageHeader";
import GroupPageView from "@/components/Group/GroupPageView";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import PostCreationListener from "@/components/Post/PostCreationListener";
import PostsFilter from "@/components/Post/PostsFilter";
import PostFilter from "@/components/Post/PostsFilter";
import useGroup from "@/hooks/useGroup";
import useUser from "@/hooks/useUser";
import groupDb from "@/lib/db/groupDb";
import userDb from "@/lib/db/userDb";
import { siteDetails } from "@/lib/host";
import moment from "moment";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { HiOutlineCamera } from "react-icons/hi";
import { RiGroup2Fill } from "react-icons/ri";
import safeJsonStringify from "safe-json-stringify";

type GroupPageProps = {
	groupPageData: GroupState["currentGroup"];
	loadingPage: boolean;
};

const GroupPage: React.FC<GroupPageProps> = ({
	groupPageData,
	loadingPage = true,
}) => {
	const { groupStateValue } = useGroup();
	const router = useRouter();
	const { groupId } = router.query;

	return (
		<>
			<GroupPageView
				groupPageData={groupPageData}
				loading={loadingPage}
			>
				{groupStateValue.currentGroup?.group.id === groupId && (
					<PostsFilter
						postType="group"
						postCreation={true}
						filter={true}
						groupId={groupStateValue.currentGroup?.group.id}
						privacy={groupStateValue.currentGroup?.group.privacy!}
						sortBy="latest"
					/>
				)}
			</GroupPageView>
		</>
	);
};

export default GroupPage;

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
