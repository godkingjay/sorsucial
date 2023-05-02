import { DiscussionData } from "@/atoms/discussionAtom";
import { useRouter } from "next/router";
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
	const router = useRouter();

	const handleReadMoreClick = () => {
		switch (discussionData.discussion.discussionType) {
			case "discussion":
				router.push(`/discussions/${discussionData.discussion.id}`);
				break;

			case "group":
				router.push(
					`/groups/${discussionData.discussion.groupId}/discussions/${discussionData.discussion.id}`
				);
				break;

			default:
				break;
		}
	};

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
