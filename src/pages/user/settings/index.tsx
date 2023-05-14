import { UserState } from "@/atoms/userAtom";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import UserSettingsPageLoader from "@/components/User/UserSettingsPageLoader";
import useUser from "@/hooks/useUser";
import userDb from "@/lib/db/userDb";
import { GetServerSidePropsContext } from "next";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type UserSettingsProfilePageProps = {
	userData: UserState["userPage"];
	loadingPage: boolean;
};

const UserSettingsProfilePage: React.FC<UserSettingsProfilePageProps> = ({
	userData,
	loadingPage = true,
}) => {
	const { userStateValue, authUser } = useUser();

	return (
		<>
			<UserSettingsPageLoader
				userData={userData}
				loadingUser={loadingPage}
			>
				{userStateValue.user.uid === authUser?.uid && (
					<>
						<LimitedBodyLayout>
							<div className="page-wrapper">
								<div className="flex flex-col gap-y-4">
									<div className="shadow-page-box-1 page-box-1">
										<h1>Profile Information</h1>
									</div>
								</div>
							</div>
						</LimitedBodyLayout>
					</>
				)}
			</UserSettingsPageLoader>
		</>
	);
};

export default UserSettingsProfilePage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const { usersCollection } = await userDb();
		const { userId } = context.query;

		const userData = {
			user: await usersCollection.findOne({ uid: userId }),
		};

		return {
			props: {
				userData: userData.user ? JSON.parse(safeJsonStringify(userData)) : null,
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
