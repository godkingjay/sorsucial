import { DiscussionData, DiscussionOptionsState } from "@/atoms/discussionAtom";
import React from "react";
import { GoCommentDiscussion } from "react-icons/go";
import { RiShareForwardLine } from "react-icons/ri";
import { discussionShareType } from "../DiscussionCard";
import DiscussionShareMenu from "./DiscussionFooter/DiscussionShareMenu";
import useDiscussion from "@/hooks/useDiscussion";

type DiscussionFooterProps = {
	discussionData: DiscussionData;
	handleDiscussionOptions: (name: keyof DiscussionOptionsState) => void;
	handleFooterReplyClick: () => void;
	handleFooterShareClick: (type: discussionShareType) => void;
};

const DiscussionFooter: React.FC<DiscussionFooterProps> = ({
	discussionData,
	handleDiscussionOptions,
	handleFooterReplyClick,
	handleFooterShareClick,
}) => {
	return (
		<div className="discussion-footer-wrapper">
			<div className="discussion-footer-container">
				{discussionData.discussion.isOpen && (
					<button
						type="button"
						title="Reply"
						className="discussion-footer-button"
						onClick={handleFooterReplyClick}
					>
						<div className="icon-container">
							<GoCommentDiscussion className="icon" />
						</div>
						<div className="label-container">
							<p className="label">Reply</p>
						</div>
					</button>
				)}
				{discussionData.discussion.privacy !== "private" && (
					<button
						type="button"
						title="Share"
						className="discussion-footer-button"
						onClick={() => handleDiscussionOptions("share")}
					>
						<div className="icon-container">
							<RiShareForwardLine className="icon" />
						</div>
						<div className="label-container">
							<p className="label">Share</p>
						</div>
					</button>
				)}
			</div>
			{discussionData.discussion.privacy !== "private" && (
				<DiscussionShareMenu
					discussionData={discussionData}
					handleFooterShareClick={handleFooterShareClick}
				/>
			)}
		</div>
	);
};

export default DiscussionFooter;
