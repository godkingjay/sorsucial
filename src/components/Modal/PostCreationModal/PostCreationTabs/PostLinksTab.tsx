import React from "react";
import { CreatePostType, currentLinkType } from "../../PostCreationModal";
import { IoAddOutline, IoClose, IoLinkOutline } from "react-icons/io5";
import PostLinkCard from "@/components/Post/PostCard/PostBody/PostCards/PostLinkCard";

type PostLinksTabProps = {
	createPostForm: CreatePostType;
	currentLink: currentLinkType;
	handleLinkChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	// handleLinkPreview: () => void;
	handleLinkAdd: () => void;
	handleLinkRemove: (index: number) => void;
};

const PostLinksTab: React.FC<PostLinksTabProps> = ({
	createPostForm,
	currentLink,
	handleLinkChange,
	// handleLinkPreview,
	handleLinkAdd,
	handleLinkRemove,
}) => {
	return (
		<div className="post-creation-form-link-tab-container">
			{createPostForm.links.length > 0 && (
				<div className="flex flex-col gap-y-2">
					{createPostForm.links.map((link) => (
						<div
							key={link.index}
							className="relative"
						>
							<PostLinkCard postLink={link} />
							<button
								type="button"
								title="Remove Link"
								className="absolute top-0 right-0 h-6 w-6 p-1 bg-red-400 shadow-md translate-x-1 -translate-y-1 rounded-full text-white hover:bg-red-500 hover:text-red-800 focus:bg-red-500 focus:text-red-800"
								onClick={() => handleLinkRemove(link.index)}
							>
								<IoClose className="h-full w-full" />
							</button>
						</div>
					))}
				</div>
			)}
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
					{/* <button
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
					</button> */}
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
				{/* {currentLink.preview && (
          <div className="flex">
            <PostLinkCard url={currentLink.link}/>
          </div>
        )} */}
			</div>
		</div>
	);
};

export default PostLinksTab;
