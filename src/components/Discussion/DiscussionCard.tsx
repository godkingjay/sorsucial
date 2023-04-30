import { DiscussionData, DiscussionOptionsState } from "@/atoms/discussionAtom";
import { UserState } from "@/atoms/userAtom";
import { NextRouter } from "next/router";
import React, { useRef, useState } from "react";
import { SetterOrUpdater } from "recoil";
import DiscussionVote from "./DiscussionCard/DiscussionVote";
import DiscussionHead from "./DiscussionCard/DiscussionHead";
import DiscussionTextContent from "./DiscussionCard/DiscussionTextContent";
import DiscussionVoteAndReplyDetails from "./DiscussionCard/DiscussionVoteAndReplyDetails";
import DiscussionFooter from "./DiscussionCard/DiscussionFooter";
import { siteDetails } from "@/lib/host";
import DiscussionReplies from "./DiscussionCard/DiscussionReply/DiscussionReplies";
import ErrorBannerTextXs from "../Banner/ErrorBanner/ErrorBannerTextXs";
import TagsList from "../Tag/TagList";

type DiscussionCardProps = {
	userStateValue: UserState;
	userMounted: boolean;
	discussionData: DiscussionData;
	discussionOptionsStateValue: DiscussionOptionsState;
	setDiscussionOptionsStateValue: SetterOrUpdater<DiscussionOptionsState>;
	deleteDiscussion: (discussionData: DiscussionData) => Promise<void>;
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
	deleteDiscussion,
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
	const [voting, setVoting] = useState(false);
	const replyBoxRef = useRef<HTMLTextAreaElement>(null);

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
			await deleteDiscussion(discussionData);
		} catch (error: any) {
			console.log("Hook: Discussion Deletion Error: ", error.message);
		}
	};

	const handleDiscussionVote = async (voteType: "upVote" | "downVote") => {
		try {
			if (!userStateValue.user.uid) {
				throw new Error("You must be logged in to vote.");
			}

			if (!voting) {
				setVoting(true);
				await onDiscussionVote(discussionData, voteType);
			} else {
				throw new Error("You can only vote once.");
			}
		} catch (error: any) {
			console.log("Hook: Discussion Vote Error: ", error.message);
		}
		setVoting(false);
	};

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

	const handleFooterReplyClick = () => {
		if (isSingleDiscussionPage()) {
			console.log("Single Discussion Page");
			replyBoxRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			replyBoxRef.current?.focus({ preventScroll: true });
		} else {
			switch (discussionData.discussion.discussionType) {
				case "discussion": {
					router.push(`/discussions/${discussionData.discussion.id}`);
					break;
				}

				case "group": {
					router.push(
						`/groups/${discussionData.discussion.groupId}/discussions/${discussionData.discussion.id}`
					);
					break;
				}

				default: {
					break;
				}
			}
		}
	};

	const handleFooterShareClick = async (type: discussionShareType) => {
		let url = siteDetails.host;
		const ogSiteName = `&og:site_name=${encodeURIComponent("SorSUcial")}`;

		const ogUrl = `&og:url=${encodeURIComponent(window.location.href)}`;

		const ogTitle = `&og:title=${encodeURIComponent(
			discussionData.discussion.discussionTitle
		)}`;

		const ogDescription = `&og:description=${encodeURIComponent(
			discussionData.discussion.discussionBody?.slice(0, 512) || ""
		)}`;

		const faviconUrl = document
			.querySelector("link[rel='icon']")
			?.getAttribute("href");

		const ogImage = `&og:image=${encodeURIComponent(faviconUrl || "")}`;

		switch (discussionData.discussion.discussionType) {
			case "discussion": {
				url += `/discussions/${discussionData.discussion.id}`;
				break;
			}

			case "group": {
				url += `/groups/${discussionData.discussion.groupId}/discussions/${discussionData.discussion.id}`;
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
				)}${ogUrl}${ogSiteName}${ogTitle}${ogDescription}${ogImage}`;
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
			{!isSingleDiscussionPage() && discussionData.discussionDeleted && (
				<div className="duration-200 entrance-animation-float-down z-[250] items-center font-semibold bg-red-500 rounded-t-lg">
					<ErrorBannerTextXs
						message="This discussion no longer exist. It may have been deleted by the
											creator or an admin."
					/>
				</div>
			)}
			<div className="flex flex-row">
				<DiscussionVote
					discussionData={discussionData}
					voting={voting}
					isSingleDiscussionPage={isSingleDiscussionPage}
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
						handleReadMoreClick={handleReadMoreClick}
					/>
					{discussionData.discussion.discussionTags &&
						discussionData.discussion.discussionTags.length > 0 && (
							<div className="flex flex-row gap-x-4 mx-4 mb-2">
								<div className="flex-1">
									<TagsList
										itemName="Discussion Tags"
										items={discussionData.discussion.discussionTags}
									/>
								</div>
							</div>
						)}
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
							handleFooterReplyClick={handleFooterReplyClick}
							handleFooterShareClick={handleFooterShareClick}
						/>
					</div>
				</div>
			</div>
			{isSingleDiscussionPage() && (
				<DiscussionReplies
					userStateValue={userStateValue}
					userMounted={userMounted}
					currentDiscussion={discussionData}
					replyBoxRef={replyBoxRef}
					formatNumberWithSuffix={formatNumberWithSuffix}
				/>
			)}
		</div>
	);
};

export default DiscussionCard;
