import React, { useCallback, useEffect, useRef, useState } from "react";
import PageFilter, { PageFilterProps } from "../Controls/PageFilter";
import { GroupMember } from "@/lib/interfaces/group";
import { QueryGroupMembersSortBy } from "@/lib/types/api";
import useGroup from "@/hooks/useGroup";
import useUser from "@/hooks/useUser";
import { GroupMemberData } from "@/atoms/groupAtom";
import VisibleInViewPort from "../Events/VisibleInViewPort";
import PageEnd from "../Banner/PageBanner/PageEnd";

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
		try {
			if (!loadingGroupMembers) {
				setLoadingGroupMembers(true);

				const fetchedGroupMembersLength = await fetchGroupMembers({
					sortBy,
					groupId,
					roles,
				});

				if (fetchedGroupMembersLength !== undefined) {
					setEndReached(fetchedGroupMembersLength < 2 ? true : false);
				}
			}
		} catch (error: any) {
			console.log("Hook: fetching group members Error: ", error.message);
		}
		setLoadingGroupMembers(false);
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

	const renderLoading = () => {
		const result = [];

		for (let i = 0; i < 10; i++) {
			result.push(
				<div
					key={i}
					className="bg-white rounded-lg shadow-page-box-1 p-4 flex flex-row gap-x-2"
				>
					<div className="h-16 w-16 rounded-full skeleton-color animate-pulse"></div>
					<div className="flex flex-1 flex-col gap-y-2">
						<div className="h-3 w-full rounded-full skeleton-color"></div>
						<div className="h-2 w-[50%] rounded-full skeleton-color"></div>
						<div className="my-2 flex flex-col gap-y-1">
							<div className="h-2 w-full rounded-full skeleton-color"></div>
						</div>
					</div>
				</div>
			);
		}

		return result;
	};

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

	useEffect(() => {
		handleFilterGroupMembers();
	}, [groupStateValue.currentGroup?.members]);

	return (
		<>
			<div className="page-wrapper">
				{!userMounted || firstLoadingGroupMembers ? (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2">
							{renderLoading()}
						</div>
					</>
				) : (
					<>
						{filter && <PageFilter />}
						<div className="gap-x-4 gap-y-4 grid grid-cols-`">
							{filteredGroupMembersLength > 0 && (
								<>
									{filteredGroupMembers.map((member, index) => (
										<React.Fragment key={member.member.userId}>
											<p>{member.user?.uid}</p>
										</React.Fragment>
									))}
								</>
							)}
						</div>
						{loadingGroupMembers && <>{renderLoading()}</>}
						{!endReached &&
							groupMembersMounted &&
							filteredGroupMembersLength > 0 && (
								<VisibleInViewPort
									disabled={
										endReached || loadingGroupMembers || firstLoadingGroupMembers
									}
									onVisible={handleFetchGroupMembers}
								></VisibleInViewPort>
							)}
						{endReached && <PageEnd message="End of Members" />}
					</>
				)}
			</div>
		</>
	);
};

export default MembersFilter;
