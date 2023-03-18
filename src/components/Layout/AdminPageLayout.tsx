import React, { useEffect } from "react";
import AdminNavigation from "../Controls/AdminNavigation";
import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { SetterOrUpdater } from "recoil";
import { NextRouter } from "next/router";
import { User } from "firebase/auth";
import { UserState } from "@/atoms/userAtom";
import LoadingScreen from "../Skeleton/LoadingScreen";
import useAdmin from "@/hooks/useAdmin";

type AdminPageLayoutProps = {
	children: React.ReactNode;
	navigationBarStateValue: NavigationBarState;
	setNavigationBarStateValue: SetterOrUpdater<NavigationBarState>;
	router: NextRouter;
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
	loadingUser,
	authLoading,
	authUser,
	userStateValue,
	userMounted,
}) => {
	const { adminStateValue, adminFetchUsers } = useAdmin();

	useEffect(() => {
		if (!authUser) {
			return;
		}
		const levelTwo = router.pathname.split("/")[2];
		if (levelTwo) {
			const isPathOfAdmin = [
				"manage-users",
				"manage-groups",
				"manage-requests",
			].includes(levelTwo);

			if (isPathOfAdmin) {
				setNavigationBarStateValue((prev) => ({
					...prev,
					adminPageNavBar: {
						...prev.adminPageNavBar,
						current:
							levelTwo as NavigationBarState["adminPageNavBar"]["current"],
					},
				}));
			} else {
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
	}, [router.pathname, loadingUser, authUser]);

	useEffect(() => {
		if (
			!loadingUser &&
			!authLoading &&
			authUser &&
			!userStateValue.user.roles.includes("admin") &&
			userMounted
		) {
			router.push("/");
		}
	}, [loadingUser, authLoading, authUser, userStateValue.user.roles]);

	if (loadingUser || authLoading || !userMounted) {
		return <LoadingScreen />;
	}

	return (
		<div className="flex-1">
			<AdminNavigation
				navigationBarStateValue={navigationBarStateValue}
				setNavigationBarStateValue={setNavigationBarStateValue}
			/>
			<div className="w-full overflow-x-auto scroll-x-style">{children}</div>
		</div>
	);
};

export default AdminPageLayout;
