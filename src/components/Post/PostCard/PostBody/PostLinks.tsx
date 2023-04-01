import { PostData } from "@/atoms/postAtom";
import React from "react";
import PostLinkCard from "./PostCards/PostLinkCard";

type PostLinksProps = {
	postData: PostData;
};

const PostLinks: React.FC<PostLinksProps> = ({ postData }) => {
	return (
		<div className="post-links-wrapper">
			<div className="post-links-header">
				<div className="divider"></div>
				<h2 className="text">Links</h2>
			</div>
			<div className="post-links-container">
				{postData.post.postLinks.map((link) => (
					<div
						key={link.id}
						className="post-link-card-wrapper"
					>
						<PostLinkCard postLink={link} />
					</div>
				))}
			</div>
		</div>
	);
};

export default PostLinks;
