import React from "react";
import AdminNavigation from "../Controls/AdminNavigation";
import { NavigationBarState } from "@/atoms/navigationBarAtom";
import { SetterOrUpdater } from "recoil";

type AdminPageLayoutProps = {
	children: React.ReactNode;
	navigationBarStateValue: NavigationBarState;
	setNavigationBarStateValue: SetterOrUpdater<NavigationBarState>;
};

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
	children,
	navigationBarStateValue,
	setNavigationBarStateValue,
}) => {
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
