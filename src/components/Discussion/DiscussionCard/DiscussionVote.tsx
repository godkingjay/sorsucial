import { DiscussionData } from "@/atoms/discussionAtom";
import React from "react";
import {
	TbArrowBigDown,
	TbArrowBigDownFilled,
	TbArrowBigUp,
	TbArrowBigUpFilled,
} from "react-icons/tb";

type DiscussionVoteProps = {
	discussionData: DiscussionData;
	handleDiscussionVote: (voteType: "upVote" | "downVote") => void;
	formatWithSuffix: (number: number) => string;
};

const DiscussionVote: React.FC<DiscussionVoteProps> = ({
	discussionData,
	handleDiscussionVote,
	formatWithSuffix,
}) => {
	return (
		<div className="flex flex-col items-center p-2 bg-gray-100 rounded-l-lg">
			<div className="sticky top-16">
				<div className="flex flex-col items-center">
					<button
						type="button"
						title={discussionData.userVote?.voteValue === 1 ? "Remove Upvote" : "Upvote"}
						onClick={() => handleDiscussionVote("upVote")}
					>
						{discussionData.userVote?.voteValue === 1 ? (
							<div className="h-8 w-8 aspect-square text-blue-500">
								<TbArrowBigUpFilled className="h-full w-full stroke-1 text-primary-500" />
							</div>
						) : (
							<div className="h-8 w-8 aspect-square">
								<TbArrowBigUp className="h-full w-full stroke-1" />
							</div>
						)}
					</button>
					<div className="my-1">
						<p className="text-xs font-semibold">
							{discussionData.discussion.numberOfUpVotes <
								discussionData.discussion.numberOfDownVotes && "-"}
							{formatWithSuffix(
								Math.abs(
									discussionData.discussion.numberOfUpVotes -
										discussionData.discussion.numberOfDownVotes
								)
							)}
						</p>
					</div>
					<button
						type="button"
						title={
							discussionData.userVote?.voteValue === -1 ? "Remove Downvote" : "Downvote"
						}
						onClick={() => handleDiscussionVote("downVote")}
					>
						{discussionData.userVote?.voteValue === -1 ? (
							<div className="h-8 w-8 aspect-square text-red-500">
								<TbArrowBigDownFilled className="h-full w-full stroke-1 text-primary-500" />
							</div>
						) : (
							<div className="h-8 w-8 aspect-square">
								<TbArrowBigDown className="h-full w-full stroke-1" />
							</div>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default DiscussionVote;
