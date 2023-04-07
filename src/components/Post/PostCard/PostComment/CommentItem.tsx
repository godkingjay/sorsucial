import { PostCommentData } from "@/atoms/postAtom";
import UserIcon from "@/components/Icons/UserIcon";
import Link from "next/link";
import React from "react";

type CommentItemProps = {
	commentData: PostCommentData;
};

const CommentItem: React.FC<CommentItemProps> = ({ commentData }) => {
	return (
		<>
			<div className="flex flex-row gap-x-2 w-full relative min-h-[40px]">
				<UserIcon user={commentData.creator} />
				<div className="flex-1 flex flex-col gap-y-1">
					<div className="w-full flex-1 flex flex-row gap-x-2">
						<div className="flex flex-row">
							<div className="bg-gray-100 py-2 rounded-[20px] px-4 flex flex-col gap-y-1">
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
							</div>
						</div>
						{/* <div className="flex-shrink-0 w-8 h-full flex flex-col items-center justify-center">
								  <button type="button" title="Comment Menu" className="w-8 h-8 bg-gray-100 rounded-full p-2">
										<BsThreeDots className="h-full w-full" />
									</button>
								</div> */}
					</div>
				</div>
				<div className="absolute top-0 left-5 h-full w-max pt-12 translate-x-[-100%]">
					<div className="w-[2px] h-full bg-gray-500 bg-opacity-20"></div>
				</div>
			</div>
		</>
	);
};

export default CommentItem;
