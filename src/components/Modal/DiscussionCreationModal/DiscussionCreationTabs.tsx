import { DiscussionCreationModalState } from "@/atoms/modalAtom";
import React from "react";
import { HiDocumentText } from "react-icons/hi";
import { IoSettingsSharp } from "react-icons/io5";

type DiscussionCreationTabsProps = {
	discussionCreationModalStateValue: DiscussionCreationModalState;
	handleFormTabChange: (tab: DiscussionCreationModalState["tab"]) => void;
};

const DiscussionCreationTabs: React.FC<DiscussionCreationTabsProps> = ({
	handleFormTabChange,
	discussionCreationModalStateValue,
}) => {
	return (
		<div className="sticky -top-14 h-max">
			<div className="discussion-creation-form-tabs-container">
				<button
					type="button"
					title="Add Discussion Body"
					className="discussion-creation-form-tab-button text-blue-500 data-[active=true]:!bg-blue-100"
					onClick={() => handleFormTabChange("discussion")}
					data-active={discussionCreationModalStateValue.tab === "discussion"}
				>
					<HiDocumentText className="icon" />
				</button>
				<button
					type="button"
					title="Discussion Settings"
					className="discussion-creation-form-tab-button text-gray-500 data-[active=true]:!bg-gray-100"
					onClick={() => handleFormTabChange("settings")}
					data-active={discussionCreationModalStateValue.tab === "settings"}
				>
					<IoSettingsSharp className="icon" />
				</button>
			</div>
		</div>
	);
};

export default DiscussionCreationTabs;
