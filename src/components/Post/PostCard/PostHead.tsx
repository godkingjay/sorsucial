import { PostData } from "@/atoms/postAtom";
import { UserState } from "@/atoms/userAtom";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import PostMenuDropdown from "./PostHead/PostMenuDropdown";

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
				<Link
					href={`/user/${userStateValue.user.uid}`}
					className="text-sm font-semibold hover:underline focus:underline"
				>{`${postData.creator?.firstName} ${postData.creator?.lastName}`}</Link>
				<p className="text-2xs text-gray-500">
					{moment(new Date(postData.post.createdAt.seconds * 1000)).fromNow()}
				</p>
			</div>
			{postData.post.creatorId === userStateValue.user.uid && (
				<PostMenuDropdown
					postMenuOpen={postMenuOpen}
					handlePostMenuOpen={handlePostMenuOpen}
				/>
			)}
		</div>
	);
};

export default PostHead;
