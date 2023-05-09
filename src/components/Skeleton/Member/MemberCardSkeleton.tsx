import React from "react";

type MemberCardSkeletonProps = {};

const MemberCardSkeleton: React.FC<MemberCardSkeletonProps> = () => {
	return (
		<div className="bg-white rounded-lg shadow-page-box-1 p-4 flex flex-row gap-x-2">
			<div className="h-16 w-16 rounded-full skeleton-color animate-pulse"></div>
			<div className="flex flex-1 flex-col gap-y-2">
				<div className="h-3 w-full rounded-full skeleton-color"></div>
				<div className="h-2 w-[50%] rounded-full skeleton-color"></div>
				<div className="my-2 flex flex-col gap-y-1">
					<div className="h-2 w-full rounded-full skeleton-color"></div>
				</div>
			</div>
		</div>
	);
};

export default MemberCardSkeleton;
