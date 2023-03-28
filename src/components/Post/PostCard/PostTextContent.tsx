import { PostData } from "@/atoms/postAtom";
import React from "react";

type PostTextContentProps = {
	postData: PostData;
	postBody: string;
	seeMore: boolean;
	handleSeeMore: () => void;
};

const PostTextContent: React.FC<PostTextContentProps> = ({
	postData,
	postBody,
	seeMore,
	handleSeeMore,
}) => {
	return (
		<div className="flex flex-col px-4 pb-4 gap-y-2">
			<h1 className="text-lg font-bold whitespace-pre-wrap break-words w-full">
				{postData.post.postTitle}
			</h1>
			{postData.post.postBody && (
				<>
					<div className="h-[1px] bg-black bg-opacity-10"></div>
					<div className="flex flex-col items-start break-words">
						<p className="text-sm text-justify whitespace-pre-wrap break-words w-full">
							{postBody}
							{postData.post.postBody.length > 256 && (
								<>
									<button
										type="button"
										title={seeMore ? "See Less" : "See More"}
										onClick={handleSeeMore}
										className={`${
											seeMore && "block"
										} text-gray-400 text-xs hover:text-gray-500`}
									>
										{seeMore ? "...See Less" : "See More..."}
									</button>
								</>
							)}
						</p>
					</div>
				</>
			)}
		</div>
	);
};

export default PostTextContent;
