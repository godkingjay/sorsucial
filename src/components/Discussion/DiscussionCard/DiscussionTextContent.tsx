import { DiscussionData } from "@/atoms/discussionAtom";
import React from "react";

type DiscussionTextContentProps = {
	discussionData: DiscussionData;
	discussionBody: string;
	isSingleDiscussionPage: () => boolean;
	handleReadMoreClick: () => void;
};

const DiscussionTextContent: React.FC<DiscussionTextContentProps> = ({
	discussionData,
	discussionBody,
	isSingleDiscussionPage,
	handleReadMoreClick,
}) => {
	return (
		<div className="discussion-text-content">
			<h1 className="discussion-text-content-title">
				{discussionData.discussion.discussionTitle}
			</h1>
			{discussionData.discussion.discussionBody && (
				<>
					<div className="divider"></div>
					<div className="discussion-text-content-body-container">
						<div className="discussion-text-content-body">
							{isSingleDiscussionPage() ? (
								<span>{discussionData.discussion.discussionBody}</span>
							) : (
								<>
									{discussionBody.length > 256 ? (
										<>
											<span className="content-fade">{discussionBody}</span>
											<span className="backdrop"></span>
											<span className="button-container">
												<button
													type="button"
													title="Read More"
													className="button"
													onClick={handleReadMoreClick}
												>
													Read More
												</button>
											</span>
										</>
									) : (
										<span>{discussionBody}</span>
									)}
								</>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default DiscussionTextContent;
