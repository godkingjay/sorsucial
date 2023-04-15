import DiscussionCreationListener from "@/components/Discussion/DiscussionCreationListener";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import useDiscussion from "@/hooks/useDiscussion";
import useUser from "@/hooks/useUser";
import Head from "next/head";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

type DiscussionsPageProps = {};

const DiscussionsPage: React.FC<DiscussionsPageProps> = () => {
	const router = useRouter();
	const { userMounted, userStateValue } = useUser();
	const { discussionStateValue, fetchDiscussions } = useDiscussion();
	const [firstLoadingDiscussions, setFirstLoadingDiscussions] = useState(false);
	const [loadingDiscussions, setLoadingDiscussions] = useState(false);
	const [endReached, setEndReached] = useState(false);
	const discussionDiscussionsLength = discussionStateValue.discussions.filter(
		(allDiscussion) => allDiscussion.discussion.discussionType === "discussion"
	).length;
	const discussionsMounted = useRef(false);

	const handleFetchDiscussions = useCallback(async () => {
		setLoadingDiscussions(true);
		try {
			const fetchedDiscussionLength = await fetchDiscussions("discussion", "public");
			if (fetchedDiscussionLength !== undefined) {
				setEndReached(fetchedDiscussionLength < 10 ? true : false);
			}
		} catch (error: any) {
			console.log("Hook: fetching discussions Error: ", error.message);
		}
		setLoadingDiscussions(false);
	}, [fetchDiscussions]);

	const handleFirstFetchDiscussions = useCallback(async () => {
		setFirstLoadingDiscussions(true);
		try {
			await handleFetchDiscussions();
		} catch (error: any) {
			console.log("First Fetch: fetching discussions Error: ", error.message);
		}
		setFirstLoadingDiscussions(false);
	}, []);

	useEffect(() => {
		if (userMounted) {
			if (!discussionsMounted.current && discussionDiscussionsLength === 0) {
				discussionsMounted.current = true;
				handleFirstFetchDiscussions();
			} else {
				discussionsMounted.current = true;
			}
		}
	}, [userMounted]);

	return (
		<>
			<Head>
				<title>Discussions | SorSUcial</title>
			</Head>
			<main className="flex flex-col flex-1 py-4 px-4">
				<LimitedBodyLayout>
					<section className="flex flex-col gap-y-4">
						{firstLoadingDiscussions && !userMounted ? (
							<>
								<p>Loading</p>
							</>
						) : (
							<>
								<DiscussionCreationListener
									useStateValue={userStateValue}
									discussionType="discussion"
								/>
							</>
						)}
					</section>
				</LimitedBodyLayout>
			</main>
		</>
	);
};

export default DiscussionsPage;
