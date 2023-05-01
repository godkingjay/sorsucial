import React, { useCallback, useState } from "react";
import ButtonJoinLeaveGroup from "./Buttons/ButtonJoinLeaveGroup";
import moment from "moment";
import { GroupData } from "@/atoms/groupAtom";
import Image from "next/image";
import { RiGroup2Fill } from "react-icons/ri";
import { UserState } from "@/atoms/userAtom";
import { HiOutlineCamera } from "react-icons/hi";
import Link from "next/link";
import useGroup from "@/hooks/useGroup";

type GroupPageHeaderProps = {
	groupData: GroupData;
	userStateValue: UserState;
};

const GroupPageHeader: React.FC<GroupPageHeaderProps> = ({
	groupData,
	userStateValue,
}) => {
	const { onJoinGroup } = useGroup();
	const [joiningGroup, setJoiningGroup] = useState(false);

	const handleJoinGroup = useCallback(async () => {
		try {
			if (!joiningGroup) {
				setJoiningGroup(true);
				await onJoinGroup(groupData);
			}
		} catch (error: any) {
			console.log("Hook: Join/Leave group Error:\n", error.message);
		}
		setJoiningGroup(false);
	}, [groupData]);

	return (
		<div className="w-full flex flex-col items-center shadow-page-box-1 bg-white">
			<div className="flex flex-col w-full max-w-5xl">
				<div className="relative flex flex-col px-0 md:mx-8 aspect-[3/1] bg-gray-200 overflow-hidden md:rounded-b-2xl">
					{groupData.group.coverImage ? (
						<>
							<Image
								src={groupData.group.coverImage.fileURL}
								alt={groupData.group.name}
								sizes="(min-width: 1200px) 900px, (min-width: 768px) 700px, 100vw"
								fill
								className="w-full bg-center object-cover"
							/>
						</>
					) : (
						<div className="w-full h-full bg-gradient-to-b from-blue-500 to-blue-100"></div>
					)}
				</div>
				<div className="h-32 p-4 flex flex-row gap-x-4">
					<div className="relative border-4 border-white flex md:ml-8 -translate-y-8 sm:-translate-y-12 h-28 w-28 sm:h-36 sm:w-36 aspect-square rounded-full bg-gray-100">
						{groupData.group.image ? (
							<>
								<Image
									src={groupData.group.image.fileURL}
									alt={groupData.group.name}
									sizes="(min-width: 1200px) 900px, (min-width: 768px) 700px, 100vw"
									fill
									className="w-full bg-center object-cover rounded-full"
								/>
							</>
						) : (
							<div className="w-full h-full overflow-hidden rounded-full bg-gray-100 relative">
								<div className="h-full w-full aspect-square text-gray-300 scale-125">
									<RiGroup2Fill className="h-full w-full" />
								</div>
								{!groupData.group.image && (
									<>
										{(userStateValue.user?.roles.includes("admin") ||
											groupData.userJoin?.roles.includes("owner") ||
											groupData.userJoin?.roles.includes("admin")) && (
											<button
												type="button"
												title="Add Photo"
												className="opacity-0 hover:opacity-100 duration-100 bg-slate-400 bg-opacity-25 backdrop-filter backdrop-blur-sm absolute top-0 left-0 flex flex-col gap-y-2 h-full w-full text-white items-center justify-center p-4 hover:text-blue-400"
											>
												<div className="h-8 w-8 aspect-square">
													<HiOutlineCamera className="h-full w-full" />
												</div>
												<div>
													<p className="text-sm">Add Photo</p>
												</div>
											</button>
										)}
									</>
								)}
							</div>
						)}
					</div>
					<div className="flex-1 flex flex-col">
						<div className="w-full flex flex-row">
							<Link
								href={`/groups/${groupData.group.id}`}
								className="pb-1 relative truncate font-bold text-xl sm:text-2xl md:text-3xl group"
							>
								{groupData.group.name}
								<span className="group-hover:w-full duration-200 absolute block left-0 w-0 bottom-0 h-[2px] bg-black"></span>
							</Link>
						</div>
						<div className="flex flex-col">
							<p className="font-semibold text-sm text-gray-500">
								Created on{" "}
								{moment(groupData.group.createdAt).format("MMMM DD, YYYY")}
							</p>
						</div>
						<div className="flex flex-row justify-end">
							<ButtonJoinLeaveGroup
								userJoin={groupData.userJoin}
								joiningGroup={joiningGroup}
								handleJoinGroup={handleJoinGroup}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupPageHeader;
