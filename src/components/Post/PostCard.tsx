import { PostData } from "@/atoms/postAtom";
import { UserState } from "@/atoms/userAtom";
import React, { useState } from "react";
import PostTextContent from "./PostCard/PostTextContent";
import PostHead from "./PostCard/PostHead";
import { AiOutlineLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";

type PostCardProps = {
	userStateValue: UserState;
	postData: PostData;
	deletePost: (postData: PostData) => Promise<void>;
};

const PostCard: React.FC<PostCardProps> = ({
	userStateValue,
	postData,
	deletePost,
}) => {
	const [seeMore, setSeeMore] = useState(false);
	const [postBody, setPostBody] = useState(
		postData.post.postBody
			? postData.post.postBody?.length < 256
				? postData.post.postBody
				: postData.post.postBody?.slice(0, 256) + "..."
			: ""
	);
	const [postMenuOpen, setPostMenuOpen] = useState(false);

	const handleSeeMore = () => {
		if (seeMore) {
			setPostBody(postData.post.postBody?.slice(0, 256) + "...");
		} else {
			setPostBody(postData.post.postBody || "");
		}
		setSeeMore(!seeMore);
	};

	const handlePostMenuOpen = () => {
		setPostMenuOpen((prev) => !prev);
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

	return (
		<div className="flex flex-col shadow-page-box-1 bg-white rounded-lg relative">
			<PostHead
				userStateValue={userStateValue}
				postData={postData}
				postMenuOpen={postMenuOpen}
				handlePostMenuOpen={handlePostMenuOpen}
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
			<div className="h-[1px] bg-gray-200"></div>
			<div className="flex flex-col">
				<div className="post-footer-wrapper">
					<div className="post-footer-container">
						<button
							type="button"
							title="Like"
							className="post-footer-button"
						>
							<div className="icon-container">
								<AiOutlineLike className="icon" />
							</div>
							<div className="label-container">
								<p className="label">Like</p>
							</div>
						</button>
						<button
							type="button"
							title="Comment"
							className="post-footer-button"
						>
							<div className="icon-container">
								<BiComment className="icon" />
							</div>
							<div className="label-container">
								<p className="label">Comment</p>
							</div>
						</button>
						<button
							type="button"
							title="Share"
							className="post-footer-button"
						>
							<div className="icon-container">
								<RiShareForwardLine className="icon" />
							</div>
							<div className="label-container">
								<p className="label">Share</p>
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostCard;
