import React, { useCallback, useEffect, useRef, useState } from "react";
import PageFilter, { PageFilterProps } from "../Controls/PageFilter";
import { GroupMember } from "@/lib/interfaces/group";
import { QueryGroupMembersSortBy } from "@/lib/types/api";
import useGroup from "@/hooks/useGroup";
import useUser from "@/hooks/useUser";
import { GroupMemberData } from "@/atoms/groupAtom";
import VisibleInViewPort from "../Events/VisibleInViewPort";
import PageEnd from "../Banner/PageBanner/PageEnd";
import MemberCardSkeleton from "../Skeleton/Member/MemberCardSkeleton";

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
	const sortByIndex =
		sortBy + `-${groupId}` + (roles ? `-${roles.join("_")}` : "");

	const { userStateValue, userMounted } = useUser();

	const { groupStateValue, fetchGroupMembers } = useGroup();

	const [loadingGroupMembers, setLoadingGroupMembers] = useState(false);
	const [firstLoadingGroupMembers, setFirstLoadingGroupMembers] =
		useState(false);
	const [endReached, setEndReached] = useState(false);

	const [filteredGroupMembersLength, setFilteredGroupMembersLength] = useState(
		groupStateValue.currentGroup?.members?.length || 0
	);
	const groupMembersMounted = useRef(false);

	const handleFetchGroupMembers = useCallback(async () => {
		try {
			if (!loadingGroupMembers) {
				setLoadingGroupMembers(true);

				const fetchedGroupMembersLength = await fetchGroupMembers({
					sortBy,
					groupId,
					roles,
				});

				if (
					fetchedGroupMembersLength !== undefined &&
					fetchedGroupMembersLength !== null
				) {
					setEndReached(fetchedGroupMembersLength < 10 ? true : false);
					setLoadingGroupMembers(false);
				}
			}
		} catch (error: any) {
			console.log("Hook: fetching group members Error: ", error.message);
			setLoadingGroupMembers(false);
		}
	}, [fetchGroupMembers, groupId, loadingGroupMembers, roles, sortBy]);

	const handleFirstFetchGroupMembers = useCallback(async () => {
		setFirstLoadingGroupMembers(true);
		try {
			await handleFetchGroupMembers();
		} catch (error: any) {
			console.log("First Fetch: fetching group members Error: ", error.message);
		}
		setFirstLoadingGroupMembers(false);
	}, [handleFetchGroupMembers]);

	const renderLoading = (count: number = 10) => {
		const result = [];

		for (let i = 0; i < count; i++) {
			result.push(
				<React.Fragment key={i}>
					<MemberCardSkeleton />
				</React.Fragment>
			);
		}

		return result;
	};

	useEffect(() => {
		if (userMounted) {
			if (!groupMembersMounted.current && filteredGroupMembersLength === 0) {
				groupMembersMounted.current = true;
				handleFirstFetchGroupMembers();
			} else {
				groupMembersMounted.current = true;
			}
		}
	}, [userMounted]);

	return (
		<>
			<div className="page-wrapper">
				{!userMounted || firstLoadingGroupMembers ? (
					<>
						<div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-4">
							{renderLoading(10)}
						</div>
					</>
				) : (
					<>
						{filter && <PageFilter />}
						<div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-4">
							<>
								{groupStateValue.currentGroup?.members
									.filter((member) => member.index[sortByIndex] >= 0)
									.sort((a, b) => a.index[sortByIndex] - b.index[sortByIndex])
									.map((member, index) => (
										<React.Fragment key={member.member.userId}>
											<p>{member.user?.uid}</p>
										</React.Fragment>
									))}
							</>
						</div>
						<>
							<VisibleInViewPort
								disabled={
									loadingGroupMembers ||
									firstLoadingGroupMembers ||
									endReached ||
									!userMounted ||
									!groupMembersMounted
								}
								onVisible={() =>
									loadingGroupMembers ||
									firstLoadingGroupMembers ||
									endReached ||
									!userMounted ||
									!groupMembersMounted
										? () => {}
										: handleFetchGroupMembers()
								}
							>
								{endReached ? (
									<>
										<PageEnd message={pageEnd || "End of Group Members"} />
									</>
								) : (
									<>
										<div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-4">
											{renderLoading(10)}
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

export default MembersFilter;
