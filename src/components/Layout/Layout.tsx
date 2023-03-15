import React, { useEffect } from "react";
import useUser from "@/hooks/useUser";
import NavBar from "../NavBar/NavBar";
import Modals from "../Modal/Modals";
import PageLeftSidebar from "../Controls/PageLeftSidebar";
import { useRouter } from "next/router";
import MainPageLayout from "./MainPageLayout";

type LayoutProps = {
	children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const {
		authUser,
		loadingUser,
		authLoading,
		setLoadingUser,
		userStateValue,
		logOutUser,
	} = useUser();

	const router = useRouter();

	return (
		<main className="scroll-y-style flex flex-col max-h-screen h-screen overflow-y-auto relative bg-gray-100">
			{authLoading || loadingUser ? (
				<p>Loading</p>
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
						{children}
					</div>
				</>
			)}
			<Modals />
		</main>
	);
};

export default Layout;
