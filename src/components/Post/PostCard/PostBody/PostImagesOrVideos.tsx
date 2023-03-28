import { PostData } from "@/atoms/postAtom";
import {
	validImageTypes,
	validVideoTypes,
} from "@/components/Modal/PostCreationModal";
import Image from "next/image";
import React from "react";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";

type PostImagesOrVideosProps = {
	postData: PostData;
	currentImageOrVideo: number;
	handleImageOrVideoNav: (direction: "previous" | "next") => void;
};

const PostImagesOrVideos: React.FC<PostImagesOrVideosProps> = ({
	postData,
	currentImageOrVideo,
	handleImageOrVideoNav,
}) => {
	return (
		<div className="post-images-or-videos-wrapper">
			<div className="post-images-or-videos-container relative">
				<div className="post-images-or-videos-bg">
					<div className="post-images-or-videos-items-container">
						{postData.post.postImagesOrVideos.map((imageOrVideo, index) => (
							<>
								{validImageTypes.includes(imageOrVideo.fileType) && (
									<Image
										src={imageOrVideo.fileUrl}
										alt={imageOrVideo.fileName}
										height={imageOrVideo.height}
										width={imageOrVideo.width}
										key={imageOrVideo.id}
										className="images-or-videos"
										data-current-image={
											currentImageOrVideo === index ? true : false
										}
									/>
								)}
								{validVideoTypes.includes(imageOrVideo.fileType) && (
									<video
										src={imageOrVideo.fileUrl}
										height={imageOrVideo.height}
										width={imageOrVideo.width}
										key={imageOrVideo.id}
										className="images-or-videos"
										data-current-image={
											currentImageOrVideo === index ? true : false
										}
										controls
									/>
								)}
							</>
						))}
						{postData.post.postImagesOrVideos.length > 1 && (
							<div className="absolute w-full flex flex-col items-center justify-center bottom-2">
								<div className="flex flex-row items-center justify-center gap-x-1">
									{postData.post.postImagesOrVideos.map(
										(imageOrVideo, index) => (
											<div
												key={index}
												className="h-2 w-2 aspect-square bg-gray-500 bg-opacity-50 rounded-full data-[current-image=true]:bg-gray-300"
												data-current-image={
													currentImageOrVideo === index ? true : false
												}
											></div>
										)
									)}
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="post-images-or-videos-nav-wrapper">
					<div className="post-images-or-videos-nav-container">
						{currentImageOrVideo > 0 && (
							<button
								type="button"
								title="Previous Image or Video"
								className="button mr-auto"
								onClick={() => handleImageOrVideoNav("previous")}
								disabled={currentImageOrVideo === 0}
							>
								<div className="icon-container">
									<RxCaretLeft className="icon" />
								</div>
							</button>
						)}
						{currentImageOrVideo <
							postData.post.postImagesOrVideos.length - 1 && (
							<button
								type="button"
								title="Next Image or Video"
								className="button ml-auto"
								onClick={() => handleImageOrVideoNav("next")}
								disabled={
									currentImageOrVideo ===
									postData.post.postImagesOrVideos.length - 1
								}
							>
								<div className="icon-container">
									<RxCaretRight className="icon" />
								</div>
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostImagesOrVideos;
