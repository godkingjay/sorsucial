import Link from "next/link";
import React from "react";
import { BsPersonExclamation } from "react-icons/bs";
import { RxCaretRight } from "react-icons/rx";

const UserNotFound = () => {
	return (
		<>
			<div className="p-4 flex flex-col items-center">
				<div className="flex flex-col items-center max-w-sm my-4 text-gray-700 gap-y-4">
					<div className="h-32 w-32 p-4 bg-white rounded-full shadow-page-box-1 border-4 border-gray-100">
						<BsPersonExclamation className="h-full w-full" />
					</div>
					<div className="flex flex-col items-center gap-y-4">
						<p className="font-bold">This user could not be found!</p>
						<Link
							href={`/`}
							className="border-2 flex flex-row gap-x-1 items-center border-blue-500 rounded-full px-2 pl-4 py-2 text-sm font-semibold text-blue-500 group hover:bg-blue-100 hover:text-blue-600 focus:bg-blue-100 focus:text-blue-600"
						>
							<div>
								<p>Go to Homepage</p>
							</div>
							<div className="h-6 w-6 duration-200 group-hover:translate-x-1 group-focus:translate-x-1">
								<RxCaretRight className="h-full w-full" />
							</div>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserNotFound;
