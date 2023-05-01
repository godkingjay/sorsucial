import React, { useState } from "react";

type PostTextContentProps = {
	postTitle: string;
	postBodyRaw?: string;
};

const PostTextContent: React.FC<PostTextContentProps> = ({
	postTitle,
	postBodyRaw,
}) => {
	const [seeMore, setSeeMore] = useState(false);
	const [postBody, setPostBody] = useState(
		postBodyRaw
			? postBodyRaw?.length < 256
				? postBodyRaw
				: postBodyRaw?.slice(0, 256) + "..."
			: ""
	);

	const handleSeeMore = () => {
		if (seeMore) {
			setPostBody(postBodyRaw?.slice(0, 256) + "...");
		} else {
			setPostBody(postBodyRaw || "");
		}
		setSeeMore(!seeMore);
	};

	return (
		<div className="flex flex-col px-4 pb-4 gap-y-2">
			<h1 className="text-lg font-bold whitespace-pre-wrap break-words w-full">
				{postTitle}
			</h1>
			{postBodyRaw && (
				<>
					<div className="h-[1px] bg-black bg-opacity-10"></div>
					<div className="flex flex-col items-start break-words">
						<p className="text-sm text-justify whitespace-pre-wrap break-words w-full">
							{postBody}
							{postBodyRaw.length > 256 && (
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
