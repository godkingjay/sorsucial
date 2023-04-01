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
			className="flex flex-row bg-white p-2 shadow-page-box-1 rounded-lg relative gap-x-2"
		>
			<div className="h-16 w-16 rounded-lg border border-gray-500 border-opacity-25 p-3 text-gray-400 bg-gray-50">
				<SlGlobe className="h-full w-full" />
			</div>
			<div className="flex flex-col flex-1 gap-y-1">
				<div className="flex flex-col">
					<h1 className="font-bold truncate">
						{new URL(postLink.url).hostname}
					</h1>
					<h2 className="text-xs truncate underline text-gray-400">
						{postLink.url}
					</h2>
				</div>
			</div>
		</a>
	);
};

export default PostLinkCard;
