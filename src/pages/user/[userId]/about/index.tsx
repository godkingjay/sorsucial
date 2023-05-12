import { UserState } from "@/atoms/userAtom";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import UserPageLoader from "@/components/User/UserPageLoader";
import clientPromise from "@/lib/mongodb";
import { GetServerSidePropsContext } from "next";
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
	return (
		<>
			<UserPageLoader
				userPageData={userPageData}
				loadingUser={loadingPage}
			>
				<LimitedBodyLayout>
					<div>User About Page</div>
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
