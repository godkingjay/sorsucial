import { SiteUser } from "@/lib/interfaces/user";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

type UserIconProps = {
	user: SiteUser | null;
};

const UserIcon: React.FC<UserIconProps> = ({ user }) => {
	return (
		<>
			{user ? (
				<Link
					href={`/user/${user.uid}`}
					title={`${user.firstName} ${user.lastName}`}
					className="h-full w-full relative aspect-square rounded-full overflow-hidden border border-transparent text-gray-300"
				>
					{user.imageURL ? (
						<Image
							src={user.imageURL}
							alt="User Profile Picture"
							sizes="128px"
							fill
							loading="lazy"
							className="w-full bg-center object-cover"
						/>
					) : (
						<FaUserCircle className="h-full w-full bg-white" />
					)}
				</Link>
			) : (
				<div className="h-full w-full aspect-square rounded-full overflow-hidden border border-transparent text-gray-300">
					<FaUserCircle className="h-full w-full bg-white" />
				</div>
			)}
		</>
	);
};

export default UserIcon;
