import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import useUser from "@/hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";

type GroupsPageProps = {};

const GroupsPage: React.FC<GroupsPageProps> = () => {
	const { userStateValue, userMounted } = useUser();
	const groupsMounted = useRef(false);
	const router = useRouter();

	useEffect(() => {
		if (userMounted) {
			if (!groupsMounted.current) {
				groupsMounted.current = true;
				console.log("GroupsPage: Mounted");
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
					<p>GroupsPage</p>
				</LimitedBodyLayout>
			</main>
		</>
	);
};

export default GroupsPage;
