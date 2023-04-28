import useGroup from "@/hooks/useGroup";
import { SiteGroup } from "@/lib/interfaces/group";
import { QueryGroupsSortBy } from "@/lib/types/api";
import React, { useEffect, useState } from "react";
import GroupCard from "./GroupCard";

type GroupsFilterProps = {
	sortBy: QueryGroupsSortBy;
	privacy: SiteGroup["privacy"];
};

const GroupsFilter: React.FC<GroupsFilterProps> = ({
	sortBy = "latest",
	privacy = "public",
}) => {
	const { groupStateValue } = useGroup();
	const [filteredGroups, setFilteredGroups] = useState(
		groupStateValue.groups.filter(
			(group) => group.group.privacy === privacy && group.index[sortBy] >= 0
		)
	);

	useEffect(() => {
		setFilteredGroups(
			groupStateValue.groups.filter(
				(group) => group.group.privacy === privacy && group.index[sortBy] >= 0
			)
		);
	}, [groupStateValue.groups, privacy, sortBy]);

	return (
		<>
			{filteredGroups.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{filteredGroups.map((group, index) => (
						<React.Fragment key={group.group.id}>
							<GroupCard
								groupData={group}
								sortBy={sortBy}
							/>
						</React.Fragment>
					))}
				</div>
			)}
		</>
	);
};

export default GroupsFilter;
