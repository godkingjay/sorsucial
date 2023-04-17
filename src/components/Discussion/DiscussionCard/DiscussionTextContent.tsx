import { DiscussionData } from "@/atoms/discussionAtom";
import React from "react";

type DiscussionTextContentProps = {
	discussionData: DiscussionData;
	discussionBody: string;
	isSingleDiscussionPage: () => boolean;
};

const DiscussionTextContent: React.FC<DiscussionTextContentProps> = ({
	discussionData,
	discussionBody,
	isSingleDiscussionPage,
}) => {
	return (
		<div className="flex flex-col px-4 py-2 gap-y-2">
			<h1 className="font-semibold whitespace-pre-wrap break-words w-full">
				{discussionData.discussion.discussionTitle}
			</h1>
			{discussionData.discussion.discussionBody && (
				<>
					<div className="h-[1px] bg-black bg-opacity-10"></div>
					<div className="flex flex-col items-start break-words relative">
						<p className="text-sm text-justify whitespace-pre-wrap break-words w-full">
							{isSingleDiscussionPage() ? (
								<span>{discussionData.discussion.discussionBody}</span>
							) : (
								<>
									{discussionBody.length > 256 ? (
										<span className="content-fade">{discussionBody}</span>
									) : (
										<span>{discussionBody}</span>
									)}
								</>
							)}
						</p>
					</div>
				</>
			)}
		</div>
	);
};

export default DiscussionTextContent;
