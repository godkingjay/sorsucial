import React from "react";
import useUser from "@/hooks/useUser";
import NavBar from "../NavBar/NavBar";

type LayoutProps = {
	children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { authUser, loadingUser, authLoading, setLoadingUser, userStateValue } =
		useUser();

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
						/>
					)}
					{children}
				</>
			)}
		</main>
	);
};

export default Layout;
