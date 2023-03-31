import React from "react";
import { CreatePostType, maxPostItems } from "../../PostCreationModal";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { BsImages } from "react-icons/bs";
import { ImFilm } from "react-icons/im";
import { FaPhotoVideo } from "react-icons/fa";
import { validImageTypes, validVideoTypes } from "@/lib/types/validFiles";

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
			<div
				className={`
					image-or-video-tab-input-container
					${
						createPostForm.imagesOrVideos.length === maxPostItems.imagesOrVideos
							? "grayscale pointer-events-none"
							: ""
					}
				`}
			>
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
						className="page-button w-max h-max py-1.5 px-6 bg-transparent border-blue-500 text-blue-500 text-xs hover:bg-blue-50 focus:bg-blue-100 outline-none disabled:bg-transparent disabled:grayscale"
						onClick={(e) =>
							e.currentTarget.disabled
								? null
								: uploadImageOrVideoRef.current?.click()
						}
						disabled={
							createPostForm.imagesOrVideos.length >=
							maxPostItems.imagesOrVideos
						}
					>
						Upload
					</button>
				</div>
			</div>
			<div className="image-or-video-tab-output-container">
				{createPostForm.imagesOrVideos.length ? (
					<>
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
										{validImageTypes.ext.includes(imageOrVideo.type) && (
											<Image
												src={imageOrVideo.url}
												alt="Image or Video"
												height={128}
												width={128}
												className="image"
												loading="lazy"
											/>
										)}
										{validVideoTypes.ext.includes(imageOrVideo.type) && (
											<video
												src={imageOrVideo.url}
												className="video"
												tabIndex={-1}
												controls={false}
											/>
										)}
									</a>

									<div className="file-icon-container">
										{validImageTypes.ext.includes(imageOrVideo.type) && (
											<BsImages className="icon" />
										)}
										{validVideoTypes.ext.includes(imageOrVideo.type) && (
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
					</>
				) : (
					<div className="h-full w-full py-2 px-6 text-gray-500 text-opacity-25 text-center font-semibold flex flex-col items-center justify-center text-sm gap-y-2">
						<div className="h-12 w-12 aspect-square">
							<FaPhotoVideo className="h-full w-full" />
						</div>
						<p className="max-w-[192px]">
							Add an Image or Video and you can see it here.
						</p>
					</div>
				)}
			</div>
			<input
				type="file"
				title="Upload Image or Video"
				accept={validImageTypes.ext.concat(validVideoTypes.ext).join(",")}
				ref={uploadImageOrVideoRef}
				onChange={(event) =>
					event.currentTarget.disabled ? null : handleImageOrVideoUpload(event)
				}
				disabled={
					createPostForm.imagesOrVideos.length >= maxPostItems.imagesOrVideos
				}
				max={maxPostItems.imagesOrVideos - createPostForm.imagesOrVideos.length}
				hidden
				multiple
			/>
		</div>
	);
};

export default PostImagesOrVideosTab;
