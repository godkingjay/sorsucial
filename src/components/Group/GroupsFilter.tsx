import useGroup from "@/hooks/useGroup";
import { SiteGroup } from "@/lib/interfaces/group";
import { QueryGroupsSortBy } from "@/lib/types/api";
import React, { useCallback, useEffect, useRef, useState } from "react";
import GroupCard from "./GroupCard";
import { GroupData } from "@/atoms/groupAtom";
import GroupCardSkeleton from "../Skeleton/Group/GroupCardSkeleton";
import VisibleInViewPort from "../Events/VisibleInViewPort";
import PageEnd from "../Banner/PageBanner/PageEnd";
import PageFilter, { PageFilterProps } from "../Controls/PageFilter";
import useUser from "@/hooks/useUser";
import GroupCreationListener from "./GroupCreationListener";

type GroupsFilterProps = {
	groupCreation?: boolean;
	filter?: boolean;
	sortBy: QueryGroupsSortBy;
	privacy: SiteGroup["privacy"];
	userPageId?: string;
	creatorId?: string;
	creator?: string;
	tags?: string;
	pageEnd?: string;
	filterOptions?: PageFilterProps["filterOptions"];
};

const GroupsFilter: React.FC<GroupsFilterProps> = ({
	groupCreation = false,
	filter = false,
	userPageId = undefined,
	creatorId = undefined,
	creator = undefined,
	tags = undefined,
	sortBy = "latest",
	privacy = "public",
	pageEnd,
	filterOptions = {
		filterType: "groups",
		options: {
			creatorId: false,
			creator: false,
			privacy: false,
			tags: false,
			members: false,
			date: false,
			posts: false,
			discussions: false,
		},
	},
}) => {
	const sortByIndex =
		sortBy +
		(privacy ? `-${privacy}` : "") +
		(userPageId ? `-${userPageId}` : "") +
		(creatorId ? `-${creatorId}` : "") +
		(creator ? `-${creator}` : "") +
		(tags ? `-${tags}` : "");

	const { groupStateValue, fetchGroups } = useGroup();

	const { userStateValue, userMounted } = useUser();

	const [loadingGroups, setLoadingGroups] = useState(false);
	const [firstLoadingGroups, setFirstLoadingGroups] = useState(false);
	const [endReached, setEndReached] = useState(false);
	const [filteredGroupsLength, setFilteredGroupsLength] = useState(
		groupStateValue.groups.filter(
			(group) =>
				group.index[sortByIndex] !== undefined && group.index[sortByIndex] >= 0
		).length
	);

	const groupsMounted = useRef(false);

	const regexCreator = new RegExp(creator || "", "i");

	const handleFetchGroups = useCallback(async () => {
		try {
			if (!loadingGroups) {
				setLoadingGroups(true);

				const fetchedGroupLength = await fetchGroups({
					privacy,
					sortBy,
					creatorId,
					creator,
					tags,
				});

				if (fetchedGroupLength !== undefined && fetchedGroupLength !== null) {
					setEndReached(fetchedGroupLength < 10 ? true : false);
					setLoadingGroups(false);
				}
			}
		} catch (error: any) {
			console.log("Hook: fetching groups Error: ", error.message);
			setLoadingGroups(false);
		}
	}, [creator, creatorId, fetchGroups, loadingGroups, privacy, sortBy, tags]);

	const handleFirstFetchGroups = useCallback(async () => {
		try {
			if (!firstLoadingGroups) {
				setFirstLoadingGroups(true);
				await handleFetchGroups();

				setFirstLoadingGroups(false);
			}
		} catch (error: any) {
			console.log("First Fetch: fetching groups Error: ", error.message);
			setFirstLoadingGroups(false);
		}
	}, [firstLoadingGroups, handleFetchGroups]);

	useEffect(() => {
		if (userMounted) {
			if (!groupsMounted.current && fetchGroups.length <= 0) {
				groupsMounted.current = true;
				handleFirstFetchGroups();
			} else {
				groupsMounted.current = true;
			}
		}
	}, [userMounted]);

	return (
		<>
			<div className="page-wrapper">
				{!userMounted || firstLoadingGroups ? (
					<>
						<>
							<GroupCardSkeleton index={filteredGroupsLength + 1} />
							<GroupCardSkeleton index={filteredGroupsLength + 2} />
							<GroupCardSkeleton index={filteredGroupsLength + 3} />
							<GroupCardSkeleton index={filteredGroupsLength + 4} />
							<GroupCardSkeleton index={filteredGroupsLength + 5} />
						</>
					</>
				) : (
					<>
						{groupCreation && <GroupCreationListener />}
						{filter && <PageFilter />}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<>
								{groupStateValue.groups
									.filter((group) => group.index[sortByIndex] >= 0)
									.sort((a, b) => a.index[sortByIndex] - b.index[sortByIndex])
									.map((group, index) => (
										<React.Fragment key={group.group.id}>
											<GroupCard
												groupData={group}
												index={index}
											/>
										</React.Fragment>
									))}
							</>
							{/* {(loadingGroups ||
								!endReached) && (
									<>
										<GroupCardSkeleton index={filteredGroupsLength + 1} />
										<GroupCardSkeleton index={filteredGroupsLength + 2} />
										<GroupCardSkeleton index={filteredGroupsLength + 3} />
										<GroupCardSkeleton index={filteredGroupsLength + 4} />
										<GroupCardSkeleton index={filteredGroupsLength + 5} />
									</>
								)} */}
						</div>
						<>
							<VisibleInViewPort
								disabled={
									loadingGroups ||
									firstLoadingGroups ||
									endReached ||
									!userMounted ||
									!groupsMounted
								}
								onVisible={() =>
									loadingGroups ||
									firstLoadingGroups ||
									endReached ||
									!userMounted ||
									!groupsMounted
										? () => {}
										: handleFetchGroups()
								}
							>
								{endReached ? (
									<>
										<PageEnd message={pageEnd || "End of Groups"} />
									</>
								) : (
									<>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<GroupCardSkeleton index={filteredGroupsLength + 1} />
											<GroupCardSkeleton index={filteredGroupsLength + 2} />
											<GroupCardSkeleton index={filteredGroupsLength + 3} />
											<GroupCardSkeleton index={filteredGroupsLength + 4} />
											<GroupCardSkeleton index={filteredGroupsLength + 5} />
										</div>
									</>
								)}
							</VisibleInViewPort>
						</>
					</>
				)}
			</div>
		</>
	);
};

export default GroupsFilter;
