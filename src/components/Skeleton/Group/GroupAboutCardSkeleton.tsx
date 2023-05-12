import React from "react";

const GroupAboutCardSkeleton = () => {
	return (
		<div className="p-4 shadow-page-box-1 bg-white rounded-lg flex flex-col">
			<div className="flex flex-col gap-y-4 animate-pulse">
				<div className="skeleton-color w-[25%] min-w-[192px] h-4 rounded-full"></div>
				<div className="divider"></div>
				<div className="flex flex-col gap-y-2">
					<div className="skeleton-color w-full h-3 rounded-full"></div>
					<div className="skeleton-color w-full h-3 rounded-full"></div>
					<div className="skeleton-color w-full h-3 rounded-full"></div>
					<div className="skeleton-color w-[50%] h-3 rounded-full"></div>
				</div>
				<div className="divider"></div>
				<div className="flex flex-row gap-x-4">
					<div className="h-8 w-8 skeleton-color rounded-full m-1"></div>
					<div className="flex-1 flex flex-col gap-y-2 mt-2">
						<div className="w-40 rounded-full h-3 skeleton-color"></div>
						<div className="w-full rounded-full h-2 skeleton-color"></div>
					</div>
				</div>
				<div className="flex flex-row gap-x-4">
					<div className="h-8 w-8 skeleton-color rounded-full m-1"></div>
					<div className="flex-1 flex flex-col gap-y-2 mt-2">
						<div className="w-40 rounded-full h-3 skeleton-color"></div>
						<div className="w-full max-w-2xs rounded-full h-2 skeleton-color"></div>
					</div>
				</div>
				<div className="flex flex-row gap-x-4">
					<div className="h-8 w-8 skeleton-color rounded-full m-1"></div>
					<div className="flex-1 flex flex-col gap-y-2 mt-2">
						<div className="w-40 rounded-full h-3 skeleton-color"></div>
						<div className="w-full max-w-2xs rounded-full h-2 skeleton-color"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupAboutCardSkeleton;
