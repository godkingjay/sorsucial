import { PostData, PostOptionsState } from "@/atoms/postAtom";
import { UserState } from "@/atoms/userAtom";
import React, { useState } from "react";
import PostTextContent from "./PostCard/PostTextContent";
import PostHead from "./PostCard/PostHead";
import { SetterOrUpdater } from "recoil";
import PostFooter from "./PostCard/PostFooter";
import PostLikeAndCommentDetails from "./PostCard/PostLikeAndCommentDetails";
import {} from "react-icons/gr";
import PostImagesOrVideos from "./PostCard/PostBody/PostImagesOrVideos";
import { validAllTypes } from "@/lib/types/validFiles";
import FileIcons from "../Icons/FileIcons";
import { FiDownload } from "react-icons/fi";
import { HiDownload } from "react-icons/hi";

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
				<PostImagesOrVideos
					postData={postData}
					currentImageOrVideo={currentImageOrVideo}
					handleImageOrVideoNav={handleImageOrVideoNav}
				/>
			)}
			{postData.post.postFiles.length > 0 && (
				<div className="post-files-wrapper">
					<div className="post-files-header">
						<div className="divider"></div>
						<h2 className="text">Attached Files</h2>
					</div>
					<div className="post-files-container">
						{postData.post.postFiles.map((file) => {
							const fileDetails =
								validAllTypes.find((type) =>
									type.ext.includes(file.fileType)
								) || null;

							return (
								<div
									className="post-file-item"
									key={file.id}
									file-type={fileDetails?.type || "file"}
								>
									<div className="deco-1"></div>
									<div className="logo-container">
										<FileIcons type={fileDetails ? fileDetails.type : ""} />
									</div>
									<div className="details-container">
										<h2 className="file-name">
											{file.fileTitle || file.fileName}
										</h2>
										<div className="buttons-container">
											<a
												download={file.fileName}
												href={file.fileUrl}
												target="_blank"
												title="Download"
												className="button download"
												rel="noopener"
											>
												<HiDownload className="icon" />
											</a>
										</div>
									</div>
								</div>
							);
						})}
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
