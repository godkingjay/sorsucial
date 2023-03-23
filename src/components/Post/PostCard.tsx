import { PostData, PostOptionsState } from "@/atoms/postAtom";
import { UserState } from "@/atoms/userAtom";
import React, { useState } from "react";
import PostTextContent from "./PostCard/PostTextContent";
import PostHead from "./PostCard/PostHead";
import { SetterOrUpdater } from "recoil";
import PostFooter from "./PostCard/PostFooter";
import { AiFillLike } from "react-icons/ai";

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

	return (
		<div className="flex flex-col shadow-page-box-1 bg-white rounded-lg relative">
			<PostHead
				userStateValue={userStateValue}
				postData={postData}
				postOptionsStateValue={postOptionsStateValue}
				handlePostOptions={handlePostOptions}
				handleDeletePost={handleDeletePost}
			/>
			<div className="flex flex-col px-4 pb-4 gap-y-2">
				<PostTextContent
					postData={postData}
					postBody={postBody}
					seeMore={seeMore}
					handleSeeMore={handleSeeMore}
				/>
			</div>
			<div className="px-4 pb-2">
				<div className="text-sm flex flex-row items-center gap-x-1">
					<div
						className={`
						h-5 w-5 aspect-square
						${postData.post.numberOfLikes > 0 ? "text-blue-500" : "text-gray-500"}
					`}
					>
						<AiFillLike className="h-full w-full" />
					</div>
					<p className="text-gray-500">
						{postData.post.numberOfLikes} <span>liked this post.</span>
					</p>
				</div>
			</div>
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
