import { SitePost } from "@/lib/interfaces/post";
import { validImageTypes, validVideoTypes } from "@/lib/types/validFiles";
import Image from "next/image";
import React, { useState } from "react";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";

type PostImagesOrVideosProps = {
	imagesOrVideos: SitePost["postImagesOrVideos"];
};

const PostImagesOrVideos: React.FC<PostImagesOrVideosProps> = ({
	imagesOrVideos,
}) => {
	const [currentImageOrVideo, setCurrentImageOrVideo] = useState(0);

	const handleImageOrVideoNav = (direction: "previous" | "next") => {
		if (direction === "previous") {
			if (currentImageOrVideo > 0) {
				setCurrentImageOrVideo(currentImageOrVideo - 1);
			}
		} else {
			if (currentImageOrVideo < imagesOrVideos.length - 1) {
				setCurrentImageOrVideo(currentImageOrVideo + 1);
			}
		}
	};

	return (
		<div className="post-images-or-videos-wrapper">
			<div className="post-images-or-videos-container relative">
				<div className="post-images-or-videos-bg">
					<div className="post-images-or-videos-items-container">
						{imagesOrVideos.map((imageOrVideo, index) => (
							<React.Fragment key={imageOrVideo.id}>
								{validImageTypes.ext.includes(imageOrVideo.fileType) && (
									<Image
										src={imageOrVideo.fileUrl}
										alt={imageOrVideo.fileName}
										height={imageOrVideo.height}
										width={imageOrVideo.width}
										loading="lazy"
										className="images-or-videos"
										data-current-image={
											currentImageOrVideo === index ? true : false
										}
									/>
								)}
								{validVideoTypes.ext.includes(imageOrVideo.fileType) && (
									<video
										src={imageOrVideo.fileUrl}
										height={imageOrVideo.height}
										width={imageOrVideo.width}
										className="images-or-videos"
										data-current-image={
											currentImageOrVideo === index ? true : false
										}
										controls
									/>
								)}
							</React.Fragment>
						))}
						{imagesOrVideos.length > 1 && (
							<div className="absolute w-full flex flex-col items-center justify-center bottom-2">
								<div className="flex flex-row items-center justify-center gap-x-1">
									{imagesOrVideos.map((imageOrVideo, index) => (
										<div
											key={index}
											className="h-2 w-2 aspect-square bg-gray-500 bg-opacity-50 rounded-full data-[current-image=true]:bg-gray-300"
											data-current-image={
												currentImageOrVideo === index ? true : false
											}
										></div>
									))}
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
								className="button prev"
								onClick={() => handleImageOrVideoNav("previous")}
								disabled={currentImageOrVideo === 0}
							>
								<div className="icon-container">
									<RxCaretLeft className="icon" />
								</div>
							</button>
						)}
						{currentImageOrVideo < imagesOrVideos.length - 1 && (
							<button
								type="button"
								title="Next Image or Video"
								className="button next"
								onClick={() => handleImageOrVideoNav("next")}
								disabled={currentImageOrVideo === imagesOrVideos.length - 1}
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
