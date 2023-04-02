import { PostData, PostOptionsState } from "@/atoms/postAtom";
import React from "react";
import { BsFacebook } from "react-icons/bs";
import { IoLinkOutline } from "react-icons/io5";
import { postShareType } from "../../PostCard";

type PostShareMenuProps = {
	postData: PostData;
	postOptionsStateValue: PostOptionsState;
	handleFooterShareClick: (type: postShareType) => void;
};

const PostShareMenu: React.FC<PostShareMenuProps> = ({
	postData,
	postOptionsStateValue,
	handleFooterShareClick,
}) => {
	return (
		<div
			className="post-footer-share-menu-wrapper"
			menu-open={
				postOptionsStateValue.share === postData.post.id ? "true" : "false"
			}
		>
			<div className="post-footer-share-menu-container">
				<button
					type="button"
					title="Share to Facebook"
					className="rounded-full bg-gray-100 text-blue-500 h-10 w-10 aspect-square hover:text-blue-600 focus-within:text-blue-600"
					onClick={() => handleFooterShareClick("facebook")}
				>
					<BsFacebook className="h-full w-full" />
				</button>
				<button
					type="button"
					title="Copy Link"
					className="rounded-full bg-gray-100 text-gray-500 h-10 w-10 aspect-square p-2 hover:bg-gray-200 focus-within:bg-gray-200"
					onClick={() => handleFooterShareClick("copy")}
				>
					<IoLinkOutline className="h-full w-full" />
				</button>
			</div>
			<h2 className="absolute bottom-[100%] left-[50%] translate-x-[-50%] text-2xs font-bold w-max text-gray-500">
				Share To
			</h2>
		</div>
	);
};

export default PostShareMenu;
