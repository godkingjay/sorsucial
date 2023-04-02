import { PostData, PostOptionsState } from "@/atoms/postAtom";
import { UserState } from "@/atoms/userAtom";
import React, { useState } from "react";
import PostTextContent from "./PostCard/PostTextContent";
import PostHead from "./PostCard/PostHead";
import { SetterOrUpdater } from "recoil";
import PostFooter from "./PostCard/PostFooter";
import PostLikeAndCommentDetails from "./PostCard/PostLikeAndCommentDetails";
import PostImagesOrVideos from "./PostCard/PostBody/PostImagesOrVideos";
import PostFiles from "./PostCard/PostBody/PostFiles";
import PostLinks from "./PostCard/PostBody/PostLinks";
import { NextRouter } from "next/router";

type PostCardProps = {
	userStateValue: UserState;
	postOptionsStateValue: PostOptionsState;
	setPostOptionsStateValue: SetterOrUpdater<PostOptionsState>;
	postData: PostData;
	deletePost: (postData: PostData) => Promise<void>;
	onPostLike: (postData: PostData) => void;
	router: NextRouter;
};

const PostCard: React.FC<PostCardProps> = ({
	userStateValue,
	postOptionsStateValue,
	setPostOptionsStateValue,
	postData,
	deletePost,
	onPostLike,
	router,
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

	const handleFooterCommentClick = () => {
		if (isSinglePostPage()) {
			console.log("Comment Clicked!");
		} else {
			switch (postData.post.postType) {
				case "announcement": {
					router.push(`/announcements/${postData.post.id}`);
					break;
				}

				case "feed": {
					router.push(
						`/feeds/${postData.post.creatorId}/posts/${postData.post.id}`
					);
					break;
				}

				case "group": {
					router.push(
						`/groups/${postData.post.groupId}/posts/${postData.post.id}`
					);
					break;
				}

				default: {
					break;
				}
			}
		}
	};

	const isSinglePostPage = () => {
		const { asPath } = router;
		const { id: postId, creatorId } = postData.post;

		switch (postData.post.postType) {
			case "announcement": {
				if (asPath === `/announcements/${postId}`) {
					return true;
				}
				break;
			}

			case "feed": {
				if (asPath === `/feeds/${creatorId}/posts/${postId}`) {
					return true;
				}
				break;
			}

			case "group": {
				const groupId = postData.post.groupId;
				if (asPath === `/groups/${groupId}/posts/${postId}`) {
					return true;
				}
				break;
			}

			default: {
				return false;
				break;
			}
		}

		return false;
	};

	const formatFileSize = (size: number) => {
		const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		let i = 0;
		let fileSize = size;
		while (fileSize >= 1024) {
			fileSize /= 1024;
			i++;
		}
		return fileSize.toFixed(2) + " " + units[i];
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
				<PostFiles
					postData={postData}
					formatFileSize={formatFileSize}
				/>
			)}
			{postData.post.postLinks.length > 0 && <PostLinks postData={postData} />}
			<PostLikeAndCommentDetails
				postData={postData}
				formatNumberWithSuffix={formatNumberWithSuffix}
			/>
			<div className="h-[1px] bg-gray-200"></div>
			<div className="flex flex-col">
				<PostFooter
					postData={postData}
					handlePostLike={handlePostLike}
					handleFooterCommentClick={handleFooterCommentClick}
				/>
			</div>
		</div>
	);
};

export default PostCard;
