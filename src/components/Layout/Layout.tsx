import React, { useEffect } from "react";
import useUser from "@/hooks/useUser";
import NavBar from "../NavBar/NavBar";
import Modals from "../Modal/Modals";
import PageLeftSidebar from "../Controls/PageLeftSidebar";
import { useRouter } from "next/router";
import LoadingScreen from "../Skeleton/LoadingScreen";
import { useRecoilState } from "recoil";
import {
	NavigationBarState,
	currentDirectoryState,
	navigationBarState,
} from "@/atoms/navigationBarAtom";
import AdminModals from "../Modal/AdminModals";
import PageContainerLayout from "./PageContainerLayout";
import LoadingBar from "../Events/LoadingBar";

type LayoutProps = {
	children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [currentDirectoryStateValue, setCurrentDirectoryStateValue] =
		useRecoilState(currentDirectoryState);

	const {
		authUser,
		loadingUser,
		authLoading,
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
		setCurrentDirectoryStateValue({
			main: directory[1],
			second: directory[2],
			third: directory[3],
			fourth: directory[4],
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
			<LoadingBar />
			{(!userMounted && currentDirectoryStateValue.main !== "auth") ||
			authLoading ||
			loadingUser ||
			(authUser && !userMounted) ? (
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
						<PageContainerLayout>{children}</PageContainerLayout>
					</div>
				</>
			)}
			<Modals userStateValue={userStateValue} />
			{userStateValue.user.roles.includes("admin") && <AdminModals />}
		</main>
	);
};

export default Layout;
