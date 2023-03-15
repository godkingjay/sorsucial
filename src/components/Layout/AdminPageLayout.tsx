import React from "react";
import AdminNavigation from "../Controls/AdminNavigation";

type AdminPageLayoutProps = {
	children: React.ReactNode;
};

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({ children }) => {
	return (
		<div className="flex flex-col flex-1">
			<AdminNavigation />
			<div className="flex-1 w-full">{children}</div>
		</div>
	);
};

export default AdminPageLayout;
