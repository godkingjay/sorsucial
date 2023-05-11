import { UserState } from "@/atoms/userAtom";
import GroupsFilter from "@/components/Group/GroupsFilter";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import UserPageLoader from "@/components/User/UserPageLoader";
import useUser from "@/hooks/useUser";
import clientPromise from "@/lib/mongodb";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type UserPageGroupsPageProps = {
	userPageData: UserState["userPage"];
	loadingPage: boolean;
};

const UserPageGroupsPage: React.FC<UserPageGroupsPageProps> = ({
	userPageData,
	loadingPage = true,
}) => {
	const { userStateValue } = useUser();
	const router = useRouter();
	const { userId } = router.query;

	return (
		<>
			<LimitedBodyLayout>
				<UserPageLoader
					userPageData={userPageData}
					loadingUser={loadingPage}
				>
					{userStateValue.userPage?.user.uid === userId && (
						<GroupsFilter
							groupCreation={userStateValue.user.uid === userId}
							filter={true}
							creatorId={userId}
							sortBy="latest"
							pageEnd="End of Groups"
							filterOptions={{
								filterType: "groups",
								options: {
									creatorId: true,
									creator: true,
									privacy: true,
									tags: true,
									members: true,
									date: true,
									posts: true,
									discussions: true,
								},
							}}
						/>
					)}
				</UserPageLoader>
			</LimitedBodyLayout>
		</>
	);
};

export default UserPageGroupsPage;

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
