import { DiscussionData, DiscussionOptionsState } from "@/atoms/discussionAtom";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";

type DiscussionMenuDropdownProps = {
	discussionData: DiscussionData;
	discussionOptionsStateValue: DiscussionOptionsState;
	handleDiscussionOptions: (name: keyof DiscussionOptionsState) => void;
	handleDeleteDiscussion: () => void;
};

const DiscussionMenuDropdown: React.FC<DiscussionMenuDropdownProps> = ({
	discussionData,
	discussionOptionsStateValue,
	handleDiscussionOptions,
	handleDeleteDiscussion,
}) => {
	return (
		<>
			<button
				type="button"
				title="Discussion Menu"
				className="discussion-menu-button"
				onClick={() => handleDiscussionOptions("menu")}
			>
				<BsThreeDots className="h-full w-full" />
			</button>
			<div
				className="discussion-dropdown-menu-wrapper"
				menu-open={
					discussionOptionsStateValue.menu === discussionData.discussion.id
						? "true"
						: "false"
				}
			>
				<div className="discussion-dropdown-menu !max-h-[384px]">
					<ul className="discussion-dropdown-list">
						<li>
							<button
								type="button"
								title="Delete Post"
								className="discussion-dropdown-item hover:!text-red-500 hover:!bg-red-50 focus:!text-red-500 focus:!bg-red-50"
								onClick={() =>
									discussionOptionsStateValue.menu === discussionData.discussion.id &&
									handleDeleteDiscussion()
								}
								disabled={
									discussionOptionsStateValue.menu !== discussionData.discussion.id
								}
							>
								<div className="icon-container">
									<MdDeleteOutline className="icon" />
								</div>
								<div className="label-container">
									<p className="label">Delete Discussion</p>
								</div>
							</button>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
};

export default DiscussionMenuDropdown;
