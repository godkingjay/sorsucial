import React from "react";

type DiscussionReplyItemSkeletonProps = {
	replyLevel: number;
	parentShowReplyBox: boolean;
};

const DiscussionReplyItemSkeleton: React.FC<
	DiscussionReplyItemSkeletonProps
> = ({ replyLevel, parentShowReplyBox }) => {
	return (
		<div
			className="comment-item flex flex-row gap-x-2 w-full relative min-h-[40px] animate-pulse entrance-animation-slide-from-right"
			show-comment-box={parentShowReplyBox ? "true" : "false"}
		>
			<div className="left flex flex-row relative">
				{replyLevel > 0 && (
					<div className="deco-lines -z-0 absolute h-full w-10 top-0 left-0">
						<div className="straight h-full w-0 border-l-2 absolute bottom-0 -left-8 translate-x-[2px]"></div>
						<div className="curve h-8 w-[28px] absolute right-full -top-3 -translate-x-[2px] border-2 border-gray-200 border-t-transparent border-r-transparent rounded-bl-2xl"></div>
					</div>
				)}
				<div className="z-0 flex flex-row h-10 w-10">
					<div className="h-full w-full skeleton-color rounded-full"></div>
				</div>
			</div>
			<div className="flex-1 flex flex-col gap-y-2">
				<div className="flex-1 flex flex-col gap-y-1">
					<div className="w-full flex-1 flex flex-row gap-x-2">
						<div className="flex flex-row flex-1">
							<div className="py-2 rounded-[20px] px-4 flex flex-col gap-y-4 flex-1">
								<div className="flex flex-col gap-y-2">
									<div className="h-3 w-24 rounded-full skeleton-color"></div>
									<div className="h-2 w-16 rounded-full skeleton-color"></div>
								</div>
								<div className="w-full flex flex-col gap-y-2">
									<div className="h-3 w-full skeleton-color rounded-full"></div>
									<div className="h-3 w-full skeleton-color rounded-full"></div>
									<div className="h-3 w-[50%] skeleton-color rounded-full"></div>
								</div>
								<div className="w-full flex flex-row gap-x-4">
									<div className="h-3 w-8 skeleton-color rounded-full"></div>
									<div className="h-3 w-8 skeleton-color rounded-full"></div>
									<div className="h-3 w-8 skeleton-color rounded-full"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DiscussionReplyItemSkeleton;
