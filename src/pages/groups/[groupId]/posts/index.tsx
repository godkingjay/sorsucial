import { useRouter } from "next/router";
import React, { useEffect } from "react";

type GroupPagePostsPageProps = {};

const GroupPagePostsPage: React.FC<GroupPagePostsPageProps> = () => {
	const router = useRouter();
	const { groupId } = router.query;

	useEffect(() => {
		if (groupId) {
			router.push(`/groups/${groupId}`);
		}
	}, [groupId, router]);

	return <></>;
};

export default GroupPagePostsPage;
