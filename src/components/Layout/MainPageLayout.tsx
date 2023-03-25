import React from "react";

type MainPageLayoutProps = {
	children: React.ReactNode;
};

const MainPageLayout: React.FC<MainPageLayoutProps> = ({ children }) => {
	return <>{children}</>;
};

export default MainPageLayout;
