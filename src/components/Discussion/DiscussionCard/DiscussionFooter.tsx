import { DiscussionData, DiscussionOptionsState } from "@/atoms/discussionAtom";
import React from "react";
import { BsFacebook } from "react-icons/bs";
import { GoCommentDiscussion } from "react-icons/go";
import { IoLinkOutline } from "react-icons/io5";
import { RiShareForwardLine } from "react-icons/ri";
import { discussionShareType } from "../DiscussionCard";
import DiscussionShareMenu from "./DiscussionFooter/DiscussionShareMenu";

type DiscussionFooterProps = {
	discussionData: DiscussionData;
	discussionOptionsStateValue: DiscussionOptionsState;
	handleDiscussionOptions: (name: keyof DiscussionOptionsState) => void;
	handleFooterShareClick: (type: discussionShareType) => void;
};

const DiscussionFooter: React.FC<DiscussionFooterProps> = ({
	discussionData,
	discussionOptionsStateValue,
	handleDiscussionOptions,
	handleFooterShareClick,
}) => {
	return (
		<div className="flex flex-row items-center h-10 rounded-b-lg p-1 relative">
			<div className="flex flex-row items-center h-full flex-1">
				{discussionData.discussion.isOpen && (
					<button
						type="button"
						title="Reply"
						className="h-full flex flex-row items-center justify-center py-2 px-4 gap-x-2 rounded-lg text-gray-500 text-xs font-semibold"
					>
						<div className="h-6 w-6 aspect-square">
							<GoCommentDiscussion className="h-full w-full" />
						</div>
						<div className="hidden xs:flex flex-row h-full items-center">
							<p>Reply</p>
						</div>
					</button>
				)}
				{discussionData.discussion.privacy !== "private" && (
					<button
						type="button"
						title="Share"
						className="h-full flex flex-row items-center justify-center py-2 px-4 gap-x-2 rounded-lg text-gray-500 text-xs font-semibold"
						onClick={() => handleDiscussionOptions("share")}
					>
						<div className="h-6 w-6 aspect-square">
							<RiShareForwardLine className="h-full w-full" />
						</div>
						<div className="hidden xs:flex flex-row h-full items-center">
							<p>Share</p>
						</div>
					</button>
				)}
			</div>
			{discussionData.discussion.privacy !== "private" && (
				<DiscussionShareMenu
					discussionData={discussionData}
					discussionOptionsStateValue={discussionOptionsStateValue}
					handleFooterShareClick={handleFooterShareClick}
				/>
			)}
		</div>
	);
};

export default DiscussionFooter;
