import { CreatePostLinkType } from "@/components/Modal/PostCreationModal";
import { PostLink } from "@/lib/interfaces/post";
import React from "react";
import { SlGlobe } from "react-icons/sl";

type PostLinkCardProps = {
	postLink: PostLink | CreatePostLinkType;
};

const PostLinkCard: React.FC<PostLinkCardProps> = ({ postLink }) => {
	return (
		<a
			href={postLink.url}
			className="post-link-card"
		>
			<div className="post-link-logo-container">
				<SlGlobe className="post-link-logo" />
			</div>
			<div className="post-link-details-container">
				<div className="post-link-header-container">
					<h1 className="post-link-title">{new URL(postLink.url).hostname}</h1>
					<h2 className="post-link-full-url">{postLink.url}</h2>
				</div>
			</div>
		</a>
	);
};

export default PostLinkCard;
