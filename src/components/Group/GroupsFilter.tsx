import useGroup from "@/hooks/useGroup";
import { SiteGroup } from "@/lib/interfaces/group";
import { QueryGroupsSortBy } from "@/lib/types/api";
import React, { useEffect, useState } from "react";
import GroupCard from "./GroupCard";
import { GroupData } from "@/atoms/groupAtom";
import GroupCardSkeleton from "../Skeleton/Group/GroupCardSkeleton";
import VisibleInViewPort from "../Events/VisibleInViewPort";
import PageEnd from "../Banner/PageBanner/PageEnd";

type GroupsFilterProps = {
	sortBy: QueryGroupsSortBy;
	privacy: SiteGroup["privacy"];
	loadingGroups: boolean;
	endReached: boolean;
	groupsMounted: boolean;
	firstLoadingGroups: boolean;
	handleFetchGroups: () => Promise<void>;
};

const GroupsFilter: React.FC<GroupsFilterProps> = ({
	sortBy = "latest",
	privacy = "public",
	loadingGroups,
	endReached,
	groupsMounted,
	firstLoadingGroups,
	handleFetchGroups,
}) => {
	const { groupStateValue } = useGroup();
	const [filteredGroups, setFilteredGroups] = useState<GroupData[]>([]);
	const filteredGroupsLength = filteredGroups.length || -1;

	useEffect(() => {
		setFilteredGroups(
			groupStateValue.groups.filter(
				(group) =>
					group.group.privacy === privacy &&
					group.index &&
					group.index[sortBy] !== undefined &&
					group.index[sortBy] >= 0
			)
		);
	}, [groupStateValue.groups, privacy, sortBy]);

	return (
		<>
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
	);
};

export default GroupsFilter;
