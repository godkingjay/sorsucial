import { UserState } from "@/atoms/userAtom";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiCommentDetail } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";

type CommentBoxProps = {
	userStateValue: UserState;
};

const CommentBox: React.FC<CommentBoxProps> = ({ userStateValue }) => {
	return (
		<div className="w-full flex flex-col gap-y-2">
			<div className="flex flex-row min-h-[40px] gap-x-2 relative">
				<Link
					href={`/user/${userStateValue.user.uid}`}
					title={`${userStateValue.user.firstName} ${userStateValue.user.lastName}`}
					className="h-10 w-10 rounded-full bg-gray-100 text-gray-300"
				>
					{userStateValue.user.imageURL ? (
						<Image
							src={userStateValue.user.imageURL}
							alt="User Profile Picture"
							width={48}
							height={48}
							loading="lazy"
							className="rounded-full h-full w-full"
						/>
					) : (
						<FaUserCircle className="h-full w-full bg-white" />
					)}
				</Link>
				<div className="flex-1 min-h-[40px] rounded-[20px] bg-gray-100">
					<textarea
						name="comment"
						id="comment"
						rows={1}
						title="Comment"
						placeholder="Write a comment..."
						maxLength={8000}
						className="w-full h-full resize-none outline-none bg-transparent py-2.5 px-4 min-h-[40px] text-sm"
						onChange={(e) => {
							e.currentTarget.style.height = "0px";
							e.currentTarget.style.height =
								e.currentTarget.scrollHeight + "px";
						}}
					></textarea>
				</div>
				<div className="absolute top-0 left-5 h-full w-max pt-12 translate-x-[-100%]">
					<div className="w-[2px] h-full bg-gray-500 bg-opacity-20"></div>
				</div>
			</div>
			<button
				type="button"
				title="Create Comment"
				className="flex flex-row items-center gap-x-2 page-button w-max px-4 py-2 h-max text-sm ml-auto bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600"
			>
				<div className="h-5 w-5 aspect-square">
					<BiCommentDetail className="h-full w-full" />
				</div>
				<div className="h-full flex flex-row items-center">
					<p>Create Comment</p>
				</div>
			</button>
		</div>
	);
};

export default CommentBox;
