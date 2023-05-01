import { PostData } from "@/atoms/postAtom";
import useInput from "@/hooks/useInput";
import { PostLike } from "@/lib/interfaces/post";
import React from "react";
import { AiFillLike } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";

type PostLikeAndCommentDetailsProps = {
	userLike: PostData["userLike"];
	numberOfLikes: number;
	numberOfComments: number;
};

const PostLikeAndCommentDetails: React.FC<PostLikeAndCommentDetailsProps> = ({
	userLike,
	numberOfLikes,
	numberOfComments,
}) => {
	const { formatNumberWithSuffix } = useInput();

	return (
		<div className="px-4 pb-2 flex flex-row items-center justify-between">
			<div className="text-sm flex flex-row items-center gap-x-1">
				<div
					className={`
						h-5 w-5 aspect-square
						${numberOfLikes > 0 ? "text-blue-500" : "text-gray-500"}
					`}
				>
					<AiFillLike className="h-full w-full" />
				</div>
				<p className="text-gray-500 truncate">
					{userLike ? (
						<>
							You{" "}
							<span>
								{numberOfLikes > 1 &&
									`and ${formatNumberWithSuffix(numberOfLikes - 1)} others `}
								liked this post.
							</span>
						</>
					) : (
						<>
							{formatNumberWithSuffix(numberOfLikes)}{" "}
							<span>liked this post.</span>
						</>
					)}
				</p>
			</div>
			<div className="text-sm flex flex-row items-center gap-x-1">
				<div
					className={`
						h-5 w-5 aspect-square text-gray-500
					`}
				>
					<BiCommentDetail className="h-full w-full" />
				</div>
				<p className="text-gray-500 truncate">
					{formatNumberWithSuffix(numberOfComments)}{" "}
					<span>Comment{numberOfComments > 1 && "s"}</span>
				</p>
			</div>
		</div>
	);
};

export default PostLikeAndCommentDetails;
