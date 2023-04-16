import { DiscussionData, DiscussionOptionsState } from "@/atoms/discussionAtom";
import { UserState } from "@/atoms/userAtom";
import { NextRouter } from "next/router";
import React, { useState } from "react";
import { SetterOrUpdater } from "recoil";
import DiscussionVote from "./DiscussionCard/DiscussionVote";
import DiscussionHead from "./DiscussionCard/DiscussionHead";
import DiscussionTextContent from "./DiscussionCard/DiscussionTextContent";
import { GoCommentDiscussion } from "react-icons/go";
import { AiFillLike } from "react-icons/ai";
import { RiArrowUpDownFill, RiShareForwardLine } from "react-icons/ri";
import { FaLongArrowAltUp } from "react-icons/fa";
import { TbArrowBigDownLinesFilled, TbArrowBigUpLinesFilled } from "react-icons/tb";
import DiscussionVoteAndReplyDetails from "./DiscussionCard/DiscussionVoteAndReplyDetails";
import DiscussionFooter from "./DiscussionCard/DiscussionFooter";

type DiscussionCardProps = {
	userStateValue: UserState;
	userMounted?: boolean;
	discussionOptionsStateValue: DiscussionOptionsState;
	setDiscussionOptionsStateValue: SetterOrUpdater<DiscussionOptionsState>;
	discussionData: DiscussionData;
	router: NextRouter;
};

const DiscussionCard: React.FC<DiscussionCardProps> = ({
	userStateValue,
	userMounted,
	discussionOptionsStateValue,
	setDiscussionOptionsStateValue,
	discussionData,
	router,
}) => {
	const [discussionBody, setDiscussionBody] = useState(
		discussionData.discussion.discussionBody
			? discussionData.discussion.discussionBody?.length < 256
				? discussionData.discussion.discussionBody
				: discussionData.discussion.discussionBody?.slice(0, 256) + "..."
			: ""
	);

	const isSingleDiscussionPage = () => {
		const { asPath } = router;
		const { id: discussionId } = discussionData.discussion;

		switch (discussionData.discussion.discussionType) {
			case "discussion": {
				if (asPath === `/discussions/${discussionId}`) {
					return true;
				}
				break;
			}

			case "group": {
				const groupId = discussionData.discussion.groupId;
				if (asPath === `/groups/${groupId}/discussions/${discussionId}`) {
					return true;
				}
				break;
			}

			default: {
				return false;
				break;
			}
		}

		return false;
	};

	const formatNumberWithSuffix = (number: number) => {
		const suffixes = ["", "K", "M", "B"];
		let suffixIndex = 0;
		while (number >= 1000 && suffixIndex < suffixes.length - 1) {
			number /= 1000;
			suffixIndex++;
		}
		const roundedNumber = Math.round(number * 10) / 10;
		const suffix = suffixes[suffixIndex];
		return `${roundedNumber}${suffix}`;
	};

	return (
		<div className="flex flex-col shadow-page-box-1 bg-white rounded-lg relative">
			<div className="flex flex-row">
				<DiscussionVote discussionData={discussionData} />
				<div className="flex flex-col flex-1">
					<DiscussionHead
						userStateValue={userStateValue}
						discussionData={discussionData}
						discussionOptionsStateValue={discussionOptionsStateValue}
					/>
					<DiscussionTextContent
						discussionData={discussionData}
						discussionBody={discussionBody}
						isSingleDiscussionPage={isSingleDiscussionPage}
					/>
					<div className="flex flex-col">
						<DiscussionVoteAndReplyDetails
							discussionData={discussionData}
							formatNumberWithSuffix={formatNumberWithSuffix}
						/>
						<div className="h-[1px] bg-gray-200"></div>
						<DiscussionFooter discussionData={discussionData} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default DiscussionCard;
