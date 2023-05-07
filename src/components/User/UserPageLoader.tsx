import useUser from "@/hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import LimitedBodyLayout from "../Layout/LimitedBodyLayout";
import { UserState } from "@/atoms/userAtom";

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
	const { userStateValue, setUserStateValue, userMounted } = useUser();

	const [fetchingCurrentUserData, setFetchingCurrentUserData] = useState(true);

	const router = useRouter();

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
	}, []);

	useEffect(() => {
		if (userMounted) {
			fetchCurrentUserData();
		}
	}, [userMounted]);

	return (
		<>
			<Head>
				<title>
					{loadingUser
						? "Loading..."
						: !userStateValue.userPage
						? "User not Found!"
						: `${userStateValue.userPage.user.firstName} ${userStateValue.userPage.user.lastName} | Profile`}
				</title>
			</Head>
			{loadingUser || !userMounted || fetchingCurrentUserData ? (
				<>
					<p>Loading User</p>
				</>
			) : (
				<>
					{!userStateValue.userPage ? (
						<>
							<p>User Not Found</p>
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
