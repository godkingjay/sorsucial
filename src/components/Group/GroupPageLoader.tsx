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
import { BiLockAlt } from "react-icons/bi";
import GroupAboutCardSkeleton from "../Skeleton/Group/GroupAboutCardSkeleton";

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
					<div className="page-wrapper">
						<PostCardSkeleton />
						<PostCardSkeleton />
					</div>
				);

				break;
			}

			case "discussions": {
				return (
					<div className="page-wrapper">
						<DiscussionCardSkeleton />
						<DiscussionCardSkeleton />
					</div>
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
					<div className="p-4 md:px-8">
						<div className="md:px-0 grid grid-cols-1 md:grid-cols-2 gap-4">
							{renderMembersLoading(10)}
						</div>
					</div>
				);

				break;
			}

			case "about": {
				return (
					<div className="p-4">
						<GroupAboutCardSkeleton />
					</div>
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
						<>
							{groupStateValue.currentGroup.group.privacy === "private" &&
							!groupStateValue.currentGroup.userJoin?.roles?.includes(
								"member"
							) ? (
								<>
									<LimitedBodyLayout>
										<div className="page-wrapper">
											<div className="shadow-page-box-1 page-box-1 p-4 flex flex-col items-center gap-y-4">
												<div className="h-32 w-32 p-6 rounded-full bg-gray-100 text-gray-700">
													<BiLockAlt className="h-full w-full" />
												</div>
												<div className="text-center flex flex-col gap-y-2 pb-8 max-w-sm">
													<p className="font-bold text-gray-700 text-3xl">
														{groupStateValue.currentGroup.group.name}
													</p>
													<p className="text-gray-500">
														Is a private group. You must be a member to view its
														contents.
													</p>
												</div>
											</div>
										</div>
									</LimitedBodyLayout>
								</>
							) : (
								<>{children && children}</>
							)}
						</>
					)}
				</>
			)}
		</>
	);
};

export default GroupPageLoader;
