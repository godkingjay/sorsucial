import { DiscussionState } from "@/atoms/discussionAtom";
import React, { useEffect, useState } from "react";
import PostDiscussionNotFound, {
	PostDiscussionNotFoundProps,
} from "../Error/PostDiscussionNotFound";
import useUser from "@/hooks/useUser";
import useDiscussion from "@/hooks/useDiscussion";
import { useRouter } from "next/router";
import LimitedBodyLayout from "../Layout/LimitedBodyLayout";
import DiscussionCardSkeleton from "../Skeleton/Discussion/DiscussionCardSkeleton";
import DiscussionCard from "./DiscussionCard";
import Head from "next/head";
import { siteDetails } from "@/lib/host";

type SingleDiscussionViewProps = {
	discussionPageData: DiscussionState["currentDiscussion"];
	loadingDiscussion: boolean;
	type: PostDiscussionNotFoundProps["type"];
};

const SingleDiscussionView: React.FC<SingleDiscussionViewProps> = ({
	discussionPageData,
	loadingDiscussion,
	type,
}) => {
	const { userMounted } = useUser();

	const { discussionStateValue, setDiscussionStateValue, fetchUserVote } =
		useDiscussion();

	const [fetchingDiscussionUserData, setFetchingDiscussionUserData] =
		useState(true);

	const router = useRouter();

	const { discussionId } = router.query;

	const fetchDiscussionUserData = async () => {
		setFetchingDiscussionUserData(true);
		try {
			if (discussionPageData) {
				const userVoteData = await fetchUserVote(discussionPageData.discussion);

				const currentDiscussion = discussionStateValue.discussions.find(
					(discussion) =>
						discussion.discussion.id === discussionPageData.discussion.id
				);

				setDiscussionStateValue((prev) => ({
					...prev,
					discussions: currentDiscussion
						? prev.discussions.map((discussion) => {
								if (
									discussion.discussion.id !== currentDiscussion.discussion.id
								) {
									return discussion;
								}

								return {
									...discussion,
									...discussionPageData,
									userVote: userVoteData,
								};
						  })
						: prev.discussions,
					currentDiscussion: {
						...discussionPageData,
						userVote: userVoteData,
						discussionReplies: [],
					},
				}));
			}
		} catch (error: any) {
			console.log("fetchDiscussionUserData: error: ", error.message);
		}
		setFetchingDiscussionUserData(false);
	};

	useEffect(() => {
		if (userMounted) {
			fetchDiscussionUserData();
		}
	}, [userMounted]);

	return (
		<>
			<Head>
				<title>
					{loadingDiscussion || fetchingDiscussionUserData
						? "Loading Discussion"
						: discussionStateValue.currentDiscussion === null
						? "Discussion Not Found"
						: discussionStateValue.currentDiscussion.discussion
								.discussionTitle}{" "}
					| SorSUcial
				</title>
				<meta
					name="title"
					property="og:title"
					content={
						discussionStateValue.currentDiscussion?.discussion.discussionTitle ||
						""
					}
				/>
				<meta
					name="type"
					property="og:type"
					content="article"
				/>
				<meta
					name="description"
					property="og:description"
					content={
						discussionStateValue.currentDiscussion?.discussion.discussionBody?.slice(
							0,
							512
						) || ""
					}
				/>
				<meta
					name="description"
					property="description"
					content={
						discussionStateValue.currentDiscussion?.discussion.discussionBody?.slice(
							0,
							512
						) || ""
					}
				/>
				<meta
					name="url"
					property="og:url"
					content={siteDetails.host + `/${router.asPath.slice(1)}`}
				/>
				<meta
					name="updated_time"
					property="og:updated_time"
					content={
						discussionStateValue.currentDiscussion?.discussion.updatedAt?.toString() ||
						new Date().toString()
					}
				/>
			</Head>
			<main className="flex flex-col flex-1 py-4 px-4">
				<LimitedBodyLayout>
					<section className="flex flex-col gap-y-4">
						{loadingDiscussion || fetchingDiscussionUserData || !userMounted ? (
							<>
								<DiscussionCardSkeleton />
							</>
						) : (
							<>
								{!discussionStateValue.currentDiscussion ? (
									<PostDiscussionNotFound type={type} />
								) : (
									<>
										{discussionStateValue.currentDiscussion.discussion.id ===
											discussionId && (
											<DiscussionCard
												discussionData={discussionStateValue.currentDiscussion}
											/>
										)}
									</>
								)}
							</>
						)}
					</section>
				</LimitedBodyLayout>
			</main>
		</>
	);
};

export default SingleDiscussionView;
