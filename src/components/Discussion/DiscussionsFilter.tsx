import { DiscussionData } from "@/atoms/discussionAtom";
import useDiscussion from "@/hooks/useDiscussion";
import useUser from "@/hooks/useUser";
import { SiteDiscussion } from "@/lib/interfaces/discussion";
import { QueryDiscussionsSortBy } from "@/lib/types/api";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DiscussionCardSkeleton from "../Skeleton/Discussion/DiscussionCardSkeleton";
import DiscussionCreationListener from "./DiscussionCreationListener";
import PageFilter, { PageFilterProps } from "../Controls/PageFilter";
import DiscussionCard from "./DiscussionCard";
import { useRouter } from "next/router";
import VisibleInViewPort from "../Events/VisibleInViewPort";
import PageEnd from "../Banner/PageBanner/PageEnd";

type DiscussionsFilterProps = {
	discussionType: SiteDiscussion["discussionType"];
	discussionCreation?: boolean;
	filter?: boolean;
	sortBy: QueryDiscussionsSortBy;
	privacy: SiteDiscussion["privacy"];
	isOpen?: boolean;
	creatorId?: string;
	creator?: string;
	groupId?: string;
	tags?: string;
	pageEnd?: string;
	filterOptions?: PageFilterProps["filterOptions"];
};

const DiscussionsFilter: React.FC<DiscussionsFilterProps> = ({
	discussionType = "discussion",
	discussionCreation = false,
	filter = false,
	sortBy = "latest",
	privacy = "public",
	isOpen = undefined,
	creatorId = undefined,
	creator = undefined,
	groupId = undefined,
	tags = undefined,
	pageEnd,
	filterOptions = {
		filterType: "discussions",
		options: {
			discussionType: false,
			privacy: false,
			isOpen: false,
			creatorId: false,
			creator: false,
			groupId: false,
			tags: false,
			votes: false,
			replies: false,
			date: false,
		},
	},
}) => {
	const sortByIndex =
		sortBy +
		(discussionType ? `-${discussionType}` : "") +
		(privacy ? `-${privacy}` : "") +
		(groupId ? `-${groupId}` : "") +
		(creatorId ? `-${creatorId}` : "") +
		(creator ? `-${creator}` : "") +
		(tags ? `-${tags}` : "") +
		(isOpen !== undefined ? `-${isOpen ? "open" : "close"}` : "");

	const { userStateValue, userMounted } = useUser();
	const { discussionStateValue, fetchDiscussions } = useDiscussion();

	const [loadingDiscussions, setLoadingDiscussions] = useState(false);
	const [firstLoadingDiscussions, setFirstLoadingDiscussions] = useState(false);
	const [endReached, setEndReached] = useState(false);

	const [filteredDiscussionsLength, setFilteredDiscussionsLength] = useState(
		discussionStateValue.discussions.filter(
			(discussion) => discussion.index[sortByIndex] >= 0
		).length
	);

	const discussionsMounted = useRef(false);

	const regexCreator = new RegExp(creator || "", "i");
	const router = useRouter();

	const handleFetchDiscussions = useCallback(async () => {
		try {
			if (!loadingDiscussions) {
				setLoadingDiscussions(true);

				const fetchedDiscussionsLength = await fetchDiscussions({
					discussionType: discussionType,
					privacy: privacy,
					sortBy: sortBy,
					creatorId: creatorId,
					groupId: groupId,
					isOpen: isOpen,
				});
				if (
					fetchedDiscussionsLength !== null &&
					fetchedDiscussionsLength !== undefined
				) {
					setEndReached(fetchedDiscussionsLength < 10 ? true : false);
					setLoadingDiscussions(false);
				}
			}
		} catch (error: any) {
			console.log("Hook: fetching discussions Error: ", error.message);
			setLoadingDiscussions(false);
		}
	}, [
		creatorId,
		discussionType,
		fetchDiscussions,
		groupId,
		isOpen,
		loadingDiscussions,
		privacy,
		sortBy,
	]);

	const handleFirstFetchDiscussions = useCallback(async () => {
		try {
			if (!firstLoadingDiscussions) {
				setFirstLoadingDiscussions(true);

				await handleFetchDiscussions();
				setFirstLoadingDiscussions(false);
			}
		} catch (error: any) {
			console.log("First Fetch: fetching discussions Error: ", error.message);
			setFirstLoadingDiscussions(false);
		}
	}, [firstLoadingDiscussions, handleFetchDiscussions]);

	useEffect(() => {
		if (userMounted) {
			if (!discussionsMounted.current && filteredDiscussionsLength <= 0) {
				discussionsMounted.current = true;
				handleFirstFetchDiscussions();
			} else {
				discussionsMounted.current = true;
			}
		}
	}, [userMounted]);

	return (
		<>
			<div className="page-wrapper">
				{!userMounted || firstLoadingDiscussions ? (
					<>
						<>
							<DiscussionCardSkeleton />
							<DiscussionCardSkeleton />
						</>
					</>
				) : (
					<>
						{discussionCreation && (
							<DiscussionCreationListener
								discussionType={discussionType}
								useStateValue={userStateValue}
							/>
						)}
						{filter && <PageFilter />}
						<>
							{discussionStateValue.discussions
								.filter((discussion) => discussion.index[sortByIndex] >= 0)
								.map((discussion, index) => (
									<React.Fragment key={discussion.discussion.id}>
										<DiscussionCard discussionData={discussion} />
									</React.Fragment>
								))}
						</>
						{/* {loadingDiscussions && (
							<>
								<DiscussionCardSkeleton />
								<DiscussionCardSkeleton />
							</>
						)}
						{!endReached &&
							discussionsMounted &&
							filteredDiscussionsLength > 0 && (
								<>
									<VisibleInViewPort
										disabled={
											endReached || loadingDiscussions || firstLoadingDiscussions
										}
										onVisible={() => handleFetchDiscussions()}
									/>
								</>
							)}
						{endReached && <PageEnd message={pageEnd || "End of Discussions"} />} */}
						<>
							<VisibleInViewPort
								disabled={
									loadingDiscussions ||
									firstLoadingDiscussions ||
									endReached ||
									!userMounted ||
									!discussionsMounted
								}
								onVisible={() =>
									loadingDiscussions ||
									firstLoadingDiscussions ||
									endReached ||
									!userMounted ||
									!discussionsMounted
										? () => {}
										: handleFetchDiscussions()
								}
							>
								<div className="flex flex-col gap-y-4">
									{endReached ? (
										<>
											<PageEnd message={pageEnd || "End of Discussions"} />
										</>
									) : (
										<>
											<DiscussionCardSkeleton />
											<DiscussionCardSkeleton />
										</>
									)}
								</div>
							</VisibleInViewPort>
						</>
					</>
				)}
			</div>
		</>
	);
};

export default DiscussionsFilter;
