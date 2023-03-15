import React, { useEffect } from "react";
import AdminNavigation from "../Controls/AdminNavigation";
import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { SetterOrUpdater } from "recoil";
import { NextRouter } from "next/router";

type AdminPageLayoutProps = {
	children: React.ReactNode;
	navigationBarStateValue: NavigationBarState;
	setNavigationBarStateValue: SetterOrUpdater<NavigationBarState>;
	router: NextRouter;
};

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
	children,
	navigationBarStateValue,
	setNavigationBarStateValue,
	router,
}) => {
	useEffect(() => {
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
	}, [router.pathname]);

	return (
		<div className="flex flex-col flex-1">
			<AdminNavigation
				navigationBarStateValue={navigationBarStateValue}
				setNavigationBarStateValue={setNavigationBarStateValue}
			/>
			<div className="flex-1 w-full">{children}</div>
		</div>
	);
};

export default AdminPageLayout;
