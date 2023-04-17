import React from "react";
import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";

type DiscussionCardSkeletonProps = {};

const DiscussionCardSkeleton: React.FC<DiscussionCardSkeletonProps> = () => {
	return (
		<div className="shadow-page-box-1 bg-white rounded-lg flex flex-col entrance-animation-slide-from-right">
			<div className="flex flex-row text-gray-300">
				<div className="flex flex-col items-center p-2 bg-gray-100 rounded-l-lg">
					<div className="flex flex-col items-center animate-pulse">
						<div className="h-8 w-8 aspect-square">
							<TbArrowBigUp className="h-full w-full stroke-1" />
						</div>
						<div className="my-1 w-6 h-2 skeleton-color rounded-full"></div>
						<div className="h-8 w-8 aspect-square">
							<TbArrowBigDown className="h-full w-full stroke-1" />
						</div>
					</div>
				</div>
				<div className="flex flex-col flex-1 gap-y-2">
					<div className="pt-4 px-4 flex flex-1 flex-row items-center gap-x-4 animate-pulse">
						<div className="h-10 w-10 aspect-square skeleton-color rounded-full"></div>
						<div className="flex flex-col flex-1 gap-2">
							<div className="h-4 w-[40%] min-w-[128px] skeleton-color rounded-full"></div>
							<div className="h-2 w-[20%] min-w-[72px] skeleton-color rounded-full"></div>
						</div>
						<div className="h-8 w-8 skeleton-color rounded-full mb-auto"></div>
					</div>
					<div className="flex flex-col p-4 gap-y-4 animate-pulse">
						<div className="w-[50%] min-w-[256px] h-5 skeleton-color rounded-full"></div>
						<div className="flex flex-col gap-y-3">
							<div className="w-[100%] h-3 skeleton-color rounded-full"></div>
							<div className="w-[100%] h-3 skeleton-color rounded-full"></div>
							<div className="w-[25%] h-3 skeleton-color rounded-full"></div>
						</div>
						<div className="flex flex-col gap-y-3">
							<div className="w-[100%] h-3 skeleton-color rounded-full"></div>
							<div className="w-[75%] h-3 skeleton-color rounded-full"></div>
						</div>
					</div>
					<div className="p-1 flex flex-1 flex-row h-10 animate-pulse items-center justify-start gap-x-4">
						<div className="w-max flex flex-row h-8 items-center gap-x-2 px-2">
							<div className="hidden xs:block h-3 min-w-[64px] w-full max-w-[96px] skeleton-color rounded-full"></div>
						</div>
						<div className="w-max flex flex-row h-8 items-center gap-x-2 px-2">
							<div className="hidden xs:block h-3 min-w-[64px] w-full max-w-[96px] skeleton-color rounded-full"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DiscussionCardSkeleton;
