import { DiscussionData, DiscussionState } from "@/atoms/discussionAtom";
import DiscussionCard from "@/components/Discussion/DiscussionCard";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import DiscussionCardSkeleton from "@/components/Skeleton/Discussion/DiscussionCardSkeleton";
import useDiscussion from "@/hooks/useDiscussion";
import useUser from "@/hooks/useUser";
import discussionDb from "@/lib/db/discussionDb";
import userDb from "@/lib/db/userDb";
import { siteDetails } from "@/lib/host";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import safeJsonStringify from "safe-json-stringify";

type SingleDiscussionPageProps = {
	discussionPageData: DiscussionState["currentDiscussion"];
	loadingPage: boolean;
};

const SingleDiscussionPage: React.FC<SingleDiscussionPageProps> = ({
	discussionPageData,
	loadingPage = true,
}) => {
	const { userStateValue, userMounted } = useUser();
	const {
		discussionStateValue,
		setDiscussionStateValue,
		discussionOptionsStateValue,
		setDiscussionOptionsStateValue,
		deleteDiscussion,
		onDiscussionVote,
		fetchUserVote,
	} = useDiscussion();
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
									discussion.discussion.id === currentDiscussion.discussion.id
								) {
									return {
										...discussionPageData,
										userVote: userVoteData,
									};
								} else {
									return discussion;
								}
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
					{loadingPage || fetchingDiscussionUserData
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
						{loadingPage || fetchingDiscussionUserData || !userMounted ? (
							<>
								<DiscussionCardSkeleton />
							</>
						) : (
							<>
								{!discussionStateValue.currentDiscussion ? (
									<div>Not Found</div>
								) : (
									<>
										<DiscussionCard
											userStateValue={userStateValue}
											userMounted={userMounted}
											discussionData={discussionStateValue.currentDiscussion}
											discussionOptionsStateValue={discussionOptionsStateValue}
											setDiscussionOptionsStateValue={
												setDiscussionOptionsStateValue
											}
											deleteDiscussion={deleteDiscussion}
											onDiscussionVote={onDiscussionVote}
											router={router}
										/>
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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const { discussionsCollection } = await discussionDb();
		const { usersCollection } = await userDb();
		const { discussionId } = context.query;

		const discussionPageData: Partial<DiscussionData> = {
			discussion:
				((await discussionsCollection.findOne({
					id: discussionId,
					discussionType: "discussion",
				})) as unknown as DiscussionData["discussion"]) || null,
		};

		if (discussionPageData.discussion !== null) {
			discussionPageData.creator =
				((await usersCollection.findOne({
					uid: discussionPageData.discussion!.creatorId,
				})) as unknown as DiscussionData["creator"]) || null;
		}

		return {
			props: {
				discussionPageData: discussionPageData.discussion
					? JSON.parse(safeJsonStringify(discussionPageData))
					: null,
				loadingPage: false,
			},
		};
	} catch (error: any) {
		return {
			notFound: true,
		};
	}
};

export default SingleDiscussionPage;
