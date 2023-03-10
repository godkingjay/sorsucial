import React from "react";
import useUser from "@/hooks/useUser";
import NavBar from "../NavBar/NavBar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";

type LayoutProps = {
	children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { authUser, loadingUser, authLoading, setLoadingUser } = useUser();
	return (
		<main className="scroll-y-style flex flex-col max-h-screen h-screen overflow-y-auto relative bg-gray-100">
			{authLoading ? (
				<p>Loading</p>
			) : (
				<>
					{authUser && <NavBar />}
					{children}
				</>
			)}
		</main>
	);
};

export default Layout;
