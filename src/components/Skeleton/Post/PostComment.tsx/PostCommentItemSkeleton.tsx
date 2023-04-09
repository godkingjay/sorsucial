import React from "react";

type PostCommentItemSkeletonProps = {};

const PostCommentItemSkeleton: React.FC<PostCommentItemSkeletonProps> = () => {
	return (
		<div className="flex flex-row gap-x-2 w-full relative min-h-[40px] animate-pulse">
			<div className="flex flex-row relative">
				<div className="z-0 flex flex-row h-10 w-10">
					<div className="h-full w-full skeleton-color rounded-full"></div>
				</div>
			</div>
			<div className="flex-1 flex flex-col gap-y-2">
				<div className="flex-1 flex flex-col gap-y-1">
					<div className="w-full flex-1 flex flex-row gap-x-2">
						<div className="flex flex-row flex-1">
							<div className="bg-gray-100 py-2 rounded-[20px] px-4 flex flex-col gap-y-2 flex-1">
								<div className="h-3 w-24 rounded-full skeleton-color"></div>
								<div className="w-full flex flex-col gap-y-2">
									<div className="h-3 w-full skeleton-color rounded-full"></div>
									<div className="h-3 w-full skeleton-color rounded-full"></div>
									<div className="h-3 w-[50%] skeleton-color rounded-full"></div>
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-row items-center gap-x-4 gap-y-2 text-xs font-semibold px-2 text-gray-500 flex-wrap">
						<div className="h-3 w-12 rounded-full skeleton-color"></div>
						<div className="h-3 w-12 rounded-full skeleton-color"></div>
					</div>
				</div>
			</div>
			<div className="absolute top-0 left-5 h-full w-max pt-12 translate-x-[-100%]">
				<div className="w-[2px] h-full bg-gray-200"></div>
			</div>
		</div>
	);
};

export default PostCommentItemSkeleton;
