import { DiscussionData } from "@/atoms/discussionAtom";
import useDiscussion from "@/hooks/useDiscussion";
import useUser from "@/hooks/useUser";
import { SiteDiscussion } from "@/lib/interfaces/discussion";
import { QueryDiscussionsSortBy } from "@/lib/types/api";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DiscussionCardSkeleton from "../Skeleton/Discussion/DiscussionCardSkeleton";
import DiscussionCreationListener from "./DiscussionCreationListener";
import PageFilter from "../Controls/PageFilter";
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
	groupId?: string;
	creator?: string;
	tags?: string;
	pageEnd?: string;
};

const DiscussionsFilter: React.FC<DiscussionsFilterProps> = ({
	discussionType,
	discussionCreation,
	filter,
	sortBy,
	privacy,
	isOpen,
	groupId,
	creator,
	tags,
	pageEnd,
}) => {
	const { userStateValue, userMounted } = useUser();
	const {
		discussionStateValue,
		deleteDiscussion,
		discussionOptionsStateValue,
		setDiscussionOptionsStateValue,
		onDiscussionVote,
		fetchDiscussions,
	} = useDiscussion();

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

	const handleFilterDiscussions = useCallback(() => {
		setFilteredDiscussions(
			discussionStateValue.discussions.filter(
				(discussion) =>
					(groupId ? discussion.discussion.groupId === groupId : true) &&
					(creator
						? discussion.creator?.uid.match(regexCreator) ||
						  discussion.creator?.firstName.match(regexCreator) ||
						  discussion.creator?.lastName.match(regexCreator) ||
						  discussion.creator?.middleName?.match(regexCreator) ||
						  discussion.creator?.email.match(regexCreator)
						: true) &&
					discussion.discussion.privacy === privacy &&
					discussion.discussion.discussionType === discussionType &&
					discussion.index &&
					discussion.index[sortBy] !== undefined &&
					discussion.index[sortBy] >= 0
			)
		);
	}, [
		discussionStateValue.discussions,
		discussionType,
		privacy,
		sortBy,
		creator,
		groupId,
		regexCreator,
	]);

	const handleFetchDiscussions = useCallback(async () => {
		setLoadingDiscussions(true);
		try {
			const fetchedDiscussionsLength = await fetchDiscussions({
				discussionType: discussionType,
				privacy: privacy,
				sortBy: sortBy,
				groupId: groupId || undefined,
				isOpen: isOpen || undefined,
			});
			if (fetchedDiscussionsLength !== undefined) {
				setEndReached(fetchedDiscussionsLength < 10 ? true : false);
			}
		} catch (error: any) {
			console.log("Hook: fetching discussions Error: ", error.message);
		}
		setLoadingDiscussions(false);
	}, [discussionType, fetchDiscussions, groupId, isOpen, privacy, sortBy]);

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
			<div className="flex flex-col gap-y-4">
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
