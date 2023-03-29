import React from "react";

type MainPageLayoutProps = {
	children: React.ReactNode;
};

const MainPageLayout: React.FC<MainPageLayoutProps> = ({ children }) => {
	return (
		<div className="flex-1 flex flex-row justify-center min-w-[320px] h-full">
			<div className="flex-1 h-full">{children}</div>
		</div>
	);
};

export default MainPageLayout;
