import useUser from "@/hooks/useUser";
import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import LimitedBodyLayout from "../Layout/LimitedBodyLayout";
import UserNotFound from "../Error/UserNotFound";
import { UserState } from "@/atoms/userAtom";
import { useRouter } from "next/router";

type UserSettingsPageLoaderProps = {
	children?: React.ReactNode;
	loadingUser: boolean;
	userData: UserState["userPage"];
};

const UserSettingsPageLoader: React.FC<UserSettingsPageLoaderProps> = ({
	children,
	loadingUser,
	userData,
}) => {
	const { userStateValue, setUserStateValue, userMounted } = useUser();

	const [fetchingCurrentUserData, setFetchingCurrentUserData] = useState(true);

	const fetchCurrentUserData = useCallback(async () => {
		setFetchingCurrentUserData(true);
		try {
			if (userData) {
				setUserStateValue((prev) => ({
					...prev,
					user: prev.user.uid === userData.user.uid ? userData.user : prev.user,
				}));
			}
		} catch (error: any) {
			console.log(
				`=>Hook: Hook Fetch Current User Data Error:\n${error.message}`
			);
		}
		setFetchingCurrentUserData(false);
	}, [setUserStateValue, userData]);

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
						: !userStateValue.user
						? "User not Found!"
						: `User Settings | SorSUcial`}
				</title>
			</Head>
			{loadingUser || !userMounted || fetchingCurrentUserData ? (
				<>
					<p>Loading</p>
				</>
			) : (
				<>
					{!userStateValue.user && !fetchingCurrentUserData ? (
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

export default UserSettingsPageLoader;
