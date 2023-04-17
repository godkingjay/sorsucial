import { DiscussionData, DiscussionState } from "@/atoms/discussionAtom";
import useDiscussion from "@/hooks/useDiscussion";
import useUser from "@/hooks/useUser";
import discussionDb from "@/lib/db/discussionDb";
import userDb from "@/lib/db/userDb";
import { GetServerSidePropsContext } from "next";
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
				setDiscussionStateValue((prev) => ({
					...prev,
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

	return <div>SingleDiscussionPage</div>;
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
