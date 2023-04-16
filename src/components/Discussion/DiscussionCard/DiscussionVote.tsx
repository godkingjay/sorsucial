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
		<div className="discussion-vote-section">
			<div className="discussion-vote-buttons-wrapper">
				<div className="discussion-vote-buttons-container">
					<button
						type="button"
						title={discussionData.userVote?.voteValue === 1 ? "Remove Upvote" : "Upvote"}
						onClick={() => handleDiscussionVote("upVote")}
						className="vote-button upvote-button"
						data-voted={discussionData.userVote?.voteValue === 1}
					>
						{discussionData.userVote?.voteValue === 1 ? (
							<div className="icon-container">
								<TbArrowBigUpFilled className="icon" />
							</div>
						) : (
							<div className="icon-container">
								<TbArrowBigUp className="icon" />
							</div>
						)}
					</button>
					<div className="vote-count-container">
						<p className="vote-count">
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
						className="vote-button downvote-button"
						data-voted={discussionData.userVote?.voteValue === -1}
					>
						{discussionData.userVote?.voteValue === -1 ? (
							<div className="icon-container">
								<TbArrowBigDownFilled className="icon" />
							</div>
						) : (
							<div className="icon-container">
								<TbArrowBigDown className="icon" />
							</div>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default DiscussionVote;
