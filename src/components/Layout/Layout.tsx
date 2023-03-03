import React from "react";
import useUser from "@/hooks/useUser";
import NavBar from "../NavBar/NavBar";

type LayoutProps = {
	children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {} = useUser();

	return (
		<main className="scroll-y-style flex flex-col max-h-screen h-screen overflow-y-auto relative">
      <NavBar />
			{children}
		</main>
	);
};

export default Layout;
