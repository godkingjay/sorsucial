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
		<div className="discussion-vote-reply-details-wrapper">
			<div className="discussion-vote-details-container">
				<div
					className="discussion-vote total-votes"
					title="Votes"
					has-vote={discussionData.discussion.numberOfVotes !== 0 ? "true" : "false"}
				>
					<div className="icon-container">
						<RiArrowUpDownFill className="icon" />
					</div>
					<p className="label">
						{formatNumberWithSuffix(discussionData.discussion.numberOfVotes)}
					</p>
				</div>
				<div
					className="discussion-vote total-upvotes"
					title="Upvotes"
					has-vote={discussionData.discussion.numberOfUpVotes !== 0 ? "true" : "false"}
				>
					<div className="icon-container">
						<TbArrowBigUpLinesFilled className="icon" />
					</div>
					<p className="label">
						{formatNumberWithSuffix(discussionData.discussion.numberOfUpVotes)}
					</p>
				</div>
				<div
					className="discussion-vote total-downvotes"
					title="Downvotes"
					has-vote={discussionData.discussion.numberOfDownVotes !== 0 ? "true" : "false"}
				>
					<div className="icon-container">
						<TbArrowBigDownLinesFilled className="icon" />
					</div>
					<p className="label">
						{formatNumberWithSuffix(discussionData.discussion.numberOfDownVotes)}
					</p>
				</div>
			</div>
			<div className="discussion-reply">
				<div className="icon-container text-gray-500">
					<GoCommentDiscussion className="icon" />
				</div>
				<p className="label">
					{formatNumberWithSuffix(discussionData.discussion.numberOfReplies)}
				</p>
			</div>
		</div>
	);
};

export default DiscussionVoteAndReplyDetails;
