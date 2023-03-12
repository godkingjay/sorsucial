import React from "react";

type CreateAccountSkeletonProps = {};

const CreateAccountSkeleton: React.FC<CreateAccountSkeletonProps> = () => {
	return (
		<div className="w-full max-w-md flex flex-col bg-white shadow-around-sm rounded-xl min-h-[384px] animate-pulse gap-y-4 h-max">
			<div className="h-12 bg-logo-300 text-white rounded-t-xl flex flex-row items-center px-8 justify-center">
				<div className="bg-gray-500 bg-opacity-10 h-8 w-full max-w-xs rounded-md"></div>
			</div>
			<div className="flex flex-col gap-y-8 w-full px-8 items-center pb-8">
				<div className="flex flex-row gap-x-4 w-full items-center">
					<div className="h-20 w-20 aspect-square bg-gray-500 rounded-full bg-opacity-10"></div>
					<div className="flex flex-col gap-y-2 flex-1">
						<div className="w-[30%] h-6 bg-gray-500 rounded-md bg-opacity-10"></div>
						<div className="w-[75%] h-6 bg-gray-500 rounded-md bg-opacity-10"></div>
					</div>
				</div>
				<div className="flex flex-col gap-y-4 w-full">
					<div className="h-12 w-full bg-gray-500 rounded-md bg-opacity-10"></div>
					<div className="h-12 w-full bg-gray-500 rounded-md bg-opacity-10"></div>
				</div>
				<div className="h-12 w-full bg-gray-500 rounded-full bg-opacity-10"></div>
			</div>
		</div>
	);
};

export default CreateAccountSkeleton;
