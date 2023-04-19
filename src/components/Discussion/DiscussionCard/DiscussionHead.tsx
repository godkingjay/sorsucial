import { DiscussionData, DiscussionOptionsState } from "@/atoms/discussionAtom";
import { UserState } from "@/atoms/userAtom";
import UserIcon from "@/components/Icons/UserIcon";
import moment from "moment";
import Link from "next/link";
import React from "react";
import DiscussionMenuDropdown from "./DiscussionHead/DiscussionMenuDropdown";

type DiscussionHeadProps = {
	userStateValue: UserState;
	discussionData: DiscussionData;
	discussionOptionsStateValue: DiscussionOptionsState;
	handleDiscussionOptions: (name: keyof DiscussionOptionsState) => void;
	handleDeleteDiscussion: () => void;
};

const DiscussionHead: React.FC<DiscussionHeadProps> = ({
	userStateValue,
	discussionData,
	discussionOptionsStateValue,
	handleDiscussionOptions,
	handleDeleteDiscussion,
}) => {
	return (
		<div className="p-2 flex flex-row h-18 items-center gap-x-4">
			<div className="flex flex-row h-10 w-10">
				<UserIcon user={discussionData.creator} />
			</div>
			<div className="flex-1 flex flex-col h-full pr-6">
				<div className="w-full truncate">
					<Link
						href={`/user/${discussionData.creator?.uid}`}
						className="truncate font-semibold hover:underline focus:underline"
					>{`${discussionData.creator?.firstName} ${discussionData.creator?.lastName}`}</Link>
				</div>
				<div className="flex flex-row items-center truncate">
					<p className="text-2xs text-gray-500 truncate">
						{moment(discussionData.discussion.createdAt).diff(moment(), "days") >
						-7
							? moment(discussionData.discussion.createdAt).fromNow()
							: moment(discussionData.discussion.createdAt).format(
									"MMMM DD, YYYY"
							  )}
					</p>
				</div>
			</div>
			{(discussionData.discussion.creatorId === userStateValue.user.uid ||
				userStateValue.user.roles.includes("admin")) && (
				<DiscussionMenuDropdown
					discussionData={discussionData}
					discussionOptionsStateValue={discussionOptionsStateValue}
					handleDiscussionOptions={handleDiscussionOptions}
					handleDeleteDiscussion={handleDeleteDiscussion}
				/>
			)}
		</div>
	);
};

export default DiscussionHead;
