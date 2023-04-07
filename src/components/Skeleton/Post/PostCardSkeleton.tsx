import React from "react";

type PostCardSkeletonProps = {};

const PostCardSkeleton: React.FC<PostCardSkeletonProps> = () => {
	return (
		<div className="shadow-page-box-1 bg-white rounded-lg flex flex-col gap-y-2">
			<div className="pt-4 px-4 flex flex-1 flex-row items-center gap-x-4 animate-pulse">
				<div className="h-12 w-12 aspect-square skeleton-color rounded-full"></div>
				<div className="flex flex-col flex-1 gap-2">
					<div className="h-4 w-[40%] min-w-[128px] skeleton-color rounded-sm"></div>
					<div className="h-2 w-[20%] min-w-[72px] skeleton-color rounded-sm"></div>
				</div>
				<div className="h-8 w-8 skeleton-color rounded-full mb-auto"></div>
			</div>
			<div className="flex flex-col p-4 gap-y-4 animate-pulse">
				<div className="w-[50%] min-w-[256px] h-6 skeleton-color rounded-md"></div>
				<div className="flex flex-col gap-y-3">
					<div className="w-[100%] h-4 skeleton-color rounded-md"></div>
					<div className="w-[100%] h-4 skeleton-color rounded-md"></div>
					<div className="w-[25%] h-4 skeleton-color rounded-md"></div>
				</div>
				<div className="flex flex-col gap-y-3">
					<div className="w-[100%] h-4 skeleton-color rounded-md"></div>
					<div className="w-[75%] h-4 skeleton-color rounded-md"></div>
				</div>
			</div>
			<div className="p-1 flex flex-1 flex-row h-12 animate-pulse">
				<div className="flex-1 flex flex-row h-10 items-center justify-center gap-x-2 px-2">
					<div className="h-8 w-8 rounded-xl skeleton-color"></div>
					<div className="hidden xs:block h-6 flex-1 max-w-[96px] skeleton-color rounded-md"></div>
				</div>
				<div className="flex-1 flex flex-row h-10 items-center justify-center gap-x-2 px-2">
					<div className="h-8 w-8 rounded-xl skeleton-color"></div>
					<div className="hidden xs:block h-6 flex-1 max-w-[96px] skeleton-color rounded-md"></div>
				</div>
				<div className="flex-1 flex flex-row h-10 items-center justify-center gap-x-2 px-2">
					<div className="h-8 w-8 rounded-xl skeleton-color"></div>
					<div className="hidden xs:block h-6 flex-1 max-w-[96px] skeleton-color rounded-md"></div>
				</div>
			</div>
		</div>
	);
};

export default PostCardSkeleton;
