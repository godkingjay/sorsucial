import { UserState } from "@/atoms/userAtom";
import DiscussionsFilter from "@/components/Discussion/DiscussionsFilter";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import UserPageLoader from "@/components/User/UserPageLoader";
import useUser from "@/hooks/useUser";
import clientPromise from "@/lib/mongodb";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type UserPageDiscussionsPageProps = {
	userPageData: UserState["userPage"];
	loadingPage: boolean;
};

const UserPageDiscussionsPage: React.FC<UserPageDiscussionsPageProps> = ({
	userPageData,
	loadingPage = true,
}) => {
	const { userStateValue } = useUser();
	const router = useRouter();
	const { userId } = router.query;

	return (
		<>
			<UserPageLoader
				userPageData={userPageData}
				loadingUser={loadingPage}
			>
				<LimitedBodyLayout>
					{userStateValue.userPage?.user.uid === userId && (
						<DiscussionsFilter
							discussionType="discussion"
							discussionCreation={userStateValue.user.uid === userId}
							filter={true}
							privacy="public"
							creatorId={userId}
							sortBy="latest"
							filterOptions={{
								filterType: "discussions",
								options: {
									discussionType: false,
									privacy: false,
									isOpen: false,
									creatorId: false,
									creator: false,
									groupId: false,
									tags: false,
									votes: false,
									replies: false,
									date: false,
								},
							}}
						/>
					)}
				</LimitedBodyLayout>
			</UserPageLoader>
		</>
	);
};

export default UserPageDiscussionsPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const usersCollection = db.collection("users");
		const { userId } = context.query;

		const userPageData = {
			user: await usersCollection.findOne({ uid: userId }),
		};

		return {
			props: {
				userPageData: userPageData.user
					? JSON.parse(safeJsonStringify(userPageData))
					: null,
				loadingPage: false,
			},
		};
	} catch (error: any) {
		console.log("USER PAGE: getServerSideProps Error: ", error.message);
		return {
			notFound: true,
		};
	}
};
