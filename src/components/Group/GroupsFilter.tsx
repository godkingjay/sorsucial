import useGroup from "@/hooks/useGroup";
import { SiteGroup } from "@/lib/interfaces/group";
import { QueryGroupsSortBy } from "@/lib/types/api";
import React, { useEffect, useState } from "react";

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
				<div className="grid grid-cols-2 gap-4">
					{filteredGroups.map((group, index) => (
						<React.Fragment key={group.group.id}>
							<div
								className="shadow-page-box-1 bg-white rounded-lg p-4 data-[top='true']:col-span-2"
								data-top={index < 3}
								data-order={index + 1}
							>
								<p>{group.group.name}</p>
								<p>{group.index[sortBy]}</p>
							</div>
						</React.Fragment>
					))}
				</div>
			)}
		</>
	);
};

export default GroupsFilter;
