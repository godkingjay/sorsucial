import CreateUserForm from "@/components/Form/Auth/CreateUser/CreateUserForm";
import LoadingScreen from "@/components/Skeleton/LoadingScreen";
import useUser from "@/hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

type CreateUserPageProps = {};

const CreateUserPage: React.FC<CreateUserPageProps> = () => {
	const { authUser, loadingUser, authLoading, userStateValue, userMounted } =
		useUser();
	const router = useRouter();

	useEffect(() => {
		if (
			userMounted &&
			!userStateValue.user.isFirstLogin &&
			!authLoading &&
			!loadingUser
		) {
			router.push("/");
		}
	}, [userMounted, userStateValue.user.isFirstLogin, authLoading, loadingUser]);

	if (
		loadingUser ||
		authLoading ||
		!authUser ||
		!userStateValue.user.isFirstLogin ||
		!userMounted
	) {
		return <LoadingScreen />;
	}

	return (
		<>
			<Head>
				<title>SorSUcial | Create User</title>
				<meta
					name="description"
					content="SorSUcial is the unofficial social media for the University of Sorsogon State University."
				/>
			</Head>
			<div className="flex flex-col items-center relative px-8 py-16 min-h-[100dvh]">
				<CreateUserForm />
			</div>
		</>
	);
};

export default CreateUserPage;
