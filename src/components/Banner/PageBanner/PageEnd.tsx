import React from "react";

type PageEndProps = {
	message?: string;
};

const PageEnd: React.FC<PageEndProps> = ({ message = "End of Page" }) => {
	return (
		<div className="h-16 flex flex-col items-center justify-center">
			<div className="flex flex-row items-center w-full gap-x-4">
				<div className="flex-1 h-[1px] bg-gray-300"></div>
				<p className="text-gray-400">{message}</p>
				<div className="flex-1 h-[1px] bg-gray-300"></div>
			</div>
		</div>
	);
};

export default PageEnd;
