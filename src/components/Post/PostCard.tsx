import { PostData, PostOptionsState } from "@/atoms/postAtom";
import React, { useCallback, useRef, useState } from "react";
import PostTextContent from "./PostCard/PostTextContent";
import PostHead from "./PostCard/PostHead";
import PostFooter from "./PostCard/PostFooter";
import PostLikeAndCommentDetails from "./PostCard/PostLikeAndCommentDetails";
import PostImagesOrVideos from "./PostCard/PostBody/PostImagesOrVideos";
import PostFiles from "./PostCard/PostBody/PostFiles";
import PostLinks from "./PostCard/PostBody/PostLinks";
import { useRouter } from "next/router";
import { siteDetails } from "@/lib/host";
import PostComments from "./PostCard/PostComment/PostComments";
import ErrorBannerTextXs from "../Banner/ErrorBanner/ErrorBannerTextXs";
import TagsList from "../Tag/TagList";
import useUser from "@/hooks/useUser";
import usePost from "@/hooks/usePost";

type PostCardProps = {
	postData: PostData;
};

export type postShareType = "facebook" | "copy";

const PostCard: React.FC<PostCardProps> = ({ postData }) => {
	const { userStateValue, userMounted } = useUser();
	const {
		postOptionsStateValue,
		setPostOptionsStateValue,
		deletePost,
		onPostLike,
	} = usePost();
	const router = useRouter();
	const [liking, setLiking] = useState(false);
	const [deletingPost, setDeletingPost] = useState(false);
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

	const handleDeletePost = useCallback(async () => {
		try {
			if (userStateValue.user.uid !== postData.post.creatorId) {
				if (!userStateValue.user.roles.includes("admin")) {
					throw new Error("You are not authorized to delete this post.");
				}
			}

			if (!deletingPost) {
				setDeletingPost(true);
				await deletePost(postData);
			}
		} catch (error: any) {
			console.log("Hook: Post Deletion Erro: ", error.message);
		}

		setDeletingPost(false);
	}, [
		deletePost,
		deletingPost,
		postData,
		userStateValue.user.roles,
		userStateValue.user.uid,
	]);

	const handlePostLike = useCallback(async () => {
		try {
			if (!userStateValue.user.uid) {
				throw new Error("You have to be logged in to like a post.");
			}

			if (!liking) {
				setLiking(true);
				await onPostLike(postData);
			}
		} catch (error: any) {
			console.log("Hook: Post Like Error: ", error.message);
		}

		setLiking(false);
	}, [liking, onPostLike, postData, userStateValue.user.uid]);

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

	return (
		<div className="post-card entrance-animation-slide-from-right">
			{!isSinglePostPage() && postData.postDeleted && (
				<div className="duration-200 entrance-animation-float-down z-[250] items-center font-semibold bg-red-500 rounded-t-lg">
					<ErrorBannerTextXs message="This post no longer exist. It may have been deleted by the creator or an admin." />
				</div>
			)}
			<PostHead
				currentUser={userStateValue.user}
				postData={postData}
				handlePostOptions={handlePostOptions}
				handleDeletePost={handleDeletePost}
			/>
			<PostTextContent
				postTitle={postData.post.postTitle}
				postBodyRaw={postData.post.postBody}
			/>
			{postData.post.postImagesOrVideos.length > 0 && (
				<PostImagesOrVideos imagesOrVideos={postData.post.postImagesOrVideos} />
			)}
			{postData.post.postFiles.length > 0 && (
				<PostFiles postFiles={postData.post.postFiles} />
			)}
			{postData.post.postTags && postData.post.postTags.length > 0 && (
				<div className="flex flex-row gap-x-4 mx-4 px-4 py-2 bg-gray-50 rounded-lg mb-2 shadow-sm">
					<p className="py-2 font-bold text-gray-500 text-sm">Tags:</p>
					<div className="flex-1">
						<TagsList
							itemName="Post Tags"
							items={postData.post.postTags}
						/>
					</div>
				</div>
			)}
			{postData.post.postLinks.length > 0 && <PostLinks postData={postData} />}
			<PostLikeAndCommentDetails
				userLike={postData.userLike}
				numberOfLikes={postData.post.numberOfLikes}
				numberOfComments={postData.post.numberOfComments}
			/>
			<div className="h-[1px] bg-gray-200"></div>
			<div className="flex flex-col">
				<PostFooter
					postData={postData}
					postOptionsStateValue={postOptionsStateValue}
					disabled={liking || deletingPost || postData.postDeleted || false}
					handlePostLike={handlePostLike}
					handleFooterCommentClick={handleFooterCommentClick}
					handlePostOptions={handlePostOptions}
					handleFooterShareClick={handleFooterShareClick}
				/>
			</div>
			{isSinglePostPage() && userMounted && (
				<PostComments
					currentPost={postData}
					commentBoxRef={commentBoxRef}
				/>
			)}
		</div>
	);
};

export default PostCard;
