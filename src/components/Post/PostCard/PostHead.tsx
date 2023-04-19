import { PostData, PostOptionsState } from "@/atoms/postAtom";
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
	postOptionsStateValue: PostOptionsState;
	handlePostOptions: (name: keyof PostOptionsState) => void;
	handleDeletePost: () => Promise<void>;
};

const PostHead: React.FC<PostHeadProps> = ({
	userStateValue,
	postData,
	postOptionsStateValue,
	handlePostOptions,
	handleDeletePost,
}) => {
	return (
		<div className="p-4 flex flex-row h-18 items-center gap-x-4 relative">
			{postData.post.postType === "announcement" ? (
				<Link
					href={`/user/sorsu`}
					className="h-10 w-10 aspect-square rounded-full overflow-hidden border border-transparent text-gray-300"
				>
					<Image
						src={"/assets/logo/sorsu-sm.png"}
						alt="User Profile Picture"
						width={128}
						height={128}
						loading="lazy"
						className="h-full w-full"
					/>
				</Link>
			) : (
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
			)}
			<div className="flex-1 flex flex-col h-full pr-6">
				<div className="w-full truncate">
					{postData.post.postType === "announcement" ? (
						<Link
							href={`/user/sorsu`}
							className="truncate font-semibold hover:underline focus:underline"
						>
							Sorsogon State University
						</Link>
					) : (
						<Link
							href={`/user/${postData.creator?.uid}`}
							className="truncate font-semibold hover:underline focus:underline"
						>{`${postData.creator?.firstName} ${postData.creator?.lastName}`}</Link>
					)}
				</div>
				<div className="flex flex-row items-center truncate">
					<p className="text-2xs text-gray-500 truncate">
						{moment(postData.post.createdAt).diff(moment(), "days") > -7
							? moment(postData.post.createdAt).fromNow()
							: moment(postData.post.createdAt).format("MMMM DD, YYYY")}
					</p>
				</div>
			</div>
			{(postData.post.creatorId === userStateValue.user.uid ||
				userStateValue.user.roles.includes("admin")) && (
				<PostMenuDropdown
					postData={postData}
					postOptionsStateValue={postOptionsStateValue}
					handlePostOptions={handlePostOptions}
					handleDeletePost={handleDeletePost}
				/>
			)}
		</div>
	);
};

export default PostHead;
