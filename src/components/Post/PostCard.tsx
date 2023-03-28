import { PostData, PostOptionsState } from "@/atoms/postAtom";
import { UserState } from "@/atoms/userAtom";
import React, { useState } from "react";
import PostTextContent from "./PostCard/PostTextContent";
import PostHead from "./PostCard/PostHead";
import { SetterOrUpdater } from "recoil";
import PostFooter from "./PostCard/PostFooter";
import PostLikeAndCommentDetails from "./PostCard/PostLikeAndCommentDetails";
import Image from "next/image";
import { validImageTypes, validVideoTypes } from "../Modal/PostCreationModal";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import {} from "react-icons/gr";

type PostCardProps = {
	userStateValue: UserState;
	postOptionsStateValue: PostOptionsState;
	setPostOptionsStateValue: SetterOrUpdater<PostOptionsState>;
	postData: PostData;
	deletePost: (postData: PostData) => Promise<void>;
	onPostLike: (postData: PostData) => void;
};

const PostCard: React.FC<PostCardProps> = ({
	userStateValue,
	postOptionsStateValue,
	setPostOptionsStateValue,
	postData,
	deletePost,
	onPostLike,
}) => {
	const [seeMore, setSeeMore] = useState(false);
	const [postBody, setPostBody] = useState(
		postData.post.postBody
			? postData.post.postBody?.length < 256
				? postData.post.postBody
				: postData.post.postBody?.slice(0, 256) + "..."
			: ""
	);
	const [currentImageOrVideo, setCurrentImageOrVideo] = useState(0);

	const handlePostOptions = (name: keyof PostOptionsState) => {
		if (postOptionsStateValue[name] === postData.post.id) {
			setPostOptionsStateValue({
				...postOptionsStateValue,
				[name]: "",
			});
		} else {
			setPostOptionsStateValue({
				...postOptionsStateValue,
				[name]: postData.post.id,
			});
		}
	};

	const handleSeeMore = () => {
		if (seeMore) {
			setPostBody(postData.post.postBody?.slice(0, 256) + "...");
		} else {
			setPostBody(postData.post.postBody || "");
		}
		setSeeMore(!seeMore);
	};

	const handleDeletePost = async () => {
		try {
			if (userStateValue.user.uid !== postData.post.creatorId) {
				throw new Error("You are not authorized to delete this post.");
			}

			await deletePost(postData);
		} catch (error: any) {
			console.log("Hook: Post Deletion Erro: ", error.message);
		}
	};

	const handlePostLike = async () => {
		try {
			if (!userStateValue.user.uid) {
				throw new Error("You have to be logged in to like a post.");
			}

			onPostLike(postData);
		} catch (error: any) {
			console.log("Hook: Post Like Error: ", error.message);
		}
	};

	const formatNumberWithSuffix = (number: number) => {
		const suffixes = ["", "K", "M", "B"];
		let suffixIndex = 0;
		while (number >= 1000 && suffixIndex < suffixes.length - 1) {
			number /= 1000;
			suffixIndex++;
		}
		const roundedNumber = Math.round(number * 10) / 10;
		const suffix = suffixes[suffixIndex];
		return `${roundedNumber}${suffix}`;
	};

	const handleImageOrVideoNav = (direction: "previous" | "next") => {
		if (direction === "previous") {
			if (currentImageOrVideo > 0) {
				setCurrentImageOrVideo(currentImageOrVideo - 1);
			}
		} else {
			if (currentImageOrVideo < postData.post.postImagesOrVideos.length - 1) {
				setCurrentImageOrVideo(currentImageOrVideo + 1);
			}
		}
	};

	return (
		<div className="post-card">
			<PostHead
				userStateValue={userStateValue}
				postData={postData}
				postOptionsStateValue={postOptionsStateValue}
				handlePostOptions={handlePostOptions}
				handleDeletePost={handleDeletePost}
			/>
			<PostTextContent
				postData={postData}
				postBody={postBody}
				seeMore={seeMore}
				handleSeeMore={handleSeeMore}
			/>
			{postData.post.postImagesOrVideos.length > 0 && (
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
			)}
			<PostLikeAndCommentDetails
				postData={postData}
				formatNumberWithSuffix={formatNumberWithSuffix}
			/>
			<div className="h-[1px] bg-gray-200"></div>
			<div className="flex flex-col">
				<PostFooter
					postData={postData}
					handlePostLike={handlePostLike}
				/>
			</div>
		</div>
	);
};

export default PostCard;
