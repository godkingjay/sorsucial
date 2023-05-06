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
	const { userStateValue, userMounted } = useUser();
	const { discussionStateValue, fetchDiscussions } = useDiscussion();

	const [filteredDiscussions, setFilteredDiscussions] = useState<
		DiscussionData[]
	>([]);
	const [loadingDiscussions, setLoadingDiscussions] = useState(false);
	const [firstLoadingDiscussions, setFirstLoadingDiscussions] = useState(false);
	const [endReached, setEndReached] = useState(false);

	const discussionsMounted = useRef(false);

	const filteredDiscussionsLength = filteredDiscussions.length || -1;
	const regexCreator = new RegExp(creator || "", "i");
	const router = useRouter();

	const sortByIndex =
		sortBy +
		(discussionType ? `-${discussionType}` : "") +
		(privacy ? `-${privacy}` : "") +
		(groupId ? `-${groupId}` : "") +
		(creatorId ? `-${creatorId}` : "") +
		(creator ? `-${creator}` : "") +
		(tags ? `-${tags}` : "") +
		(isOpen !== undefined ? `-${isOpen ? "open" : "close"}` : "");

	const handleFilterDiscussions = useCallback(() => {
		setFilteredDiscussions(
			discussionStateValue.discussions
				.filter(
					(discussion) =>
						(creator
							? discussion.creator?.firstName.match(regexCreator) ||
							  discussion.creator?.lastName.match(regexCreator) ||
							  discussion.creator?.middleName?.match(regexCreator) ||
							  discussion.creator?.email.match(regexCreator)
							: true) &&
						discussion.index[sortByIndex] !== undefined &&
						discussion.index[sortByIndex] >= 0
				)
				.sort((a, b) => a.index[sortByIndex] - b.index[sortByIndex])
		);
	}, [discussionStateValue.discussions, creator, regexCreator, sortByIndex]);

	const handleFetchDiscussions = useCallback(async () => {
		setLoadingDiscussions(true);
		try {
			const fetchedDiscussionsLength = await fetchDiscussions({
				discussionType: discussionType,
				privacy: privacy,
				sortBy: sortBy,
				creatorId: creatorId,
				groupId: groupId,
				isOpen: isOpen,
			});
			if (fetchedDiscussionsLength !== undefined) {
				setEndReached(fetchedDiscussionsLength < 10 ? true : false);
			}
		} catch (error: any) {
			console.log("Hook: fetching discussions Error: ", error.message);
		}
		setLoadingDiscussions(false);
	}, [
		creatorId,
		discussionType,
		fetchDiscussions,
		groupId,
		isOpen,
		privacy,
		sortBy,
	]);

	const handleFirstFetchDiscussions = useCallback(async () => {
		setFirstLoadingDiscussions(true);
		try {
			await handleFetchDiscussions();
		} catch (error: any) {
			console.log("First Fetch: fetching discussions Error: ", error.message);
		}
		setFirstLoadingDiscussions(false);
	}, [handleFetchDiscussions]);

	useEffect(() => {
		if (userMounted) {
			if (!discussionsMounted.current && filteredDiscussionsLength <= 0) {
				discussionsMounted.current = true;
				handleFirstFetchDiscussions();
			} else {
				discussionsMounted.current = true;
			}
		}
	}, [filteredDiscussionsLength, handleFirstFetchDiscussions, userMounted]);

	useEffect(() => {
		handleFilterDiscussions();
	}, [discussionStateValue]);

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
						{filteredDiscussionsLength > 0 && (
							<>
								{filteredDiscussions.map((discussion, index) => (
									<React.Fragment key={discussion.discussion.id}>
										<DiscussionCard discussionData={discussion} />
									</React.Fragment>
								))}
							</>
						)}
						{loadingDiscussions && (
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
						{endReached && <PageEnd message={pageEnd || "End of Discussions"} />}
					</>
				)}
			</div>
		</>
	);
};

export default DiscussionsFilter;
