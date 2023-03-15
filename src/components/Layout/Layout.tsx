import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import NavBar from "../NavBar/NavBar";
import Modals from "../Modal/Modals";
import PageLeftSidebar from "../Controls/PageLeftSidebar";
import { useRouter } from "next/router";
import MainPageLayout from "./MainPageLayout";
import LoadingScreen from "../Skeleton/LoadingScreen";
import AdminPageLayout from "./AdminPageLayout";

type LayoutProps = {
	children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [currentDirectory, setCurrentDirectory] = useState({
		main: "",
	});
	const {
		authUser,
		loadingUser,
		authLoading,
		setLoadingUser,
		userStateValue,
		logOutUser,
	} = useUser();

	const router = useRouter();

	useEffect(() => {
		setCurrentDirectory({
			main: router.pathname.split("/")[1],
		});
	}, [router.pathname]);

	return (
		<main className="scroll-y-style flex flex-col max-h-screen h-screen overflow-y-auto relative bg-gray-100">
			{authLoading || loadingUser ? (
				<LoadingScreen />
			) : (
				<>
					{authUser && !userStateValue.user.isFirstLogin && (
						<NavBar
							userStateValue={userStateValue}
							authLoading={authLoading}
							logOutUser={logOutUser}
						/>
					)}
					<div className="flex-1 flex flex-row">
						{authUser && !userStateValue.user.isFirstLogin && (
							<PageLeftSidebar />
						)}
						{currentDirectory.main === "admin" ? (
							<AdminPageLayout>{children}</AdminPageLayout>
						) : (
							<MainPageLayout>{children}</MainPageLayout>
						)}
					</div>
				</>
			)}
			<Modals />
		</main>
	);
};

export default Layout;
