import { DiscussionData, DiscussionOptionsState } from "@/atoms/discussionAtom";
import { UserState } from "@/atoms/userAtom";
import { NextRouter } from "next/router";
import React, { useState } from "react";
import { SetterOrUpdater } from "recoil";
import DiscussionVote from "./DiscussionCard/DiscussionVote";
import DiscussionHead from "./DiscussionCard/DiscussionHead";
import DiscussionTextContent from "./DiscussionCard/DiscussionTextContent";
import DiscussionVoteAndReplyDetails from "./DiscussionCard/DiscussionVoteAndReplyDetails";
import DiscussionFooter from "./DiscussionCard/DiscussionFooter";
import { siteDetails } from "@/lib/host";

type DiscussionCardProps = {
	userStateValue: UserState;
	userMounted?: boolean;
	discussionData: DiscussionData;
	discussionOptionsStateValue: DiscussionOptionsState;
	setDiscussionOptionsStateValue: SetterOrUpdater<DiscussionOptionsState>;
	onDiscussionVote: (
		discussionData: DiscussionData,
		voteType: "upVote" | "downVote"
	) => void;
	router: NextRouter;
};

export type discussionShareType = "facebook" | "copy";

const DiscussionCard: React.FC<DiscussionCardProps> = ({
	userStateValue,
	userMounted,
	discussionData,
	discussionOptionsStateValue,
	setDiscussionOptionsStateValue,
	onDiscussionVote,
	router,
}) => {
	const [discussionBody, setDiscussionBody] = useState(
		discussionData.discussion.discussionBody
			? discussionData.discussion.discussionBody?.length < 256
				? discussionData.discussion.discussionBody
				: discussionData.discussion.discussionBody?.slice(0, 256) + "..."
			: ""
	);

	const handleDiscussionOptions = (name: keyof DiscussionOptionsState) => {
		if (discussionOptionsStateValue[name] === discussionData.discussion.id) {
			setDiscussionOptionsStateValue({
				...discussionOptionsStateValue,
				[name]: "",
			});
		} else {
			setDiscussionOptionsStateValue({
				...discussionOptionsStateValue,
				[name]: discussionData.discussion.id,
			});
		}
	};

	const handleDeleteDiscussion = async () => {
		try {
			if (
				userStateValue.user.uid !== discussionData.discussion.creatorId ||
				userStateValue.user.roles.includes("admin")
			) {
				throw new Error("You are not authorized to delete this discussion!");
			}

			await Promise.all([]);
		} catch (error: any) {
			console.log("Hook: Discussion Deletion Error: ", error.message);
		}
	};

	const handleDiscussionVote = (voteType: "upVote" | "downVote") => {
		try {
			if (!userStateValue.user.uid) {
				throw new Error("You have to be logged in to vote in a discussion.");
			}

			onDiscussionVote(discussionData, voteType);
		} catch (error: any) {
			console.log("Hook: Discussion Vote Error: ", error.message);
		}
	};

	const handleFooterShareClick = async (type: discussionShareType) => {
		let url = siteDetails.host;
		const siteName = `&og_site_name=${encodeURIComponent("SorSUcial")}`;

		const title = `&og_site_title=${encodeURIComponent(
			discussionData.discussion.discussionTitle
		)}`;

		const description = `&og_description=${encodeURIComponent(
			discussionData.discussion.discussionBody?.slice(0, 512) || ""
		)}`;

		const faviconUrl = document
			.querySelector("link[rel='icon']")
			?.getAttribute("href");

		const image = `&og_image=${encodeURIComponent(faviconUrl || "")}`;

		switch (discussionData.discussion.discussionType) {
			case "discussion": {
				url += `discussions/${discussionData.discussion.id}`;
				break;
			}

			case "group": {
				url += `groups/${discussionData.discussion.groupId}/discussions/${discussionData.discussion.id}`;
				break;
			}

			default: {
				break;
			}
		}

		switch (type) {
			case "copy": {
				await navigator.clipboard.writeText(url);
				alert("Post link copied to clipboard!");
				break;
			}

			case "facebook": {
				const fbSharerUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
					url
				)}${siteName}${title}${description}${image}`;
				window.open(fbSharerUrl, "_blank");
				break;
			}

			default: {
				break;
			}
		}
	};

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
		const roundedNumber = Math.floor(number * 100) / 100;
		const suffix = suffixes[suffixIndex];
		return `${roundedNumber}${suffix}`;
	};

	return (
		<div className="flex flex-col shadow-page-box-1 bg-white rounded-lg relative entrance-animation-slide-from-right">
			<div className="flex flex-row">
				<DiscussionVote
					discussionData={discussionData}
					handleDiscussionVote={handleDiscussionVote}
					formatWithSuffix={formatNumberWithSuffix}
				/>
				<div className="flex flex-col flex-1">
					<DiscussionHead
						userStateValue={userStateValue}
						discussionData={discussionData}
						discussionOptionsStateValue={discussionOptionsStateValue}
						handleDiscussionOptions={handleDiscussionOptions}
						handleDeleteDiscussion={handleDeleteDiscussion}
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
						<DiscussionFooter
							discussionData={discussionData}
							discussionOptionsStateValue={discussionOptionsStateValue}
							handleDiscussionOptions={handleDiscussionOptions}
							handleFooterShareClick={handleFooterShareClick}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DiscussionCard;
