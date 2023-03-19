import { UserPageState, UserState } from "@/atoms/userAtom";
import LoadingScreen from "@/components/Skeleton/LoadingScreen";
import { firestore } from "@/firebase/clientApp";
import useUser from "@/hooks/useUser";
import {
	DocumentData,
	DocumentSnapshot,
	collection,
	doc,
	getDoc,
} from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
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
	);
};

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	try {
		const { userId } = context.query;

		const userDoc = await getDoc(doc(firestore, "users", userId as string));

		const userPageData = userDoc.exists()
			? {
					user: JSON.parse(
						safeJsonStringify({
							id: userDoc.id,
							...userDoc.data(),
						})
					),
			  }
			: null;

		return {
			props: {
				userPageData,
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
