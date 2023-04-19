import { PostData, PostOptionsState } from "@/atoms/postAtom";
import { UserState } from "@/atoms/userAtom";
import React, { useRef, useState } from "react";
import PostTextContent from "./PostCard/PostTextContent";
import PostHead from "./PostCard/PostHead";
import { SetterOrUpdater } from "recoil";
import PostFooter from "./PostCard/PostFooter";
import PostLikeAndCommentDetails from "./PostCard/PostLikeAndCommentDetails";
import PostImagesOrVideos from "./PostCard/PostBody/PostImagesOrVideos";
import PostFiles from "./PostCard/PostBody/PostFiles";
import PostLinks from "./PostCard/PostBody/PostLinks";
import { NextRouter } from "next/router";
import { siteDetails } from "@/lib/host";
import PostComments from "./PostCard/PostComment/PostComments";

type PostCardProps = {
	userStateValue: UserState;
	userMounted?: boolean;
	postOptionsStateValue: PostOptionsState;
	setPostOptionsStateValue: SetterOrUpdater<PostOptionsState>;
	postData: PostData;
	deletePost: (postData: PostData) => Promise<void>;
	onPostLike: (postData: PostData) => void;
	router: NextRouter;
};

export type postShareType = "facebook" | "copy";

const PostCard: React.FC<PostCardProps> = ({
	userStateValue,
	userMounted,
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
	const commentBoxRef = useRef<HTMLTextAreaElement>(null);

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
			commentBoxRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			commentBoxRef.current?.focus({ preventScroll: true });
		} else {
			switch (postData.post.postType) {
				case "announcement": {
					router.push(`/announcements/${postData.post.id}`);
					break;
				}

				case "feed": {
					router.push(
						`/user/${postData.post.creatorId}/posts/${postData.post.id}`
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
				if (asPath === `/user/${creatorId}/posts/${postId}`) {
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

	const handleFooterShareClick = async (type: postShareType) => {
		let url = siteDetails.host;
		const siteName = `&og:site_name=${encodeURIComponent("SorSUcial")}`;

		const title = `&og:title=${encodeURIComponent(postData.post.postTitle)}`;

		const description = `&og:description=${encodeURIComponent(
			postData.post.postBody?.slice(0, 512) || ""
		)}`;

		const faviconUrl = document
			.querySelector("link[rel='icon']")
			?.getAttribute("href");

		const image = `&og:image=${encodeURIComponent(
			postData.post.postImagesOrVideos.length
				? postData.post.postImagesOrVideos[0].fileUrl
				: faviconUrl || ""
		)}`;

		switch (postData.post.postType) {
			case "announcement": {
				url += `/announcements/${postData.post.id}`;
				break;
			}

			case "feed": {
				url += `/user/${postData.post.creatorId}/posts/${postData.post.id}`;
				break;
			}

			case "group": {
				url += `/groups/${postData.post.groupId}/posts/${postData.post.id}`;
				break;
			}

			default: {
				break;
			}
		}

		switch (type) {
			case "copy": {
				await navigator.clipboard.writeText(url);
				alert("Post link copied to clipboard!");
				break;
			}

			case "facebook": {
				const fbSharerUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
					url
				)}${siteName}${title}${description}${image}`;
				window.open(fbSharerUrl, "_blank");
				break;
			}

			default: {
				break;
			}
		}
	};

	const formatNumberWithSuffix = (number: number) => {
		const suffixes = ["", "K", "M", "B"];
		let suffixIndex = 0;
		while (number >= 1000 && suffixIndex < suffixes.length - 1) {
			number /= 1000;
			suffixIndex++;
		}
		const roundedNumber = Math.floor(number * 100) / 100;
		const suffix = suffixes[suffixIndex];
		return `${roundedNumber}${suffix}`;
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
		<div className="post-card entrance-animation-slide-from-right">
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
					postOptionsStateValue={postOptionsStateValue}
					handlePostLike={handlePostLike}
					handleFooterCommentClick={handleFooterCommentClick}
					handlePostOptions={handlePostOptions}
					handleFooterShareClick={handleFooterShareClick}
				/>
			</div>
			{isSinglePostPage() && userMounted && (
				<PostComments
					userStateValue={userStateValue}
					userMounted={userMounted}
					currentPost={postData}
					commentBoxRef={commentBoxRef}
					formatNumberWithSuffix={formatNumberWithSuffix}
				/>
			)}
		</div>
	);
};

export default PostCard;
