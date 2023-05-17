import React, { useEffect } from "react";
import AdminNavigation from "../Controls/AdminNavigation";
import { useRouter } from "next/router";
import LoadingScreen from "../Skeleton/LoadingScreen";
import useUser from "@/hooks/useUser";

type AdminPageLayoutProps = {
	children: React.ReactNode;
};

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({ children }) => {
	const { userStateValue, loadingUser, authLoading, userMounted } = useUser();

	const router = useRouter();

	useEffect(() => {
		if (!userStateValue.user.roles.includes("admin") && userMounted) {
			router.push("/");
		}
	}, [userMounted]);

	return (
		<div className="flex-1">
			{loadingUser ||
			authLoading ||
			!userMounted ||
			!userStateValue.user.roles.includes("admin") ? (
				<LoadingScreen />
			) : (
				<>
					<AdminNavigation />
					<div className="w-full overflow-x-auto scroll-x-style">{children}</div>
				</>
			)}
		</div>
	);
};

export default AdminPageLayout;
