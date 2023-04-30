import React from "react";

type GroupCardSkeletonProps = {
	index: number;
};

const GroupCardSkeleton: React.FC<GroupCardSkeletonProps> = ({ index }) => {
	return (
		<div
			className="group-card-wrapper"
			data-top={index < 3}
		>
			<div className="shadow-page-box-1 bg-white rounded-lg flex flex-col entrance-animation-slide-from-right">
				<div className="p-4 flex flex-row gap-x-4">
					<div className="h-24 w-24 aspect-square skeleton-color rounded-lg"></div>
					<div className="flex-1 flex flex-col gap-y-4">
						<div className="flex flex-col gap-y-2">
							<div className="skeleton-color h-4 w-24 rounded-full"></div>
							<div className="skeleton-color h-2 w-16 rounded-full"></div>
						</div>
						<div className="flex flex-col gap-y-2">
							<div className="skeleton-color h-3 w-full rounded-full"></div>
							<div className="skeleton-color h-3 w-full rounded-full"></div>
							<div className="skeleton-color h-3 w-[50%] rounded-full"></div>
							<div className="my-2 w-full flex-wrap inline-flex flex-row gap-y-2 gap-x-4">
								<div className="skeleton-color h-3 w-8 rounded-full"></div>
								<div className="skeleton-color h-3 w-8 rounded-full"></div>
								<div className="skeleton-color h-3 w-8 rounded-full"></div>
								<div className="skeleton-color h-3 w-8 rounded-full"></div>
								<div className="skeleton-color h-3 w-8 rounded-full"></div>
							</div>
							<div className="flex flex-col items-end">
								<div className="skeleton-color h-4 w-24 rounded-full"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupCardSkeleton;
