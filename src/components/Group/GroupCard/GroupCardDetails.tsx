import React from "react";
import { BsFillFileEarmarkTextFill, BsFillPersonFill } from "react-icons/bs";
import { GoCommentDiscussion } from "react-icons/go";

type GroupCardDetailsProps = {
	numberOfMembers: number;
	numberOfPosts: number;
	numberOfDiscussions: number;
	formatNumberWithSuffix: (number: number) => string;
};

const GroupCardDetails: React.FC<GroupCardDetailsProps> = ({
	numberOfMembers,
	numberOfPosts,
	numberOfDiscussions,
	formatNumberWithSuffix,
}) => {
	return (
		<div className="group-card-details-wrapper">
			<div className="group-card-details-container">
				<div
					className="group-detail total-members"
					title="Members"
					has-value={numberOfMembers !== 0 ? "true" : "false"}
				>
					<div className="icon-container">
						<BsFillPersonFill className="icon" />
					</div>
					<p className="label">{formatNumberWithSuffix(numberOfMembers)}</p>
				</div>
				<div
					className="group-detail total-posts"
					title="Posts"
					has-value={numberOfPosts !== 0 ? "true" : "false"}
				>
					<div className="icon-container">
						<BsFillFileEarmarkTextFill className="icon" />
					</div>
					<p className="label">{formatNumberWithSuffix(numberOfPosts)}</p>
				</div>
				<div
					className="group-detail total-discussions"
					title="Discussions"
					has-value={numberOfDiscussions !== 0 ? "true" : "false"}
				>
					<div className="icon-container">
						<GoCommentDiscussion className="icon" />
					</div>
					<p className="label">{formatNumberWithSuffix(numberOfDiscussions)}</p>
				</div>
			</div>
		</div>
	);
};

export default GroupCardDetails;
