import React from "react";
import {
	CreatePostType,
	validImageTypes,
	validVideoTypes,
} from "../../PostCreationModal";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { BsImages } from "react-icons/bs";
import { ImFilm } from "react-icons/im";

type PostImagesOrVideosTabProps = {
	createPostForm: CreatePostType;
	uploadImageOrVideoRef: React.RefObject<HTMLInputElement>;
	handleImageOrVideoUpload: (
		event: React.ChangeEvent<HTMLInputElement>
	) => void;
	handleRemoveImageOrVideo: (index: number) => void;
};

const PostImagesOrVideosTab: React.FC<PostImagesOrVideosTabProps> = ({
	createPostForm,
	uploadImageOrVideoRef,
	handleImageOrVideoUpload,
	handleRemoveImageOrVideo,
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
			<div className="image-or-video-tab-output-container">
				{createPostForm.imagesOrVideos.map((imageOrVideo) => (
					<div
						key={imageOrVideo.index}
						className="image-or-video-item relative"
					>
						<div className="image-or-video-container">
							<a
								href={imageOrVideo.url}
								target="_blank"
								className="h-full w-full"
							>
								{validImageTypes.includes(imageOrVideo.type) && (
									<Image
										src={imageOrVideo.url}
										alt="Image or Video"
										height={128}
										width={128}
										className="image"
									/>
								)}
								{validVideoTypes.includes(imageOrVideo.type) && (
									<video
										src={imageOrVideo.url}
										className="video"
										tabIndex={-1}
									/>
								)}
							</a>

							<div className="file-icon-container">
								{validImageTypes.includes(imageOrVideo.type) && (
									<BsImages className="icon" />
								)}
								{validVideoTypes.includes(imageOrVideo.type) && (
									<ImFilm className="icon" />
								)}
							</div>

							<button
								type="button"
								title="Remove Image or Video"
								className="remove-button"
								onClick={() => handleRemoveImageOrVideo(imageOrVideo.index)}
							>
								<IoClose className="icon" />
							</button>
						</div>
					</div>
				))}
			</div>
			<input
				type="file"
				title="Upload Image or Video"
				accept={validImageTypes.concat(validVideoTypes).join(",")}
				ref={uploadImageOrVideoRef}
				onChange={handleImageOrVideoUpload}
				max={20 - createPostForm.imagesOrVideos.length}
				hidden
				multiple
			/>
		</div>
	);
};

export default PostImagesOrVideosTab;
