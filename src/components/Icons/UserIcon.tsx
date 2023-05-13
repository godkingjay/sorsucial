import { SiteUser } from "@/lib/interfaces/user";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

type UserIconProps = {
	user: SiteUser | null;
	disabled?: boolean;
};

const UserIcon: React.FC<UserIconProps> = ({ user, disabled = false }) => {
	return (
		<>
			{user ? (
				<Link
					href={`/user/${user.uid}`}
					title={`${user.firstName} ${user.lastName}`}
					className="h-full w-full flex relative aspect-square rounded-full overflow-hidden border border-transparent text-gray-300 data-[disabled=true]:pointer-events-none"
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
