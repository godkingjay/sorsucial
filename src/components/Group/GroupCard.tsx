import { GroupData } from "@/atoms/groupAtom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { HiUserGroup } from "react-icons/hi";
import UserIcon from "../Icons/UserIcon";
import moment from "moment";
import { BsFillFileEarmarkTextFill, BsFillPersonFill } from "react-icons/bs";
import { GoCommentDiscussion } from "react-icons/go";
import TagList from "../Tag/TagList";
import useGroup from "@/hooks/useGroup";
import { MdBlock, MdCheck, MdGroupAdd, MdOutlineTimer } from "react-icons/md";
import { FiLoader } from "react-icons/fi";

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
				className="shadow-page-box-1 flex-1 bg-white rounded-lg entrance-animation-slide-from-right relative"
				data-order={index + 1}
			>
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
						{groupData.group.groupTags && (
							<div>
								<TagList
									itemName="Group Tags"
									items={groupData.group.groupTags}
								/>
							</div>
						)}
						<div className="flex flex-row justify-end">
							<button
								type="button"
								title="Join"
								onClick={() =>
									(!groupData.userJoin?.roles.includes("banned") ||
										joiningGroup) &&
									handleJoinGroup()
								}
								className="page-button group-join-leave-button"
								data-state={
									groupData.userJoin
										? groupData.userJoin.roles.includes("rejected")
											? "rejected"
											: groupData.userJoin.roles.includes("banned")
											? "banned"
											: groupData.userJoin.roles.includes("pending")
											? "pending"
											: "joined"
										: "join"
								}
								disabled={
									joiningGroup || groupData.userJoin?.roles.includes("banned")
								}
							>
								{!joiningGroup ? (
									<>
										<div className="icon-container">
											{groupData.userJoin ? (
												groupData.userJoin.roles.includes("rejected") ? (
													<MdGroupAdd className="icon" />
												) : groupData.userJoin.roles.includes("banned") ? (
													<MdBlock className="icon" />
												) : groupData.userJoin.roles.includes("pending") ? (
													<MdOutlineTimer className="icon" />
												) : (
													<MdCheck className="icon" />
												)
											) : (
												<MdGroupAdd className="icon" />
											)}
										</div>
										<div>
											<p>
												{groupData.userJoin
													? groupData.userJoin.roles.includes("rejected")
														? "Join"
														: groupData.userJoin.roles.includes("banned")
														? "Banned"
														: groupData.userJoin.roles.includes("pending")
														? "Pending"
														: "Joined"
													: "Join"}
											</p>
										</div>
									</>
								) : (
									<div className="loading-spinner animate-spin">
										<FiLoader className="h-full w-full" />
									</div>
								)}
							</button>
						</div>
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
