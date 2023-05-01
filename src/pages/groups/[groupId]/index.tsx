import { GroupData, GroupState } from "@/atoms/groupAtom";
import useGroup from "@/hooks/useGroup";
import useUser from "@/hooks/useUser";
import groupDb from "@/lib/db/groupDb";
import userDb from "@/lib/db/userDb";
import { siteDetails } from "@/lib/host";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import safeJsonStringify from "safe-json-stringify";

type GroupPageProps = {
	groupPageData: GroupState["currentGroup"];
	loadingPage: boolean;
};

const GroupPage: React.FC<GroupPageProps> = ({
	groupPageData,
	loadingPage = true,
}) => {
	const { userStateValue, userMounted } = useUser();
	const { groupStateValue, setGroupStateValue } = useGroup();
	const [fetchingGroupUserData, setFetchingGroupUserData] = useState(true);
	const router = useRouter();
	const { groupId } = router.query;

	const fetchGroupUserData = useCallback(async () => {
		setFetchingGroupUserData(true);
		try {
			if (groupPageData) {
				const currentGroup = groupStateValue.groups.find(
					(group) => group.group.id === groupPageData.group.id
				);

				setGroupStateValue((prev) => ({
					...prev,
					groups: currentGroup
						? prev.groups.map((group) => {
								if (group.group.id !== currentGroup.group.id) {
									return group;
								}

								return {
									...group,
									...groupPageData,
								};
						  })
						: prev.groups,
					currentGroup: {
						...groupPageData,
					},
				}));
			}
		} catch (error: any) {
			console.error("=>fetchGroupUserData Error:\n" + error.message);
		} finally {
			setFetchingGroupUserData(false);
		}
	}, [groupPageData, groupStateValue.groups, setGroupStateValue]);

	useEffect(() => {
		if (userMounted) {
			if (userStateValue.user) {
				fetchGroupUserData();
			}
		}
	}, [userMounted]);

	return (
		<>
			<Head>
				<title>
					{loadingPage || fetchingGroupUserData
						? "Loading Group"
						: groupStateValue.currentGroup === null
						? "Group Not Found"
						: groupStateValue.currentGroup.group.name}{" "}
					| SorSUcial
				</title>
				<meta
					name="title"
					property="og:title"
					content={groupStateValue.currentGroup?.group.name || "Group"}
				/>
				<meta
					name="type"
					property="og:type"
					content="website"
				/>
				<meta
					name="description"
					property="og:description"
					content={
						groupStateValue.currentGroup?.group.description?.slice(0, 512) || ""
					}
				/>
				<meta
					name="description"
					property="description"
					content={
						groupStateValue.currentGroup?.group.description?.slice(0, 512) || ""
					}
				/>
				<meta
					name="url"
					property="og:url"
					content={siteDetails.host + `/${router.asPath.slice(1)}`}
				/>
				<meta
					name="updated_time"
					property="og:updated_time"
					content={
						groupStateValue.currentGroup?.group.updatedAt?.toString() ||
						new Date().toString()
					}
				/>
			</Head>
			<div className="flex flex-col">
				{loadingPage || !userMounted ? (
					<>
						<p>Loading Group</p>
					</>
				) : (
					<>
						{!groupStateValue.currentGroup ? (
							<>
								<p>Group Not Found</p>
							</>
						) : (
							<>
								<p>{groupStateValue.currentGroup.group.name}</p>
							</>
						)}
					</>
				)}
			</div>
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
