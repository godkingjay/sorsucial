import { PostData } from "@/atoms/postAtom";
import React from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";

type PostFooterProps = {
	postData: PostData;
	handlePostLike: () => Promise<void>;
	handleFooterCommentClick: () => void;
};

const PostFooter: React.FC<PostFooterProps> = ({
	postData,
	handlePostLike,
	handleFooterCommentClick,
}) => {
	return (
		<div className="post-footer-wrapper">
			<div className="post-footer-container">
				<button
					type="button"
					title="Like"
					className="post-footer-button post-like-button"
					onClick={handlePostLike}
					data-liked={postData.userLike ? true : false}
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
		</div>
	);
};

export default PostFooter;
