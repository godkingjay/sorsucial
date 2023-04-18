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
import { BiCommentDetail } from "react-icons/bi";
import UserIcon from "../Icons/UserIcon";

type DiscussionCardProps = {
	userStateValue: UserState;
	userMounted?: boolean;
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

	const handleDiscussionVote = (voteType: "upVote" | "downVote") => {
		try {
			if (!userStateValue.user.uid) {
				throw new Error("You have to be logged in to vote in a discussion.");
			}

			if (!voting) {
				setVoting(true);
				onDiscussionVote(discussionData, voteType);
				setVoting(false);
			} else {
				throw new Error("You can only vote once.");
			}
		} catch (error: any) {
			console.log("Hook: Discussion Vote Error: ", error.message);
		}
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
			// replyBoxRef.current?.scrollIntoView({
			// 	behavior: "smooth",
			// 	block: "center",
			// });
			// replyBoxRef.current?.focus({ preventScroll: true });
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
			<div className="flex flex-row">
				<DiscussionVote
					discussionData={discussionData}
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
				<>
					<div className="h-[1px] bg-gray-200"></div>
					<div className="p-4 flex flex-col gap-y-4">
						<div className="flex flex-col gap-y-2">
							<form
								className="w-full flex flex-col gap-y-2 entrance-animation-slide-from-right"
								// onSubmit={(event) => handleSubmit(event)}
							>
								<div className="flex flex-row min-h-[40px] gap-x-2 relative">
									<div className="flex flex-row relative">
										{/* {commentLevel > 0 && (
											<div className="-z-0 absolute h-10 w-10 top-0 left-0">
												<div className="h-8 w-[28px] absolute right-full bottom-[50%] -translate-x-[2px] border-2 border-gray-200 border-t-transparent border-r-transparent rounded-bl-2xl"></div>
											</div>
										)} */}
										<div className="z-0 h-10 w-10 flex flex-row">
											<UserIcon user={userStateValue.user} />
										</div>
									</div>
									<div className="flex-1 min-h-[40px] rounded-[20px] bg-gray-100 flex flex-col">
										<textarea
											name="commentText"
											id="commentText"
											rows={1}
											title="Reply"
											placeholder="What do you think about this topic?"
											maxLength={8000}
											className="w-full h-full resize-none outline-none bg-transparent py-2.5 px-4 min-h-[40px] text-sm"
											onChange={(event) => {
												// onChange(event, setCommentForm);
												event.currentTarget.style.height = "0px";
												event.currentTarget.style.height =
													event.currentTarget.scrollHeight + "px";
											}}
											// value={commentForm.commentText}
											// disabled={submitting}
											// ref={commentBoxRef}
										></textarea>
										<div className="flex flex-row items-center justify-end flex-wrap p-2">
											<button
												type="submit"
												title="Create Reply"
												className="flex flex-row items-center gap-x-2 page-button w-max px-4 py-2 h-max text-xs ml-auto bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600"
												// disabled={
												// 	submitting || commentForm.commentText.length === 0
												// }
											>
												<div className="h-4 w-4 aspect-square">
													<BiCommentDetail className="h-full w-full" />
												</div>
												<div className="h-full flex flex-row items-center">
													<p>Create Reply</p>
												</div>
											</button>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default DiscussionCard;
