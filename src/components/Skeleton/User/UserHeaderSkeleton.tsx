import React from "react";

const UserHeaderSkeleton = () => {
	return (
		<div className="flex-1">
			<div className="z-20 flex flex-col">
				<div className="w-full flex flex-col items-center shadow-page-box-1 bg-white">
					<div className="flex flex-col w-full max-w-5xl animate-pulse">
						<div className="relative flex flex-col px-0 md:mx-8 aspect-[3/1] bg-gray-200 overflow-hidden md:rounded-b-2xl">
							<div className="w-full h-full skeleton-skeleton-color"></div>
						</div>
						<div className="h-32 p-4 flex flex-row gap-x-4 ">
							<div className="relative border-4 border-white flex md:ml-8 -translate-y-8 sm:-translate-y-12 h-28 w-28 sm:h-36 sm:w-36 aspect-square rounded-full bg-gray-100">
								<div className="h-full w-full skeleton-color rounded-full"></div>
							</div>
							<div className="flex-1 flex flex-col gap-y-4">
								<div className="h-6 max-w-xs w-full skeleton-color rounded-full"></div>
								<div className="flex flex-row gap-x-4">
									<div className="h-3 max-w-[64px] w-full skeleton-color rounded-full"></div>
									<div className="h-3 max-w-[64px] w-full skeleton-color rounded-full"></div>
									<div className="h-3 max-w-[64px] w-full skeleton-color rounded-full"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="z-20 sticky flex flex-col items-center top-14 bg-white shadow-page-box-1">
				<div className="w-full max-w-4xl flex flex-row px-8 py-1 overflow-x-auto scroll-x-style animate-pulse">
					<div className="h-4 my-2 mx-4 w-24 skeleton-color rounded-full"></div>
					<div className="h-4 my-2 mx-4 w-24 skeleton-color rounded-full"></div>
					<div className="h-4 my-2 mx-4 w-24 skeleton-color rounded-full"></div>
					<div className="h-4 my-2 mx-4 w-24 skeleton-color rounded-full"></div>
					<div className="h-4 my-2 mx-4 w-24 skeleton-color rounded-full"></div>
					<div className="h-4 my-2 mx-4 w-24 skeleton-color rounded-full"></div>
				</div>
			</div>
		</div>
	);
};

export default UserHeaderSkeleton;
