import { PostData, PostOptionsState } from "@/atoms/postAtom";
import { UserState } from "@/atoms/userAtom";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import PostMenuDropdown from "./PostHead/PostMenuDropdown";
import { SiteUser } from "@/lib/interfaces/user";
import usePost from "@/hooks/usePost";
import UserIcon from "@/components/Icons/UserIcon";

type PostHeadProps = {
	currentUser: SiteUser;
	postData: PostData;
	handlePostOptions: (name: keyof PostOptionsState) => void;
	handleDeletePost: () => Promise<void>;
};

const PostHead: React.FC<PostHeadProps> = ({
	currentUser,
	postData,
	handlePostOptions,
	handleDeletePost,
}) => {
	const { postOptionsStateValue } = usePost();

	return (
		<div className="p-4 flex flex-row h-18 items-center gap-x-4 relative">
			<div className="h-10 w-10">
				{postData.post.postType === "announcement" ? (
					<>
						<Image
							src={"/assets/logo/sorsu-sm.png"}
							alt="User Profile Picture"
							width={128}
							height={128}
							loading="lazy"
							className="h-full w-full"
						/>
					</>
				) : (
					<>
						<UserIcon user={postData.creator} />
					</>
				)}
			</div>
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
			{(postData.post.creatorId === currentUser.uid ||
				currentUser.roles.includes("admin")) && (
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
