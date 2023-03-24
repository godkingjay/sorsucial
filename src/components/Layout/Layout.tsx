import React, { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import NavBar from "../NavBar/NavBar";
import Modals from "../Modal/Modals";
import PageLeftSidebar from "../Controls/PageLeftSidebar";
import { useRouter } from "next/router";
import MainPageLayout from "./MainPageLayout";
import LoadingScreen from "../Skeleton/LoadingScreen";
// import AdminPageLayout from "./AdminPageLayout";
import { useRecoilState } from "recoil";
import {
	NavigationBarState,
	navigationBarState,
} from "@/atoms/navigationBarAtom";
import AdminModals from "../Modal/AdminModals";
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
		userMounted,
	} = useUser();
	const [navigationBarStateValue, setNavigationBarStateValue] =
		useRecoilState(navigationBarState);

	const router = useRouter();

	const checkCurrentDirectory = (
		level: string
	): NavigationBarState["pageLeftSidebar"]["current"] => {
		switch (level) {
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
		const directory = router.pathname.split("/");
		const mainDirectory = directory[1];
		setCurrentDirectory({
			main: router.pathname.split("/")[1],
		});
		setNavigationBarStateValue((prev) => ({
			...prev,
			pageLeftSidebar: {
				...prev.pageLeftSidebar,
				current: checkCurrentDirectory(mainDirectory),
			},
		}));
	}, [router.pathname]);

	return (
		<main className="scroll-y-style flex flex-col max-h-screen h-screen overflow-y-auto relative bg-gray-100">
			{(authLoading && !authUser) ||
			(loadingUser && !userStateValue.user.uid) ? (
				<>
					<LoadingScreen />
				</>
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
								userStateValue={userStateValue}
							/>
						)}
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
					</div>
				</>
			)}
			<Modals userStateValue={userStateValue} />
			{userStateValue.user.roles.includes("admin") && <AdminModals />}
		</main>
	);
};

export default Layout;
