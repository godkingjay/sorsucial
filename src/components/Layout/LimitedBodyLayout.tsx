import React from "react";

type LimitedBodyLayoutProps = {
	children: React.ReactNode;
};

const LimitedBodyLayout: React.FC<LimitedBodyLayoutProps> = ({ children }) => {
	return (
		<div className="flex-1 flex flex-row justify-center">
			<div className="max-w-3xl flex-1 h-full mb-32">{children}</div>
		</div>
	);
};

export default LimitedBodyLayout;
