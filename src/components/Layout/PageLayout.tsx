import React from "react";

type PageLayoutProps = {
	children: React.ReactNode;
};

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
	return (
		<div className="flex-1 flex flex-row justify-center">
			<div className="flex-1 flex flex-col items-center">
				<div className="max-w-3xl w-full">{children}</div>
			</div>
			<div className="hidden md:block w-56 ml-auto h-full bg-gray-200"></div>
		</div>
	);
};

export default PageLayout;
