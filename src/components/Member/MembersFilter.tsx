import React, { useCallback, useEffect, useRef, useState } from "react";
import { PageFilterProps } from "../Controls/PageFilter";
import { GroupMember } from "@/lib/interfaces/group";
import { QueryGroupMembersSortBy } from "@/lib/types/api";
import useGroup from "@/hooks/useGroup";
import useUser from "@/hooks/useUser";
import { GroupMemberData } from "@/atoms/groupAtom";

type MembersFilterProps = {
	addMember: boolean;
	filter: boolean;
	sortBy: QueryGroupMembersSortBy;
	groupId: string;
	roles?: GroupMember["roles"];
	pageEnd?: string;
	filterOptions?: PageFilterProps["filterOptions"];
};

const MembersFilter: React.FC<MembersFilterProps> = ({
	addMember = false,
	filter = false,
	sortBy = "accepted-desc",
	groupId,
	roles = undefined,
	pageEnd,
	filterOptions = {
		filterType: "group-members",
		options: {
			roles: false,
			date: false,
		},
	},
}) => {
	const { groupStateValue, fetchGroupMembers } = useGroup();
	const { userStateValue, userMounted } = useUser();
	const [loadingGroupMembers, setLoadingGroupMembers] = useState(false);
	const [firstLoadingGroupMembers, setFirstLoadingGroupMembers] =
		useState(false);
	const [endReached, setEndReached] = useState(false);
	const groupMembersMounted = useRef(false);
	const [filteredGroupMembers, setFilteredGroupMembers] = useState<
		GroupMemberData[]
	>([]);

	const filteredGroupMembersLength = filteredGroupMembers.length || -1;

	const sortByIndex =
		sortBy + `-${groupId}` + (roles ? `-${roles.join("_")}` : "");

	const handleFilterGroupMembers = useCallback(() => {
		setFilteredGroupMembers(
			groupStateValue.currentGroup?.members?.filter(
				(member) =>
					member.index[sortByIndex] !== undefined &&
					member.index[sortByIndex] >= 0
			) || []
		);
	}, [groupStateValue.currentGroup?.members, sortByIndex]);

	const handleFetchGroupMembers = useCallback(async () => {
		setLoadingGroupMembers(true);
		try {
			const fetchedGroupMembersLength = await fetchGroupMembers({
				sortBy,
				groupId,
				roles,
			});

			if (fetchedGroupMembersLength !== undefined) {
				setEndReached(fetchedGroupMembersLength < 10 ? true : false);
			}
		} catch (error: any) {
			console.log("Hook: fetching group members Error: ", error.message);
		}
		setLoadingGroupMembers(false);
	}, [fetchGroupMembers, groupId, roles, sortBy]);

	const handleFirstFetchGroupMembers = useCallback(async () => {
		setFirstLoadingGroupMembers(true);
		try {
			await handleFetchGroupMembers();
		} catch (error: any) {
			console.log("First Fetch: fetching group members Error: ", error.message);
		}
		setFirstLoadingGroupMembers(false);
	}, [handleFetchGroupMembers]);

	useEffect(() => {
		handleFilterGroupMembers();
	}, [groupStateValue.currentGroup]);

	useEffect(() => {
		if (userMounted) {
			if (!groupMembersMounted.current) {
				groupMembersMounted.current = true;
				handleFirstFetchGroupMembers();
			} else {
				groupMembersMounted.current = true;
			}
		}
	}, [userMounted]);

	return <div>MembersFilter</div>;
};

export default MembersFilter;
