import React from "react";
import AdminPageLayout from "./AdminPageLayout";
import MainPageLayout from "./MainPageLayout";
import { CurrentDirectory } from "./Layout";
import {
	NavigationBarState,
	navigationBarState,
} from "@/atoms/navigationBarAtom";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { NextRouter, useRouter } from "next/router";
import { User } from "firebase/auth";
import { UserState } from "@/atoms/userAtom";
import LoadingScreen from "../Skeleton/LoadingScreen";
import GroupPageLayout from "./GroupPageLayout";
import useUser from "@/hooks/useUser";
import UserPageLayout from "./UserPageLayout";

type PageContainerLayoutProps = {
	children: React.ReactNode;
	currentDirectory: CurrentDirectory;
};

const PageContainerLayout: React.FC<PageContainerLayoutProps> = ({
	children,
	currentDirectory,
}) => {
	const {
		authUser,
		loadingUser,
		authLoading,
		setLoadingUser,
		userStateValue,
		logOutUser,
		userMounted,
	} = useUser();

	const [navigationBarStateValue, setNavigationBarStateValue] =
		useRecoilState(navigationBarState);

	const router = useRouter();

	const defaultPage = () => {
		return <MainPageLayout>{children}</MainPageLayout>;
	};

	switch (currentDirectory.main) {
		case "admin": {
			return (
				<AdminPageLayout
					navigationBarStateValue={navigationBarStateValue}
					setNavigationBarStateValue={setNavigationBarStateValue}
					router={router}
					currentDirectory={currentDirectory}
					loadingUser={loadingUser}
					authLoading={authLoading}
					authUser={authUser}
					userStateValue={userStateValue}
					userMounted={userMounted}
				>
					{children}
				</AdminPageLayout>
			);
		}

		case "groups": {
			if (currentDirectory.second === "[groupId]") {
				return (
					<GroupPageLayout currentDirectory={currentDirectory}>
						{children}
					</GroupPageLayout>
				);
			} else {
				return defaultPage();
			}

			break;
		}

		case "user": {
			if (currentDirectory.second === "[userId]") {
				return (
					<UserPageLayout currentDirectory={currentDirectory}>
						{children}
					</UserPageLayout>
				);
			} else {
				return defaultPage();
			}

			break;
		}

		default: {
			return defaultPage();
			break;
		}
	}
};

export default PageContainerLayout;
