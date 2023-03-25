import React from "react";

type LimitedBodyLayoutProps = {
	children: React.ReactNode;
};

const LimitedBodyLayout: React.FC<LimitedBodyLayoutProps> = ({ children }) => {
	return (
		<div className="flex-1 flex flex-row justify-center min-w-[256px] h-full">
			<div className="max-w-3xl w-full h-full">{children}</div>
		</div>
	);
};

export default LimitedBodyLayout;
