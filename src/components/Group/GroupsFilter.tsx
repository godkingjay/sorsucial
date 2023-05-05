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
	creatorId?: string;
	creator?: string;
	tags?: string;
	pageEnd?: string;
	filterOptions?: PageFilterProps["filterOptions"];
};

const GroupsFilter: React.FC<GroupsFilterProps> = ({
	groupCreation = false,
	filter = false,
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
	const { groupStateValue, fetchGroups } = useGroup();
	const { userStateValue, userMounted } = useUser();
	const [loadingGroups, setLoadingGroups] = useState(false);
	const [firstLoadingGroups, setFirstLoadingGroups] = useState(false);
	const [endReached, setEndReached] = useState(false);
	const groupsMounted = useRef(false);
	const [filteredGroups, setFilteredGroups] = useState<GroupData[]>([]);
	const filteredGroupsLength = filteredGroups.length || -1;
	const regexCreator = new RegExp(creator || "", "i");

	const handleFilterGroups = useCallback(() => {
		setFilteredGroups(
			groupStateValue.groups.filter(
				(group) =>
					(creatorId ? group.group.creatorId === creatorId : true) &&
					(creator
						? group.creator?.firstName.match(regexCreator) ||
						  group.creator?.lastName.match(regexCreator) ||
						  group.creator?.middleName?.match(regexCreator) ||
						  group.creator?.email.match(regexCreator)
						: true) &&
					group.group.privacy === privacy &&
					group.index &&
					group.index[sortBy] !== undefined &&
					group.index[sortBy] >= 0
			)
		);
	}, [groupStateValue.groups, privacy, sortBy]);

	const handleFetchGroups = useCallback(async () => {
		setLoadingGroups(true);
		try {
			const fetchedGroupLength = await fetchGroups({
				privacy,
				sortBy,
				creatorId,
				creator,
				tags,
			});
			if (fetchedGroupLength !== undefined) {
				setEndReached(fetchedGroupLength < 10 ? true : false);
			}
		} catch (error: any) {
			console.log("Hook: fetching groups Error: ", error.message);
		}
		setLoadingGroups(false);
	}, [fetchGroups]);

	const handleFirstFetchGroups = useCallback(async () => {
		setFirstLoadingGroups(true);
		try {
			await handleFetchGroups();
		} catch (error: any) {
			console.log("First Fetch: fetching groups Error: ", error.message);
		}
		setFirstLoadingGroups(false);
	}, [handleFetchGroups]);

	useEffect(() => {
		handleFilterGroups();
	}, [groupStateValue]);

	useEffect(() => {
		if (userMounted) {
			if (!groupsMounted.current) {
				groupsMounted.current = true;
				handleFirstFetchGroups();
			} else {
				groupsMounted.current = true;
			}
		}
	}, [userMounted]);

	return (
		<>
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
						{filteredGroupsLength > 0 && (
							<>
								{filteredGroups.map((group, index) => (
									<React.Fragment key={group.group.id}>
										<GroupCard
											groupData={group}
											index={index}
										/>
									</React.Fragment>
								))}
							</>
						)}
						{loadingGroups && (
							<>
								<GroupCardSkeleton index={filteredGroupsLength + 1} />
								<GroupCardSkeleton index={filteredGroupsLength + 2} />
								<GroupCardSkeleton index={filteredGroupsLength + 3} />
								<GroupCardSkeleton index={filteredGroupsLength + 4} />
								<GroupCardSkeleton index={filteredGroupsLength + 5} />
							</>
						)}
					</div>
					{!endReached && groupsMounted && filteredGroupsLength > 0 && (
						<VisibleInViewPort
							disabled={endReached || loadingGroups || firstLoadingGroups}
							onVisible={handleFetchGroups}
						></VisibleInViewPort>
					)}
					{endReached && <PageEnd message="End of Groups" />}
				</>
			)}
		</>
	);
};

export default GroupsFilter;
