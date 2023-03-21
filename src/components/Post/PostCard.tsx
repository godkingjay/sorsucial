import { PostData } from "@/atoms/postAtom";
import { UserState } from "@/atoms/userAtom";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import PostTextContent from "./PostCard/PostTextContent";
import PostHead from "./PostCard/PostHead";

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
			<PostHead
				userStateValue={userStateValue}
				postData={postData}
			/>
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
