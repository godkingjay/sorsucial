import { UserData } from "@/atoms/userAtom";
import useUser from "@/hooks/useUser";
import Image from "next/image";
import React from "react";
import UserIcon from "../Icons/UserIcon";
import Link from "next/link";
import { BsThreeDots } from "react-icons/bs";
import UserProfileMenu from "./UserPageHeader/UserProfileMenu";

type UserPageHeaderProps = {
	userData: UserData;
};

const UserPageHeader: React.FC<UserPageHeaderProps> = ({ userData }) => {
	const { userStateValue } = useUser();

	return (
		<div className="w-full flex flex-col items-center shadow-page-box-1 bg-white">
			<div className="flex flex-col w-full max-w-5xl">
				<div className="relative flex flex-col px-0 md:mx-8 aspect-[3/1] min-h-[192px] bg-gray-200 overflow-hidden md:rounded-b-2xl">
					{userData.user.coverImageURL ? (
						<>
							<Image
								src={userData.user.coverImageURL}
								alt={userData.user.firstName}
								sizes="(min-width: 1200px) 900px, (min-width: 768px) 700px, 100vw"
								fill
								className="w-full bg-center object-cover"
							/>
						</>
					) : (
						<div className="w-full h-full bg-gradient-to-b from-logo-100 to-[#ff404020]"></div>
					)}
				</div>
				<div className="h-32 p-4 flex flex-row gap-x-4">
					<div className="relative border-4 border-white flex md:ml-8 -translate-y-8 sm:-translate-y-12 h-28 w-28 sm:h-36 sm:w-36 aspect-square rounded-full bg-gray-100">
						<UserIcon user={userData.user} />
					</div>
					<div className="flex-1 flex flex-col">
						<div className="w-full flex flex-row gap-x-4 justify-between pr-0 md:pr-4">
							<div className="flex-1 flex flex-col">
								<Link
									href={`/user/${userData.user.uid}`}
									className="pb-1 relative truncate font-bold text-xl sm:text-2xl md:text-3xl group"
								>
									{`${userData.user.firstName} ${userData.user.lastName}`}
									<span className="group-hover:w-full duration-200 absolute block left-0 w-0 bottom-0 h-[2px] bg-black"></span>
								</Link>
							</div>
							{userStateValue.user.uid === userData.user.uid && (
								<UserProfileMenu userData={userData} />
							)}
						</div>
						<div className="flex flex-row gap-x-2 gap-y-1 flex-wrap mt-1">
							{userData.user.roles.map((role) => (
								<p
									key={role}
									className="user-role"
									data-role={role}
								>
									{role.split("")[0].toUpperCase() + role.slice(1).toLowerCase()}
								</p>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserPageHeader;
