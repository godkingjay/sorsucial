import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import NavBar from "../NavBar/NavBar";
import Modals from "../Modal/Modals";
import PageLeftSidebar from "../Controls/PageLeftSidebar";
import { useRouter } from "next/router";
import MainPageLayout from "./MainPageLayout";
import LoadingScreen from "../Skeleton/LoadingScreen";
import AdminPageLayout from "./AdminPageLayout";
import { useRecoilState } from "recoil";
import {
	NavigationBarState,
	navigationBarState,
} from "@/atoms/navigationBarAtom";

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
	const [navigationBarStateValue, setNavigationBarStateValue] =
		useRecoilState(navigationBarState);

	const router = useRouter();

	const checkCurrentDirectory =
		(): NavigationBarState["pageLeftSidebar"]["current"] => {
			const mainDirectory = router.pathname.split("/")[1];
			switch (mainDirectory) {
				case "":
					return "";
					break;

				case "admin":
					return "admin";
					break;

				case "feeds":
					return "feeds";
					break;

				case "discussions":
					return "discussions";
					break;

				case "groups":
					return "groups";
					break;

				default:
					return "none";
					break;
			}
		};

	useEffect(() => {
		setCurrentDirectory({
			main: router.pathname.split("/")[1],
		});
		setNavigationBarStateValue((prev) => ({
			...prev,
			pageLeftSidebar: {
				...prev.pageLeftSidebar,
				current: checkCurrentDirectory(),
			},
		}));
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
							navigationBarStateValue={navigationBarStateValue}
							setNavigationBarStateValue={setNavigationBarStateValue}
						/>
					)}
					<div className="flex-1 flex flex-row">
						{authUser && !userStateValue.user.isFirstLogin && (
							<PageLeftSidebar
								navigationBarStateValue={navigationBarStateValue}
								setNavigationBarStateValue={setNavigationBarStateValue}
							/>
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
