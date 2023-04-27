import GroupCreationListener from "@/components/Group/GroupCreationListener";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import useGroup from "@/hooks/useGroup";
import useUser from "@/hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";

type GroupsPageProps = {};

const GroupsPage: React.FC<GroupsPageProps> = () => {
	const { userStateValue, userMounted } = useUser();
	const { groupStateValue, fetchGroups } = useGroup();
	const [loadingGroups, setLoadingGroups] = useState(false);
	const [firstLoadingGroups, setFirstLoadingGroups] = useState(false);
	const [endReached, setEndReached] = useState(false);
	const groupsMounted = useRef(false);
	const router = useRouter();

	const handleFetchGroups = useCallback(async () => {
		setLoadingGroups(true);
		try {
			const fetchedGroupLength = await fetchGroups("public");
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
			<Head>
				<title>Groups | SorSUcial</title>
			</Head>
			<main className="flex flex-col flex-1 p-4">
				<LimitedBodyLayout>
					<section className="flex flex-col gap-y-4">
						{!userMounted ? (
							<>
								<p>Loading</p>
							</>
						) : (
							<>
								<GroupCreationListener />
							</>
						)}
					</section>
				</LimitedBodyLayout>
			</main>
		</>
	);
};

export default GroupsPage;
