import React from "react";
import { CreateDiscussionType } from "../../DiscussionCreationModal";

type DiscussionTabProps = {
	creatingDiscussion: boolean;
	createDiscussionForm: CreateDiscussionType;
	handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const DiscussionTab: React.FC<DiscussionTabProps> = ({
	creatingDiscussion,
	createDiscussionForm,
	handleTextChange,
}) => {
	return (
		<div className="discussion-creation-form-discussion-tab">
			<textarea
				name="discussionBody"
				placeholder="Text(optional)"
				title="Body"
				onChange={(e) => {
					handleTextChange(e);
					e.currentTarget.style.height = "0px";
					e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
				}}
				className={`
										discussion-creation-form-body-input-field
									`}
				rows={1}
				minLength={0}
				maxLength={40000}
				value={createDiscussionForm.discussionBody}
				disabled={creatingDiscussion}
			/>
		</div>
	);
};

export default DiscussionTab;
