import React from "react";
import { currentLinkType } from "../../PostCreationModal";
import { IoAddOutline, IoEyeOutline, IoLinkOutline } from "react-icons/io5";

type PostLinksTabProps = {
	currentLink: currentLinkType;
	handleLinkChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleLinkPreview: () => void;
	handleLinkAdd: () => void;
};

const PostLinksTab: React.FC<PostLinksTabProps> = ({
	currentLink,
	handleLinkChange,
	handleLinkPreview,
	handleLinkAdd,
}) => {
	return (
		<div className="post-creation-form-link-tab-container">
			<div className="link-input-container">
				<div
					className="link-input-field-container"
					valid-link={
						!currentLink.isValidLink && currentLink.link ? "false" : "true"
					}
				>
					<div className="icon-container">
						<IoLinkOutline className="icon" />
					</div>
					<input
						type="text"
						title="Add Link"
						name="link"
						placeholder="Add Link"
						className="link-input-field"
						value={currentLink.link}
						onChange={handleLinkChange}
					/>
				</div>
				<div className="link-input-buttons-container">
					<button
						type="button"
						title="Add Link"
						className="button preview-link-button"
						onClick={(event) =>
							currentLink.isValidLink &&
							!event.currentTarget.disabled &&
							handleLinkPreview()
						}
						disabled={!currentLink.isValidLink}
					>
						<div className="icon-container">
							<IoEyeOutline className="icon" />
						</div>
						<div className="label-container">
							<p className="label">Preview</p>
						</div>
					</button>
					<button
						type="button"
						title="Add Link"
						className="button add-link-button"
						onClick={(event) =>
							currentLink.isValidLink &&
							!event.currentTarget.disabled &&
							handleLinkAdd()
						}
						disabled={!currentLink.isValidLink}
					>
						<div className="icon-container">
							<IoAddOutline className="icon" />
						</div>
						<div className="label-container">
							<p className="label">Add Link</p>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
};

export default PostLinksTab;
