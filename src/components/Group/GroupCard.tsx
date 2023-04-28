import { GroupData } from "@/atoms/groupAtom";
import { QueryGroupsSortBy } from "@/lib/types/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { HiUserGroup } from "react-icons/hi";
import UserIcon from "../Icons/UserIcon";
import { group } from "console";
import moment from "moment";
import {
	BsFillFileEarmarkTextFill,
	BsFillPersonFill,
	BsPostcardFill,
} from "react-icons/bs";
import { GoCommentDiscussion } from "react-icons/go";

type GroupCardProps = {
	groupData: GroupData;
	index: number;
};

const GroupCard: React.FC<GroupCardProps> = ({ groupData, index }) => {
	const router = useRouter();

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
			className="md:data-[top='true']:col-span-2 "
			data-top={index < 3}
		>
			<div
				className="shadow-page-box-1 bg-white rounded-lg entrance-animation-slide-from-right relative"
				data-order={index + 1}
			>
				<div className="p-4 flex flex-row flex-wrap justify-center gap-x-4">
					<div className="w-24 h-24 rounded-lg bg-gray-100 aspect-square shadow-lg overflow-hidden relative">
						{groupData.group.image ? (
							<Image
								src={groupData.group.image.fileURL}
								alt="Group Image"
								className="w-full bg-center object-cover"
								fill
							/>
						) : (
							<div className="h-full w-full bg-gradient-to-t from-logo-400 to-logo-100 p-4 text-white">
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
								Created by{" "}
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
						<div className="group-card-details-wrapper">
							<div className="group-card-details-container">
								<div
									className="group-detail total-members"
									title="Members"
									has-value={
										groupData.group.numberOfMembers !== 0 ? "true" : "false"
									}
								>
									<div className="icon-container">
										<BsFillPersonFill className="icon" />
									</div>
									<p className="label">
										{formatNumberWithSuffix(groupData.group.numberOfMembers)}
									</p>
								</div>
								<div
									className="group-detail total-posts"
									title="Posts"
									has-value={
										groupData.group.numberOfPosts !== 0 ? "true" : "false"
									}
								>
									<div className="icon-container">
										<BsFillFileEarmarkTextFill className="icon" />
									</div>
									<p className="label">
										{formatNumberWithSuffix(groupData.group.numberOfPosts)}
									</p>
								</div>
								<div
									className="group-detail total-discussions"
									title="Discussions"
									has-value={
										groupData.group.numberOfDiscussions !== 0 ? "true" : "false"
									}
								>
									<div className="icon-container">
										<GoCommentDiscussion className="icon" />
									</div>
									<p className="label">
										{formatNumberWithSuffix(groupData.group.numberOfDiscussions)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupCard;
