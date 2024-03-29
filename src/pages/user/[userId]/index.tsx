import { UserState } from "@/atoms/userAtom";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import PostsFilter from "@/components/Post/PostsFilter";
import UserPageLoader from "@/components/User/UserPageLoader";
import useUser from "@/hooks/useUser";
import userDb from "@/lib/db/userDb";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type UserProfileProps = {
	userPageData: UserState["userPage"];
	loadingPage: boolean;
};

const UserProfilePage: React.FC<UserProfileProps> = ({
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
						<PostsFilter
							postType="feed"
							postCreation={userStateValue.user.uid === userId}
							filter={true}
							privacy="public"
							creatorId={userId}
							sortBy="latest"
							filterOptions={{
								filterType: "posts",
								options: {
									postType: false,
									privacy: false,
									creatorId: false,
									creator: false,
									groupId: false,
									tags: true,
									likes: true,
									comments: true,
									date: true,
								},
							}}
						/>
					)}
				</LimitedBodyLayout>
			</UserPageLoader>
		</>
	);
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const { usersCollection } = await userDb();
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

export default UserProfilePage;
