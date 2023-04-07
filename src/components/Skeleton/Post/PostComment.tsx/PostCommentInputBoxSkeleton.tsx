import React from "react";

type PostCommentInputBoxSkeletonProps = {};

const PostCommentInputBoxSkeleton: React.FC<
	PostCommentInputBoxSkeletonProps
> = () => {
	return (
		<div className="w-full flex flex-col gap-y-2 animate-pulse">
			<div className="flex flex-row gap-x-2 h-10">
				<div className="h-10 w-10 aspect-square rounded-full skeleton-color"></div>
				<div className="flex-1 h-10 rounded-full skeleton-color"></div>
			</div>
			<div className="flex flex-row items-center h-10 justify-end">
				<div className="w-full max-w-[160px] h-6 skeleton-color rounded-full"></div>
			</div>
		</div>
	);
};

export default PostCommentInputBoxSkeleton;
