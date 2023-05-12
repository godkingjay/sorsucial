import useGroup from "@/hooks/useGroup";
import React, { useState } from "react";
import { GroupPrivacy } from "../Modal/GroupCreationModal";
import { AiOutlineCalendar } from "react-icons/ai";
import moment from "moment";
import UserIcon from "../Icons/UserIcon";

type GroupAboutCardProps = {};

const GroupAboutCard: React.FC<GroupAboutCardProps> = () => {
	const { groupStateValue } = useGroup();

	const [groupDescription, setGroupDescription] = useState(
		(groupStateValue.currentGroup?.group.description &&
		groupStateValue.currentGroup?.group?.description?.length > 256
			? groupStateValue.currentGroup?.group.description
					?.slice(0, 128)
					.concat("...")
			: groupStateValue.currentGroup?.group.description) || undefined
	);
	const [descriptionSeeMore, setDescriptionSeeMore] = useState(false);

	const handleSeeMore = () => {
		setGroupDescription(
			descriptionSeeMore &&
				groupStateValue.currentGroup?.group.description &&
				groupStateValue.currentGroup?.group?.description?.length > 256
				? groupStateValue.currentGroup?.group.description
						?.slice(0, 128)
						.concat("...")
				: groupStateValue.currentGroup?.group.description
		);
		setDescriptionSeeMore((prev) => !prev);
	};

	return (
		<>
			{groupStateValue.currentGroup && (
				<>
					<div className="page-wrapper p-4">
						<div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4">
							<div className="shadow-page-box-1 page-box-1 rounded-lg p-4 col-span-full">
								{groupStateValue.currentGroup?.group.description && (
									<>
										<div>
											<p className="font-semibold text-lg text-gray-700">
												Group Description
											</p>
											<div className="divider my-1"></div>
											<p className="text-sm text-gray-700">
												{groupDescription}{" "}
												{groupStateValue.currentGroup?.group.description &&
													groupStateValue.currentGroup.group.description.length >
														256 && (
														<button
															type="button"
															title={
																descriptionSeeMore ? "See Less" : "See More"
															}
															className="inline font-semibold text-gray-700 hover:underline focus:underline"
															onClick={handleSeeMore}
														>
															{descriptionSeeMore ? "See Less" : "See More"}
														</button>
													)}
											</p>
										</div>
										<div className="divider my-4"></div>
									</>
								)}
								<div className="flex flex-col gap-y-4">
									<div className="flex flex-row gap-x-4">
										<div className="h-8 w-8 p-1 text-gray-700">
											{
												GroupPrivacy.find(
													(privacy) =>
														privacy.value ===
														groupStateValue.currentGroup?.group.privacy
												)?.icon
											}
										</div>
										<div className="flex-1 flex flex-col">
											<p className="font-semibold text-gray-700">
												{groupStateValue.currentGroup?.group.privacy
													.charAt(0)
													.toUpperCase() +
													groupStateValue.currentGroup?.group.privacy.substring(
														1
													)}
											</p>
											<p className="text-sm text-gray-500">
												{
													GroupPrivacy.find(
														(privacy) =>
															privacy.value ===
															groupStateValue.currentGroup?.group.privacy
													)?.description
												}
											</p>
										</div>
									</div>
									<div className="flex flex-row gap-x-4">
										<div className="h-8 w-8 p-1 text-gray-700">
											<AiOutlineCalendar className="h-full w-full" />
										</div>
										<div className="flex-1 flex flex-col">
											<p className="font-semibold text-gray-700">Created On</p>
											<p className="text-sm text-gray-500">
												{moment(
													groupStateValue.currentGroup.group.createdAt
												).format("MMMM DD, YYYY")}
											</p>
										</div>
									</div>
									<div className="flex flex-row gap-x-4">
										<div className="h-8 w-8 p-1 text-gray-700 flex">
											<UserIcon user={groupStateValue.currentGroup.creator} />
										</div>
										<div className="flex-1 flex flex-col">
											<p className="font-semibold text-gray-700">Created By</p>
											<p className="text-sm text-gray-500">
												{groupStateValue.currentGroup.creator
													? `${groupStateValue.currentGroup.creator.firstName} ${groupStateValue.currentGroup.creator.lastName}`
													: "Unknown User"}
											</p>
										</div>
									</div>
								</div>
							</div>
							{/* <div className="shadow-page-box-1 page-box-1 rounded-lg p-4 flex flex-col"></div>
							<div className="shadow-page-box-1 page-box-1 rounded-lg p-4"></div>
							<div className="shadow-page-box-1 page-box-1 rounded-lg p-4"></div> */}
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default GroupAboutCard;
