import { PostData } from "@/atoms/postAtom";
import React from "react";
import { AiFillLike } from "react-icons/ai";

type PostLikeAndCommentDetailsProps = {
	postData: PostData;
	formatNumberWithSuffix: (number: number) => string;
};

const PostLikeAndCommentDetails: React.FC<PostLikeAndCommentDetailsProps> = ({
	postData,
	formatNumberWithSuffix,
}) => {
	return (
		<div className="px-4 pb-2">
			<div className="text-sm flex flex-row items-center gap-x-1">
				<div
					className={`
						h-5 w-5 aspect-square
						${postData.post.numberOfLikes > 0 ? "text-blue-500" : "text-gray-500"}
					`}
				>
					<AiFillLike className="h-full w-full" />
				</div>
				<p className="text-gray-500 truncate">
					{postData.userLike ? (
						<>
							You{" "}
							<span>
								{postData.post.numberOfLikes > 1 &&
									`${formatNumberWithSuffix(
										postData.post.numberOfLikes - 1
									)} and others `}
								liked this post.
							</span>
						</>
					) : (
						<>
							{formatNumberWithSuffix(postData.post.numberOfLikes)}{" "}
							<span>liked this post.</span>
						</>
					)}
				</p>
			</div>
		</div>
	);
};

export default PostLikeAndCommentDetails;
