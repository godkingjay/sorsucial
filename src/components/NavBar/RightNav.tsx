import { UserState } from "@/atoms/userAtom";
import Image from "next/image";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

type RightNavProps = {
	userStateValue: UserState;
};

const RightNav: React.FC<RightNavProps> = ({ userStateValue }) => {
	return (
		<div className="h-full p-2">
			<div className="flex flex-row items-center h-full">
				<div className="h-10 w-10 rounded-full bg-gray-100 text-gray-400">
					{userStateValue.user.imageURL ? (
						<Image
							src={userStateValue.user.imageURL}
							alt="User Profile Picture"
							width={32}
							height={32}
							loading="lazy"
							className="rounded-full h-full w-full"
						/>
					) : userStateValue.user.gender ? (
						<></>
					) : (
						<FaUserCircle className="h-full w-full" />
					)}
				</div>
			</div>
		</div>
	);
};

export default RightNav;
