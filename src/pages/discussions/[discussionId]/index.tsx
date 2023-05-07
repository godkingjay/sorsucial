import { DiscussionData, DiscussionState } from "@/atoms/discussionAtom";
import DiscussionCard from "@/components/Discussion/DiscussionCard";
import SingleDiscussionView from "@/components/Discussion/SingleDiscussionView";
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
	return (
		<>
			<LimitedBodyLayout>
				<SingleDiscussionView
					discussionPageData={discussionPageData}
					loadingDiscussion={loadingPage}
					type="discussion"
				/>
			</LimitedBodyLayout>
		</>
	);
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const { usersCollection } = await userDb();
		const { discussionsCollection } = await discussionDb();
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
