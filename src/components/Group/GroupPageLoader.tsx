import { GroupData } from "@/atoms/groupAtom";
import useGroup from "@/hooks/useGroup";
import useUser from "@/hooks/useUser";
import { siteDetails } from "@/lib/host";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import LimitedBodyLayout from "../Layout/LimitedBodyLayout";
import { useRecoilValue } from "recoil";
import { currentDirectoryState } from "@/atoms/navigationBarAtom";
import PostCardSkeleton from "../Skeleton/Post/PostCardSkeleton";
import DiscussionCardSkeleton from "../Skeleton/Discussion/DiscussionCardSkeleton";
import MemberCardSkeleton from "../Skeleton/Member/MemberCardSkeleton";

type GroupPageLoaderProps = {
	children?: React.ReactNode;
	loadingGroup: boolean;
	groupPageData: GroupData | null;
};

const GroupPageLoader: React.FC<GroupPageLoaderProps> = ({
	children,
	loadingGroup,
	groupPageData,
}) => {
	const { third: currentGroupPage = "" } = useRecoilValue(currentDirectoryState);
	const { userStateValue, userMounted } = useUser();
	const { groupStateValue, setGroupStateValue, fetchUserJoin } = useGroup();
	const [fetchingGroupUserData, setFetchingGroupUserData] = useState(true);
	const router = useRouter();

	const fetchGroupUserData = useCallback(async () => {
		setFetchingGroupUserData(true);
		try {
			if (groupPageData) {
				const currentGroup = groupStateValue.groups.find(
					(group) => group.group.id === groupPageData.group.id
				);

				const userJoin = await fetchUserJoin(
					groupPageData.group.id,
					userStateValue.user.uid
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
									userJoin: userJoin,
								};
						  })
						: prev.groups,
					currentGroup: {
						...groupPageData,
						userJoin: userJoin,
						members: [],
					},
				}));
			}
		} catch (error: any) {
			console.error("=>fetchGroupUserData Error:\n" + error.message);
		} finally {
			setFetchingGroupUserData(false);
		}
	}, [
		fetchUserJoin,
		groupPageData,
		groupStateValue.groups,
		setGroupStateValue,
		userStateValue.user.uid,
	]);

	useEffect(() => {
		if (userMounted) {
			if (userStateValue.user) {
				fetchGroupUserData();
			}
		}
	}, [userMounted]);

	const renderLoadingPage = () => {
		switch (currentGroupPage) {
			case "":
			case "posts": {
				return (
					<>
						<PostCardSkeleton />
						<PostCardSkeleton />
					</>
				);

				break;
			}

			case "discussions": {
				return (
					<>
						<DiscussionCardSkeleton />
						<DiscussionCardSkeleton />
					</>
				);

				break;
			}

			case "members": {
				const renderMembersLoading = (count: number = 10) => {
					const result = [];

					for (let i = 0; i < count; i++) {
						result.push(
							<React.Fragment key={i}>
								<MemberCardSkeleton />
							</React.Fragment>
						);
					}

					return result;
				};

				return (
					<>
						<div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-4">
							{renderMembersLoading(10)}
						</div>
					</>
				);

				break;
			}

			default: {
				return (
					<>
						<p>Loading</p>
					</>
				);

				break;
			}
		}
	};

	return (
		<>
			<Head>
				<title>
					{loadingGroup || fetchingGroupUserData
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
			{loadingGroup || !userMounted || fetchingGroupUserData ? (
				<>{renderLoadingPage()}</>
			) : (
				<>
					{!groupStateValue.currentGroup ? (
						<>
							<p>Group Not Found</p>
						</>
					) : (
						<>{children && children}</>
					)}
				</>
			)}
		</>
	);
};

export default GroupPageLoader;
