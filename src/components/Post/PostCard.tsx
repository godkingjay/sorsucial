import { PostData } from "@/atoms/postAtom";
import { UserState } from "@/atoms/userAtom";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import PostTextContent from "./PostCard/PostTextContent";

type PostCardProps = {
	userStateValue: UserState;
	postData: PostData;
};

const PostCard: React.FC<PostCardProps> = ({ userStateValue, postData }) => {
	const [seeMore, setSeeMore] = useState(false);
	const [postBody, setPostBody] = useState(
		postData.post.postBody
			? postData.post.postBody?.length < 256
				? postData.post.postBody
				: postData.post.postBody?.slice(0, 256) + "..."
			: ""
	);

	const handleSeeMore = () => {
		if (seeMore) {
			setPostBody(postData.post.postBody?.slice(0, 256) + "...");
		} else {
			setPostBody(postData.post.postBody || "");
		}
		setSeeMore(!seeMore);
	};

	return (
		<div className="flex flex-col shadow-page-box-1 bg-white rounded-lg">
			<div className="p-4 flex flex-row h-18 items-center gap-x-4">
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
			</div>
			<div className="flex flex-col px-4 pb-4 gap-y-2">
				<PostTextContent
					postData={postData}
					postBody={postBody}
					seeMore={seeMore}
					handleSeeMore={handleSeeMore}
				/>
			</div>
		</div>
	);
};

export default PostCard;
