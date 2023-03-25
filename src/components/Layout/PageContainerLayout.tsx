import React from "react";
import AdminPageLayout from "./AdminPageLayout";
import MainPageLayout from "./MainPageLayout";
import { CurrentDirectory } from "./Layout";
import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { SetterOrUpdater } from "recoil";
import { NextRouter } from "next/router";
import { User } from "firebase/auth";
import { UserState } from "@/atoms/userAtom";
import LoadingScreen from "../Skeleton/LoadingScreen";

type PageContainerLayoutProps = {
	children: React.ReactNode;
	currentDirectory: CurrentDirectory;
	navigationBarStateValue: NavigationBarState;
	setNavigationBarStateValue: SetterOrUpdater<NavigationBarState>;
	router: NextRouter;
	loadingUser: boolean;
	authLoading: boolean;
	authUser?: User | null;
	userStateValue: UserState;
	userMounted: boolean;
};

const PageContainerLayout: React.FC<PageContainerLayoutProps> = ({
	children,
	currentDirectory,
	navigationBarStateValue,
	setNavigationBarStateValue,
	router,
	loadingUser,
	authLoading,
	authUser,
	userStateValue,
	userMounted,
}) => {
	return (
		<>
			{currentDirectory.main === "admin" ? (
				<AdminPageLayout
					navigationBarStateValue={navigationBarStateValue}
					setNavigationBarStateValue={setNavigationBarStateValue}
					router={router}
					loadingUser={loadingUser}
					authLoading={authLoading}
					authUser={authUser}
					userStateValue={userStateValue}
					userMounted={userMounted}
				>
					{children}
				</AdminPageLayout>
			) : (
				<MainPageLayout>{children}</MainPageLayout>
			)}
		</>
	);
};

export default PageContainerLayout;
