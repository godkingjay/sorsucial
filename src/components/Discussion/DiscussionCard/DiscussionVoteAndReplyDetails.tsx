import useInput from "@/hooks/useInput";
import React from "react";
import { GoCommentDiscussion } from "react-icons/go";
import { RiArrowUpDownFill } from "react-icons/ri";
import {
	TbArrowBigDownLinesFilled,
	TbArrowBigUpLinesFilled,
} from "react-icons/tb";

type DiscussionVoteAndReplyDetailsProps = {
	numberOfVotes: number;
	numberOfUpVotes: number;
	numberOfDownVotes: number;
	numberOfReplies: number;
};

const DiscussionVoteAndReplyDetails: React.FC<
	DiscussionVoteAndReplyDetailsProps
> = ({ numberOfVotes, numberOfUpVotes, numberOfDownVotes, numberOfReplies }) => {
	const { formatNumberWithSuffix } = useInput();

	return (
		<div className="discussion-vote-reply-details-wrapper">
			<div className="discussion-vote-details-container">
				<div
					className="discussion-vote total-votes"
					title="Votes"
					has-vote={numberOfVotes !== 0 ? "true" : "false"}
				>
					<div className="icon-container">
						<RiArrowUpDownFill className="icon" />
					</div>
					<p className="label">{formatNumberWithSuffix(numberOfVotes)}</p>
				</div>
				<div
					className="discussion-vote total-upvotes"
					title="Upvotes"
					has-vote={numberOfUpVotes !== 0 ? "true" : "false"}
				>
					<div className="icon-container">
						<TbArrowBigUpLinesFilled className="icon" />
					</div>
					<p className="label">{formatNumberWithSuffix(numberOfUpVotes)}</p>
				</div>
				<div
					className="discussion-vote total-downvotes"
					title="Downvotes"
					has-vote={numberOfDownVotes !== 0 ? "true" : "false"}
				>
					<div className="icon-container">
						<TbArrowBigDownLinesFilled className="icon" />
					</div>
					<p className="label">{formatNumberWithSuffix(numberOfDownVotes)}</p>
				</div>
			</div>
			<div className="discussion-reply">
				<div className="icon-container text-gray-500">
					<GoCommentDiscussion className="icon" />
				</div>
				<p className="label">{formatNumberWithSuffix(numberOfReplies)}</p>
			</div>
		</div>
	);
};

export default DiscussionVoteAndReplyDetails;
