import { UserState } from "@/atoms/userAtom";
import UserPageLoader from "@/components/User/UserPageLoader";
import clientPromise from "@/lib/mongodb";
import { GetServerSidePropsContext } from "next";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type UserPageGalleryPageProps = {
	userPageData: UserState["userPage"];
	loadingPage: boolean;
};

const UserPageGalleryPage: React.FC<UserPageGalleryPageProps> = ({
	userPageData,
	loadingPage = true,
}) => {
	return (
		<>
			<UserPageLoader
				userPageData={userPageData}
				loadingUser={loadingPage}
			>
				<div>User Gallery Page</div>
			</UserPageLoader>
		</>
	);
};

export default UserPageGalleryPage;

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
