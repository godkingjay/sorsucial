import { PostData, PostOptionsState } from "@/atoms/postAtom";
import React from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
import PostShareMenu from "./PostFooter/PostShareMenu";
import { postShareType } from "../PostCard";

type PostFooterProps = {
	postData: PostData;
	postOptionsStateValue: PostOptionsState;
	disabled: boolean;
	handlePostLike: () => Promise<void>;
	handleFooterCommentClick: () => void;
	handlePostOptions: (name: keyof PostOptionsState) => void;
	handleFooterShareClick: (type: postShareType) => void;
};

const PostFooter: React.FC<PostFooterProps> = ({
	postData,
	postOptionsStateValue,
	disabled,
	handlePostLike,
	handleFooterCommentClick,
	handlePostOptions,
	handleFooterShareClick,
}) => {
	return (
		<div className="post-footer-wrapper">
			<div className="post-footer-container">
				<button
					type="button"
					title="Like"
					className="post-footer-button post-like-button"
					onClick={() => !disabled && handlePostLike()}
					data-liked={postData.userLike ? true : false}
					disabled={disabled}
				>
					{postData.userLike ? (
						<>
							<div className="icon-container">
								<AiFillLike className="icon" />
							</div>
							<div className="label-container">
								<p className="label">Liked</p>
							</div>
						</>
					) : (
						<>
							<div className="icon-container">
								<AiOutlineLike className="icon" />
							</div>
							<div className="label-container">
								<p className="label">Like</p>
							</div>
						</>
					)}
				</button>
				{postData.post.isCommentable && (
					<button
						type="button"
						title="Comment"
						className="post-footer-button"
						onClick={handleFooterCommentClick}
					>
						<div className="icon-container">
							<BiComment className="icon" />
						</div>
						<div className="label-container">
							<p className="label">Comment</p>
						</div>
					</button>
				)}
				{postData.post.privacy !== "private" && (
					<button
						type="button"
						title="Share"
						className="post-footer-button"
						onClick={() => handlePostOptions("share")}
					>
						<div className="icon-container">
							<RiShareForwardLine className="icon" />
						</div>
						<div className="label-container">
							<p className="label">Share</p>
						</div>
					</button>
				)}
			</div>
			{postData.post.privacy !== "private" && (
				<PostShareMenu
					postData={postData}
					postOptionsStateValue={postOptionsStateValue}
					handleFooterShareClick={handleFooterShareClick}
				/>
			)}
		</div>
	);
};

export default PostFooter;
