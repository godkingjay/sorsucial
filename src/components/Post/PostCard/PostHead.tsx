import { PostData } from "@/atoms/postAtom";
import { UserState } from "@/atoms/userAtom";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import PostMenuDropdown from "./PostHead/PostMenuDropdown";

type PostHeadProps = {
	userStateValue: UserState;
	postData: PostData;
	postMenuOpen: boolean;
	handlePostMenuOpen: () => void;
	handleDeletePost: () => Promise<void>;
};

const PostHead: React.FC<PostHeadProps> = ({
	userStateValue,
	postData,
	postMenuOpen,
	handlePostMenuOpen,
	handleDeletePost,
}) => {
	return (
		<div className="p-4 flex flex-row h-18 items-center gap-x-4 relative">
			<Link
				href={`/user/${postData.creator?.uid}`}
				className="h-10 w-10 aspect-square rounded-full overflow-hidden border border-transparent text-gray-300"
			>
				{postData.creator?.imageURL ? (
					<Image
						src={postData.creator?.imageURL}
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
			<div className="flex-1 flex flex-col h-full pr-6">
				<div>
					<Link
						href={`/user/${postData.creator?.uid}`}
						className="truncate font-semibold hover:underline focus:underline"
					>{`${postData.creator?.firstName} ${postData.creator?.lastName}`}</Link>
				</div>
				<div className="flex flex-row items-center">
					<p className="text-2xs text-gray-500 truncate">
						{moment(new Date(postData.post.createdAt.seconds * 1000)).fromNow()}
					</p>
				</div>
			</div>
			{postData.post.creatorId === userStateValue.user.uid && (
				<PostMenuDropdown
					postMenuOpen={postMenuOpen}
					handlePostMenuOpen={handlePostMenuOpen}
					handlePostDelete={handleDeletePost}
				/>
			)}
		</div>
	);
};

export default PostHead;
