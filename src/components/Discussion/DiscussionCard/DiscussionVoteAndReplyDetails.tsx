import { DiscussionData } from "@/atoms/discussionAtom";
import React from "react";
import { GoCommentDiscussion } from "react-icons/go";
import { RiArrowUpDownFill } from "react-icons/ri";
import { TbArrowBigDownLinesFilled, TbArrowBigUpLinesFilled } from "react-icons/tb";

type DiscussionVoteAndReplyDetailsProps = {
	discussionData: DiscussionData;
	formatNumberWithSuffix: (number: number) => string;
};

const DiscussionVoteAndReplyDetails: React.FC<DiscussionVoteAndReplyDetailsProps> = ({
	discussionData,
	formatNumberWithSuffix,
}) => {
	return (
		<div className="px-4 flex flex-row justify-between py-2">
			<div className="flex flex-row flex-1 flex-wrap gap-x-6 gap-y-2">
				<div
					className="text-sm flex flex-row items-center gap-x-1"
					title="Votes"
				>
					<div
						className={`
									h-4 w-4 aspect-square
									${discussionData.discussion.numberOfVotes > 0 ? "text-green-500" : "text-gray-500"}
								`}
					>
						<RiArrowUpDownFill className="h-full w-full" />
					</div>
					<p className="text-gray-500 truncate">
						{formatNumberWithSuffix(discussionData.discussion.numberOfVotes)}
					</p>
				</div>
				<div
					className="text-sm flex flex-row items-center gap-x-1"
					title="Upvotes"
				>
					<div
						className={`
									h-4 w-4 aspect-square
									${discussionData.discussion.numberOfUpVotes > 0 ? "text-blue-500" : "text-gray-500"}
								`}
					>
						<TbArrowBigUpLinesFilled className="h-full w-full" />
					</div>
					<p className="text-gray-500 truncate">
						{formatNumberWithSuffix(discussionData.discussion.numberOfUpVotes)}
					</p>
				</div>
				<div
					className="text-sm flex flex-row items-center gap-x-1"
					title="Downvotes"
				>
					<div
						className={`
									h-4 w-4 aspect-square
									${discussionData.discussion.numberOfDownVotes > 0 ? "text-red-500" : "text-gray-500"}
								`}
					>
						<TbArrowBigDownLinesFilled className="h-full w-full" />
					</div>
					<p className="text-gray-500 truncate">
						{formatNumberWithSuffix(discussionData.discussion.numberOfDownVotes)}
					</p>
				</div>
			</div>
			<div className="text-sm flex flex-row items-center gap-x-1">
				<div className="h-4 w-4 aspect-square text-gray-500">
					<GoCommentDiscussion className="h-full w-full" />
				</div>
				<p className="text-gray-500 truncate">
					{formatNumberWithSuffix(discussionData.discussion.numberOfReplies)}
				</p>
			</div>
		</div>
	);
};

export default DiscussionVoteAndReplyDetails;
