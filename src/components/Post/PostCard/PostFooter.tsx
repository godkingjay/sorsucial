import React from "react";
import { AiOutlineLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";

type PostFooterProps = {};

const PostFooter: React.FC<PostFooterProps> = () => {
	return (
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
	);
};

export default PostFooter;
