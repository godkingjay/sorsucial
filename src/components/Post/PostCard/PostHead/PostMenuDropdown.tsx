import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";

type PostMenuDropdownProps = {
	postMenuOpen: boolean;
	handlePostMenuOpen: () => void;
};

const PostMenuDropdown: React.FC<PostMenuDropdownProps> = ({
	postMenuOpen,
	handlePostMenuOpen,
}) => {
	return (
		<>
			<button
				type="button"
				title="Post Menu"
				className="absolute rounded-full h-8 w-8 p-2 right-2 top-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:text-gray-700 focus:bg-gray-100"
				onClick={handlePostMenuOpen}
			>
				<BsThreeDots className="h-full w-full" />
			</button>
			<div
				className={`
          post-dropdown-menu-wrapper
          ${
						postMenuOpen
							? " "
							: " translate-y-[-8px] opacity-0 [&_*]:pointer-events-none"
					}
        `}
			>
				<div className="post-dropdown-menu !max-h-[384px]">
					<ul className="post-dropdown-list">
						<li>
							<button
								type="button"
								title="Delete Post"
								className="post-dropdown-item hover:!text-red-500 hover:!bg-red-50 focus:!text-red-500 focus:!bg-red-50"
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
