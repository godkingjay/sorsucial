import useUser from "@/hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import LimitedBodyLayout from "../Layout/LimitedBodyLayout";
import { UserState } from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import { currentDirectoryState } from "@/atoms/navigationBarAtom";
import PostCardSkeleton from "../Skeleton/Post/PostCardSkeleton";
import DiscussionCardSkeleton from "../Skeleton/Discussion/DiscussionCardSkeleton";
import MemberCardSkeleton from "../Skeleton/Member/MemberCardSkeleton";
import UserHeaderSkeleton from "../Skeleton/User/UserHeaderSkeleton";
import GroupCardSkeleton from "../Skeleton/Group/GroupCardSkeleton";
import { BsPersonExclamation } from "react-icons/bs";
import Link from "next/link";
import { RxCaretRight } from "react-icons/rx";
import UserNotFound from "../Error/UserNotFound";

type UserPageLoaderProps = {
	children?: React.ReactNode;
	loadingUser: boolean;
	userPageData: UserState["userPage"];
};

const UserPageLoader: React.FC<UserPageLoaderProps> = ({
	children,
	loadingUser,
	userPageData,
}) => {
	const { third: currentGroupPage = "" } = useRecoilValue(currentDirectoryState);

	const { userStateValue, setUserStateValue, userMounted } = useUser();

	const [fetchingCurrentUserData, setFetchingCurrentUserData] = useState(true);

	const router = useRouter();

	const { userId } = router.query;

	const fetchCurrentUserData = useCallback(async () => {
		setFetchingCurrentUserData(true);
		try {
			if (userPageData) {
				setUserStateValue((prev) => ({
					...prev,
					userPage: userPageData,
				}));
			}
		} catch (error: any) {
			console.log(
				`=>Hook: Hook Fetch Current User Data Error:\n${error.message}`
			);
		}
		setFetchingCurrentUserData(false);
	}, [setUserStateValue, userPageData]);

	useEffect(() => {
		if (userMounted) {
			fetchCurrentUserData();
		}
	}, [userMounted, userId]);

	const renderLoadingPage = () => {
		switch (currentGroupPage) {
			case "":
			case "posts": {
				const renderPostsLoading = (count: number = 4) => {
					const result = [];

					for (let i = 0; i < count; i++) {
						result.push(
							<React.Fragment key={i}>
								<PostCardSkeleton />
							</React.Fragment>
						);
					}

					return result;
				};

				return <div className="page-wrapper">{renderPostsLoading(4)}</div>;

				break;
			}

			case "discussions": {
				const renderDiscussionsLoading = (count: number = 4) => {
					const result = [];

					for (let i = 0; i < count; i++) {
						result.push(
							<React.Fragment key={i}>
								<PostCardSkeleton />
							</React.Fragment>
						);
					}

					return result;
				};

				return <div className="page-wrapper">{renderDiscussionsLoading(4)}</div>;

				break;
			}

			case "connections": {
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

			case "groups": {
				const renderGroupsLoading = (count: number) => {
					let result = [];

					for (let i = 0; i < count; i++) {
						result.push(
							<React.Fragment key={i}>
								<GroupCardSkeleton index={i} />
							</React.Fragment>
						);
					}

					return result;
				};

				return (
					<>
						<div className="page-wrapper">
							<div className="px-4 sm:px-0 grid grid-cols-1 md:grid-cols-2 gap-4">
								{renderGroupsLoading(11)}
							</div>
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
					{loadingUser
						? "Loading..."
						: !userStateValue.userPage
						? "User not Found!"
						: `${userStateValue.userPage.user.firstName} ${userStateValue.userPage.user.lastName} | SorSUcial`}
				</title>
			</Head>
			{loadingUser || !userMounted || fetchingCurrentUserData ? (
				<>
					{userStateValue.userPage?.user.uid !== userId && (
						<>
							<UserHeaderSkeleton />
						</>
					)}
					<LimitedBodyLayout>{renderLoadingPage()}</LimitedBodyLayout>
				</>
			) : (
				<>
					{!userStateValue.userPage && !fetchingCurrentUserData ? (
						<>
							<LimitedBodyLayout>
								<UserNotFound />
							</LimitedBodyLayout>
						</>
					) : (
						<>{children && children}</>
					)}
				</>
			)}
		</>
	);
};

export default UserPageLoader;
