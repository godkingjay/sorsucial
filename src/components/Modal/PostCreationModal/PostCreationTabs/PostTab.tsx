import React from "react";
import { CreatePostType } from "../../PostCreationModal";

type PostTabProps = {
	handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	createPostForm: CreatePostType;
	disabled: boolean;
};

const PostTab: React.FC<PostTabProps> = ({
	handleTextChange,
	createPostForm,
	disabled = false,
}) => {
	return (
		<div className="post-creation-form-post-tab">
			<textarea
				name="postBody"
				placeholder="Text(optional)"
				title="Body"
				onChange={(e) => {
					handleTextChange(e);
					e.currentTarget.style.height = "0px";
					e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
				}}
				className={`
										post-creation-form-body-input-field
									`}
				rows={1}
				minLength={0}
				maxLength={40000}
				value={createPostForm.postBody}
				disabled={(disabled = false)}
			/>
		</div>
	);
};

export default PostTab;
