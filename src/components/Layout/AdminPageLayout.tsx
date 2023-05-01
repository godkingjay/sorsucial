import React, { useEffect, useRef } from "react";
import AdminNavigation from "../Controls/AdminNavigation";
import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { SetterOrUpdater } from "recoil";
import { NextRouter } from "next/router";
import { User } from "firebase/auth";
import { UserState } from "@/atoms/userAtom";
import LoadingScreen from "../Skeleton/LoadingScreen";
import { CurrentDirectory } from "./Layout";

type AdminPageLayoutProps = {
	children: React.ReactNode;
	navigationBarStateValue: NavigationBarState;
	setNavigationBarStateValue: SetterOrUpdater<NavigationBarState>;
	router: NextRouter;
	currentDirectory: CurrentDirectory;
	loadingUser: boolean;
	authLoading: boolean;
	authUser?: User | null;
	userStateValue: UserState;
	userMounted: boolean;
};

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
	children,
	navigationBarStateValue,
	setNavigationBarStateValue,
	router,
	currentDirectory,
	loadingUser,
	authLoading,
	authUser,
	userStateValue,
	userMounted,
}) => {
	const componentDidMount = useRef(false);

	useEffect(() => {
		if (currentDirectory.second) {
			const isPathOfAdmin = [
				"manage-users",
				"manage-groups",
				"manage-requests",
			].includes(currentDirectory.second);

			if (isPathOfAdmin) {
				setNavigationBarStateValue((prev) => ({
					...prev,
					adminPageNavBar: {
						...prev.adminPageNavBar,
						current:
							currentDirectory.second as NavigationBarState["adminPageNavBar"]["current"],
					},
				}));
			} else {
				console.log("Redirecting...");
				router.push("/admin");
			}
		} else {
			setNavigationBarStateValue((prev) => ({
				...prev,
				adminPageNavBar: {
					...prev.adminPageNavBar,
					current: "",
				},
			}));
		}
	}, [currentDirectory]);

	useEffect(() => {
		if (
			!loadingUser &&
			!authLoading &&
			authUser &&
			!userStateValue.user.roles.includes("admin") &&
			userMounted &&
			!componentDidMount.current
		) {
			componentDidMount.current = true;
			router.push("/");
		}
	}, [loadingUser, authLoading, authUser, userStateValue.user.roles]);

	return (
		<div className="flex-1">
			{loadingUser ||
			authLoading ||
			!userMounted ||
			!userStateValue.user.roles.includes("admin") ? (
				<LoadingScreen />
			) : (
				<>
					<AdminNavigation navigationBarStateValue={navigationBarStateValue} />
					<div className="w-full overflow-x-auto scroll-x-style">{children}</div>
				</>
			)}
		</div>
	);
};

export default AdminPageLayout;
