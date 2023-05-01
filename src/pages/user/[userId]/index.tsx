import { UserState } from "@/atoms/userAtom";
import UserIcon from "@/components/Icons/UserIcon";
import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import LoadingScreen from "@/components/Skeleton/LoadingScreen";
import useUser from "@/hooks/useUser";
import clientPromise from "@/lib/mongodb";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
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
						: `${userStateValue.userPage.user.firstName} ${userStateValue.userPage.user.lastName} | Profile`}
				</title>
			</Head>
			<main className="h-full px-4 py-4">
				<LimitedBodyLayout>
					{loadingPage ? (
						<LoadingScreen />
					) : !userStateValue.userPage ? (
						<div>User Not Found</div>
					) : (
						<div className="flex flex-col gap-y-2 py-2">
							<div className="flex flex-col shadow-page-box-1 p-4 rounded-lg bg-white">
								<div className="bg-gray-100 aspect-[2/1] rounded-lg overflow-hidden relative">
									{userStateValue.userPage.user.coverImageURL ? (
										<Image
											src={userStateValue.userPage.user.coverImageURL}
											alt="User Cover Image"
											className="w-full bg-center object-cover"
											sizes="(min-width: 1200px) 900px, (min-width: 768px) 700px, 100vw"
											fill
										/>
									) : (
										<div>Add Image</div>
									)}
								</div>
								<div className="flex flex-col">
									<div className="flex flex-row h-16 xs:h-20 sm:h-28 gap-x-4">
										<div className="border-2 border-white bg-white flex flex-row h-20 w-20 duration-100 xs:h-28 xs:w-28 sm:h-36 sm:w-36 -translate-y-4 xs:-translate-y-8 aspect-square rounded-full overflow-hidden">
											{userStateValue.userPage.user.imageURL ? (
												<Image
													src={userStateValue.userPage.user.imageURL}
													alt="User Profile Image"
													className="w-full bg-center object-cover"
													sizes="(min-width: 1200px) 900px, (min-width: 768px) 700px, 100vw"
													fill
												/>
											) : (
												<FaUserCircle className="h-full w-full text-gray-200" />
											)}
										</div>
										<div className="flex flex-col mt-1 xs:mt-2">
											<h1 className="xs:text-lg sm:text-xl md:text-3xl font-bold">
												{userStateValue.userPage.user.firstName}{" "}
												{userStateValue.userPage.user.lastName}
											</h1>
										</div>
									</div>
								</div>
							</div>
							<p>Body</p>
						</div>
					)}
				</LimitedBodyLayout>
			</main>
		</>
	);
};

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

export default UserProfilePage;
