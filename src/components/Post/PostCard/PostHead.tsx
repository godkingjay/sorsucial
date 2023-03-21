import { PostData } from "@/atoms/postAtom";
import { UserState } from "@/atoms/userAtom";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { MdDelete, MdDeleteOutline } from "react-icons/md";

type PostHeadProps = {
	userStateValue: UserState;
	postData: PostData;
	postMenuOpen: boolean;
	handlePostMenuOpen: () => void;
};

const PostHead: React.FC<PostHeadProps> = ({
	userStateValue,
	postData,
	postMenuOpen,
	handlePostMenuOpen,
}) => {
	return (
		<div className="p-4 flex flex-row h-18 items-center gap-x-4 relative">
			<Link
				href={`/user/${userStateValue.user.uid}`}
				className="h-10 w-10 aspect-square rounded-full border border-transparent text-gray-300"
			>
				{userStateValue.user.imageURL ? (
					<Image
						src={userStateValue.user.imageURL}
						alt="User Profile Picture"
						width={96}
						height={96}
						loading="lazy"
						className="h-full w-full"
					/>
				) : (
					<FaUserCircle className="h-full w-full bg-white" />
				)}
			</Link>
			<div className="flex-1 flex flex-col h-full">
				<p className="text-sm font-semibold">{`${postData.creator?.firstName} ${postData.creator?.lastName}`}</p>
				<p className="text-2xs text-gray-500">
					{moment(new Date(postData.post.createdAt.seconds * 1000)).fromNow()}
				</p>
			</div>
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
		</div>
	);
};

export default PostHead;
