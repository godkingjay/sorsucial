import { PostCreationModalState } from "@/atoms/modalAtom";
import React from "react";
import { BsImages, BsFillFileEarmarkPlusFill } from "react-icons/bs";
import { FaPollH } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";
import { RiLinkM } from "react-icons/ri";

type PostTabsProps = {
	handleFormTabChange: (tab: PostCreationModalState["tab"]) => void;
	postCreationModalStateValue: PostCreationModalState;
};

const PostCreationTabs: React.FC<PostTabsProps> = ({
	handleFormTabChange,
	postCreationModalStateValue,
}) => {
	return (
		<div className="sticky -top-14 h-max">
			<div className="post-creation-form-tabs-container">
				<button
					type="button"
					title="Add Post Body"
					className="post-creation-form-tab-button text-blue-500 data-[active=true]:!bg-blue-100"
					onClick={() => handleFormTabChange("post")}
					data-active={postCreationModalStateValue.tab === "post"}
				>
					<HiDocumentText className="icon" />
				</button>
				<button
					type="button"
					title="Add Image Or Video"
					className="post-creation-form-tab-button text-green-500 data-[active=true]:!bg-green-100"
					onClick={() => handleFormTabChange("image/video")}
					data-active={postCreationModalStateValue.tab === "image/video"}
				>
					<BsImages className="icon" />
				</button>
				<button
					type="button"
					title="Add File"
					className="post-creation-form-tab-button text-purple-500 data-[active=true]:!bg-purple-100"
					onClick={() => handleFormTabChange("file")}
					data-active={postCreationModalStateValue.tab === "file"}
				>
					<BsFillFileEarmarkPlusFill className="icon" />
				</button>
				<button
					type="button"
					title="Add Link"
					className="post-creation-form-tab-button text-cyan-500 data-[active=true]:!bg-cyan-100"
					onClick={() => handleFormTabChange("link")}
					data-active={postCreationModalStateValue.tab === "link"}
				>
					<RiLinkM className="icon" />
				</button>
				<button
					type="button"
					title="Create Poll"
					className="post-creation-form-tab-button text-yellow-500 data-[active=true]:!bg-yellow-100"
					onClick={() => handleFormTabChange("poll")}
					data-active={postCreationModalStateValue.tab === "poll"}
				>
					<FaPollH className="icon" />
				</button>
			</div>
		</div>
	);
};

export default PostCreationTabs;
