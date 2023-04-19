import { PostCommentData } from "@/atoms/postAtom";
import Link from "next/link";
import React from "react";
import { AiFillLike } from "react-icons/ai";

type CommentItemCardProps = {
	commentData: PostCommentData;
	formatNumberWithSuffix: (number: number) => string;
};

const CommentItemCard: React.FC<CommentItemCardProps> = ({
	commentData,
	formatNumberWithSuffix,
}) => {
	return (
		<div className="w-full flex-1 flex flex-row gap-x-2 relative">
			<div className="flex flex-row">
				<div className="bg-gray-100 py-2 rounded-[20px] px-4 flex flex-col gap-y-1 relative min-w-[128px]">
					<h2 className="font-semibold text-xs truncate">
						{commentData.creator ? (
							<Link
								href={`/user/${commentData.creator.uid}`}
								className="inline hover:underline focus:underline"
							>
								{`${commentData.creator.firstName} ${commentData.creator.lastName}`}
							</Link>
						) : (
							<span>Unknown User</span>
						)}
					</h2>
					<p className="break-words text-sm">
						{commentData.comment.commentText}
					</p>
					<div
						className="absolute shadow-around-sm flex flex-row items-center gap-x-1 rounded-full -bottom-1 bg-white right-0 p-0.5 pr-1"
						style={{
							display: commentData.comment.numberOfLikes > 0 ? "flex" : "none",
						}}
					>
						<div className="h-4 w-4 aspect-square text-white p-0.5 rounded-full bg-blue-500">
							<AiFillLike className="h-full w-full" />
						</div>
						<p className="text-xs text-gray-500">
							{formatNumberWithSuffix(commentData.comment.numberOfLikes)}
						</p>
					</div>
				</div>
			</div>
			{/* <div className="flex-shrink-0 w-8 h-full flex flex-col items-center justify-center">
								  <button type="button" title="Comment Menu" className="w-8 h-8 bg-gray-100 rounded-full p-2">
										<BsThreeDots className="h-full w-full" />
									</button>
								</div> */}
		</div>
	);
};

export default CommentItemCard;
