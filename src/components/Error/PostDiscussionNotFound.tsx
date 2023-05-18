import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BsFillFilePostFill, BsFillPostcardFill } from "react-icons/bs";
import { FaBullhorn } from "react-icons/fa";
import { GiDiscussion } from "react-icons/gi";
import { GoCommentDiscussion } from "react-icons/go";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { RxCaretRight } from "react-icons/rx";

export type PostDiscussionNotFoundProps = {
	type:
		| "user-post"
		| "announcement"
		| "group-post"
		| "discussion"
		| "group-discussion";
};

const PostDiscussionNotFound: React.FC<PostDiscussionNotFoundProps> = ({
	type,
}) => {
	const router = useRouter();

	const { groupId, userId } = router.query;

	return (
		<>
			<div className="p-4 flex flex-col items-center">
				<div className="flex flex-col items-center max-w-sm my-4 text-gray-700 gap-y-4">
					<div className="h-32 w-32 p-4 bg-white rounded-full shadow-page-box-1 border-4 border-gray-100">
						{type === "user-post" ? (
							<>
								<BsFillFilePostFill className="h-full w-full" />
							</>
						) : type === "announcement" ? (
							<>
								<FaBullhorn className="h-full w-full" />
							</>
						) : type === "group-post" ? (
							<>
								<BsFillPostcardFill className="h-full w-full" />
							</>
						) : type === "discussion" ? (
							<>
								<GoCommentDiscussion className="h-full w-full" />
							</>
						) : type === "group-discussion" ? (
							<>
								<GiDiscussion className="h-full w-full" />
							</>
						) : (
							<>
								<HiOutlineEmojiSad className="h-full w-full" />
							</>
						)}
					</div>
					<div className="flex flex-col items-center gap-y-4">
						<p className="font-bold">
							This{" "}
							{type === "user-post"
								? "post"
								: type === "announcement"
								? "announcement"
								: type === "group-post"
								? "group post"
								: type === "discussion"
								? "discussion"
								: type === "group-discussion"
								? "group discussion"
								: "content"}{" "}
							could not be found!
						</p>
						<Link
							href={
								type === "user-post"
									? `/user/${userId}/`
									: type === "announcement"
									? `/`
									: type === "group-post"
									? `/groups/${groupId}/`
									: type === "discussion"
									? `/discussions`
									: type === "group-discussion"
									? `/groups/${groupId}/discussions`
									: `/`
							}
							className="border-2 flex flex-row gap-x-1 items-center border-blue-500 rounded-full px-2 pl-4 py-2 text-sm font-semibold text-blue-500 group hover:bg-blue-100 hover:text-blue-600 focus:bg-blue-100 focus:text-blue-600"
						>
							<div>
								<p>
									Go to{" "}
									{type === "user-post"
										? "User Page"
										: type === "announcement"
										? "Homepage"
										: type === "group-post"
										? "Group Posts"
										: type === "discussion"
										? "Discussions"
										: type === "group-discussion"
										? "Group Discussions"
										: "Homepage"}
								</p>
							</div>
							<div className="h-6 w-6 duration-200 group-hover:translate-x-1 group-focus:translate-x-1">
								<RxCaretRight className="h-full w-full" />
							</div>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default PostDiscussionNotFound;
