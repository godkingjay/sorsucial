import { UserState } from "@/atoms/userAtom";
import LoadingScreen from "@/components/Skeleton/LoadingScreen";
import useUser from "@/hooks/useUser";
import clientPromise from "@/lib/mongodb";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
import safeJsonStringify from "safe-json-stringify";

type UserProfileProps = {
	userPageData: UserState["userPage"];
	loadingPage: boolean;
};

const UserProfilePage: React.FC<UserProfileProps> = ({
	userPageData,
	loadingPage = true,
}) => {
	const { userStateValue, setUserStateValue } = useUser();

	useEffect(() => {
		if (userPageData) {
			setUserStateValue((prev) => ({
				...prev,
				userPage: userPageData,
			}));
		}
	}, [userPageData]);

	return (
		<>
			<Head>
				<title>
					{loadingPage
						? "Loading..."
						: !userStateValue.userPage
						? "User not Found!"
						: `${userStateValue.userPage.user.firstName} ${userStateValue.userPage.user.lastName}} | Profile`}
				</title>
			</Head>
			<main className="h-full">
				{loadingPage ? (
					<LoadingScreen />
				) : !userStateValue.userPage ? (
					<div>User Not Found</div>
				) : (
					<div>
						<p>{userStateValue.userPage.user.firstName}</p>
					</div>
				)}
			</main>
		</>
	);
};

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	try {
		const client = await clientPromise;
		const db = client.db();
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

export default UserProfilePage;
