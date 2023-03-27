import React from "react";
import {
	CreatePostType,
	validImageTypes,
	validVideoTypes,
} from "../../PostCreationModal";

type PostImagesOrVideosTabProps = {
	createPostForm: CreatePostType;
	uploadImageOrVideoRef: React.RefObject<HTMLInputElement>;
	handleImageOrVideoUpload: (
		event: React.ChangeEvent<HTMLInputElement>
	) => void;
};

const PostImagesOrVideosTab: React.FC<PostImagesOrVideosTabProps> = ({
	createPostForm,
	uploadImageOrVideoRef,
	handleImageOrVideoUpload,
}) => {
	return (
		<div className="post-creation-form-image-or-video-tab">
			<div className="image-or-video-tab-input-container">
				<div className="text-blue-500">
					<p>Drag and drop images or videos</p>
				</div>
				<div className="text-xs text-gray-500">
					<p>or</p>
				</div>
				<div>
					<button
						type="button"
						title="Upload Image or Video"
						className="page-button w-max h-max py-1.5 px-6 bg-transparent border-blue-500 text-blue-500 text-xs hover:bg-blue-50 focus:bg-blue-100 outline-none"
						onClick={() => uploadImageOrVideoRef.current?.click()}
					>
						Upload
					</button>
				</div>
			</div>
			<div className="image-or-video-tab-output-container"></div>
			<input
				type="file"
				title="Upload Image or Video"
				accept={validImageTypes.concat(validVideoTypes).join(",")}
				ref={uploadImageOrVideoRef}
				onChange={handleImageOrVideoUpload}
				max={20 - createPostForm.imageOrVideo.length}
				hidden
				multiple
			/>
		</div>
	);
};

export default PostImagesOrVideosTab;
