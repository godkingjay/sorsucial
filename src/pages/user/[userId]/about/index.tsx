import { UserState } from "@/atoms/userAtom";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import UserAboutCard from "@/components/User/UserAboutCard";
import UserPageLoader from "@/components/User/UserPageLoader";
import useUser from "@/hooks/useUser";
import clientPromise from "@/lib/mongodb";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type UserPageAboutPageProps = {
	userPageData: UserState["userPage"];
	loadingPage: boolean;
};

const UserPageAboutPage: React.FC<UserPageAboutPageProps> = ({
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
						<>
							<UserAboutCard />
						</>
					)}
				</LimitedBodyLayout>
			</UserPageLoader>
		</>
	);
};

export default UserPageAboutPage;

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
