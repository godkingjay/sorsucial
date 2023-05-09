import { GroupMemberData } from "@/atoms/groupAtom";
import React from "react";
import UserIcon from "../Icons/UserIcon";
import Link from "next/link";
import moment from "moment";

type MemberCardProps = {
	memberData: GroupMemberData;
};

const MemberCard: React.FC<MemberCardProps> = ({ memberData }) => {
	return (
		<div className="shadow-page-box-1 bg-white rounded-lg p-4 flex flex-col">
			<div className="flex flex-row gap-x-4">
				<div className="h-16 w-16 flex">
					<UserIcon user={memberData.user} />
				</div>
				<div className="flex flex-col flex-1">
					<p className="font-semibold text-gray-700 truncate">
						{memberData.user ? (
							<Link
								href={`/user/${memberData.user?.uid}`}
								title={`${memberData.user?.firstName} ${memberData.user?.lastName}`}
								className="text-inherit hover:underline focus:underline"
							>
								{`${memberData.user?.firstName} ${memberData.user?.lastName}`}
							</Link>
						) : (
							"Unknown user"
						)}
					</p>
					<p className="text-2xs text-gray-500">
						Member since{" "}
						{moment(memberData.member.acceptedAt).format("MMMM DD, YYYY")}
					</p>
					<div className="flex flex-row gap-x-2 gap-y-1 flex-wrap mt-1">
						{memberData.member.roles.map((role) => (
							<p
								key={role}
								className="member-user-role"
								data-role={role}
							>
								{role.split("")[0].toUpperCase() + role.slice(1).toLowerCase()}
							</p>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MemberCard;
