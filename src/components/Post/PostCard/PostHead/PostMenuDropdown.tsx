import { PostData, PostOptionsState } from "@/atoms/postAtom";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";

type PostMenuDropdownProps = {
	postData: PostData;
	postOptionsStateValue: PostOptionsState;
	handlePostOptions: (name: keyof PostOptionsState) => void;
	handleDeletePost: () => Promise<void>;
};

const PostMenuDropdown: React.FC<PostMenuDropdownProps> = ({
	postData,
	postOptionsStateValue,
	handlePostOptions,
	handleDeletePost,
}) => {
	return (
		<>
			<button
				type="button"
				title="Post Menu"
				className="absolute rounded-full h-8 w-8 p-2 right-2 top-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:text-gray-700 focus:bg-gray-100"
				onClick={() => handlePostOptions("menu")}
			>
				<BsThreeDots className="h-full w-full" />
			</button>
			<div
				className="post-dropdown-menu-wrapper"
				menu-open={
					postOptionsStateValue.menu === postData.post.id ? "true" : "false"
				}
			>
				<div className="post-dropdown-menu !max-h-[384px]">
					<ul className="post-dropdown-list">
						<li>
							<button
								type="button"
								title="Delete Post"
								className="post-dropdown-item hover:!text-red-500 hover:!bg-red-50 focus:!text-red-500 focus:!bg-red-50"
								onClick={handleDeletePost}
							>
								<div className="icon-container">
									<MdDeleteOutline className="icon" />
								</div>
								<div className="label-container">
									<p className="label">Delete Post</p>
								</div>
							</button>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
};

export default PostMenuDropdown;
