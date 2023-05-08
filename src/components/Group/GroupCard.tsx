import { GroupData } from "@/atoms/groupAtom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { HiUserGroup } from "react-icons/hi";
import UserIcon from "../Icons/UserIcon";
import moment from "moment";
import TagList from "../Tag/TagList";
import useGroup from "@/hooks/useGroup";
import ErrorBannerTextXs from "../Banner/ErrorBanner/ErrorBannerTextXs";
import ButtonJoinLeaveGroup from "./Buttons/ButtonJoinLeaveGroup";
import GroupCardDetails from "./GroupCard/GroupCardDetails";

type GroupCardProps = {
	groupData: GroupData;
	index: number;
};

const GroupCard: React.FC<GroupCardProps> = ({ groupData, index }) => {
	const { onJoinGroup } = useGroup();
	const [joiningGroup, setJoiningGroup] = useState(false);
	const router = useRouter();

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
	}, [groupData, joiningGroup, onJoinGroup]);

	const formatNumberWithSuffix = (number: number) => {
		const suffixes = ["", "K", "M", "B"];
		let suffixIndex = 0;
		while (number >= 1000 && suffixIndex < suffixes.length - 1) {
			number /= 1000;
			suffixIndex++;
		}
		const roundedNumber = Math.floor(number * 100) / 100;
		const suffix = suffixes[suffixIndex];
		return `${roundedNumber}${suffix}`;
	};

	return (
		<div
			className="group-card-wrapper"
			data-top={index < 3}
		>
			<div
				className="shadow-page-box-1 flex-1 flex flex-col bg-white rounded-lg entrance-animation-slide-from-right relative"
				data-order={index + 1}
			>
				{groupData.groupDeleted && (
					<div className="duration-200 entrance-animation-float-down z-[250] items-center font-semibold bg-red-500 rounded-t-lg">
						<ErrorBannerTextXs
							message="This group no longer exist. It may have been deleted by the
											creator or an admin."
						/>
					</div>
				)}
				<div className="group-card-holder">
					<div className="w-24 h-24 rounded-lg bg-gray-100 aspect-square shadow-lg overflow-hidden relative">
						{groupData.group.image ? (
							<Image
								src={groupData.group.image.fileURL}
								alt="Group Image"
								className="w-full bg-center object-cover"
								sizes="(min-width: 1200px) 900px, (min-width: 768px) 700px, 100vw"
								fill
							/>
						) : (
							<div className="h-full w-full bg-gray-200 p-4 text-gray-50">
								<HiUserGroup className="h-full w-full" />
							</div>
						)}
					</div>
					<div className="flex flex-col flex-1">
						<div className="flex flex-row w-full">
							<Link
								href={`/groups/${groupData.group.id}`}
								title={groupData.group.name}
							>
								<h2 className="truncate text-lg font-semibold text-gray-700">
									{groupData.group.name}
								</h2>
							</Link>
						</div>
						<div className="flex flex-row gap-x-2">
							<div className="text-2xs text-gray-500 inline-flex items-center gap-x-1">
								<p className="hidden sm:inline">Created by </p>
								<div className="inline-flex flex-row h-4 w-4">
									<UserIcon user={groupData.creator} />
								</div>
								•
								<p className="text-2xs text-gray-500 truncate">
									{moment(groupData.group.createdAt).diff(moment(), "days") > -7
										? moment(groupData.group.createdAt).fromNow()
										: moment(groupData.group.createdAt).format("MMMM DD, YYYY")}
								</p>
							</div>
						</div>
						{groupData.group.description && (
							<div className="flex flex-col mt-2">
								<p className="text-xs text-gray-500">
									{groupData.group.description.length > 256
										? groupData.group.description.substring(0, 256).concat("...")
										: groupData.group.description}
								</p>
							</div>
						)}
						{groupData.group.groupTags && (
							<div>
								<TagList
									itemName="Group Tags"
									items={groupData.group.groupTags}
								/>
							</div>
						)}
						<div className="flex flex-row justify-end">
							<ButtonJoinLeaveGroup
								joiningGroup={joiningGroup}
								userJoin={groupData?.userJoin}
								handleJoinGroup={handleJoinGroup}
							/>
						</div>
						<GroupCardDetails
							numberOfMembers={groupData.group.numberOfMembers}
							numberOfPosts={groupData.group.numberOfPosts}
							numberOfDiscussions={groupData.group.numberOfDiscussions}
							formatNumberWithSuffix={formatNumberWithSuffix}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupCard;
