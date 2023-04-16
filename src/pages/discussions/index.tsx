import DiscussionCreationListener from "@/components/Discussion/DiscussionCreationListener";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import useDiscussion from "@/hooks/useDiscussion";
import useUser from "@/hooks/useUser";
import Head from "next/head";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import VisibleInViewPort from "@/components/Events/VisibleInViewPort";
import { TbArrowBigDown, TbArrowBigUp, TbArrowBigUpFilled } from "react-icons/tb";
import DiscussionCard from "@/components/Discussion/DiscussionCard";

type DiscussionsPageProps = {};

const DiscussionsPage: React.FC<DiscussionsPageProps> = () => {
	const router = useRouter();
	const { userMounted, userStateValue } = useUser();
	const {
		discussionStateValue,
		discussionOptionsStateValue,
		setDiscussionOptionsStateValue,
		fetchDiscussions,
	} = useDiscussion();
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
			const fetchedDiscussionLength = await fetchDiscussions(
				"discussion",
				"public",
				true
			);
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
								{discussionStateValue.discussions
									.filter((dis) => dis.discussion.discussionType === "discussion")
									.map((discussion) => (
										<React.Fragment key={discussion.discussion.id}>
											<DiscussionCard
												userStateValue={userStateValue}
												userMounted={userMounted}
												discussionData={discussion}
												discussionOptionsStateValue={discussionOptionsStateValue}
												setDiscussionOptionsStateValue={setDiscussionOptionsStateValue}
												router={router}
											/>
										</React.Fragment>
									))}
								{loadingDiscussions && (
									<>
										<p>Loading Discussions</p>
									</>
								)}
								{!endReached && discussionsMounted && discussionDiscussionsLength > 0 && (
									<VisibleInViewPort
										disabled={endReached || loadingDiscussions || firstLoadingDiscussions}
										onVisible={handleFetchDiscussions}
									></VisibleInViewPort>
								)}
								{endReached && (
									<div className="h-16 flex flex-col items-center justify-center">
										<div className="flex flex-row items-center w-full gap-x-4">
											<div className="flex-1 h-[1px] bg-gray-300"></div>
											<p className="text-gray-400">End of Discussions</p>
											<div className="flex-1 h-[1px] bg-gray-300"></div>
										</div>
									</div>
								)}
							</>
						)}
					</section>
				</LimitedBodyLayout>
			</main>
		</>
	);
};

export default DiscussionsPage;
