import { DiscussionData, DiscussionOptionsState } from "@/atoms/discussionAtom";
import { UserState } from "@/atoms/userAtom";
import UserIcon from "@/components/Icons/UserIcon";
import moment from "moment";
import Link from "next/link";
import React from "react";

type DiscussionHeadProps = {
	userStateValue: UserState;
	discussionData: DiscussionData;
	discussionOptionsStateValue: DiscussionOptionsState;
};

const DiscussionHead: React.FC<DiscussionHeadProps> = ({
	userStateValue,
	discussionData,
	discussionOptionsStateValue,
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
						{moment(discussionData.discussion.createdAt).fromNow()}
					</p>
				</div>
			</div>
		</div>
	);
};

export default DiscussionHead;
