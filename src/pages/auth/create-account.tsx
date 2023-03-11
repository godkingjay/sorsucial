import CreateAccountForm from "@/components/Form/Auth/CreateAccountForm";
import CreateAccountSkeleton from "@/components/Skeleton/Auth/CreateAccountSkeleton";
import { auth } from "@/firebase/clientApp";
import useUser from "@/hooks/useUser";
import { isSignInWithEmailLink } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type CreateAccountPageProps = {};

export type CreateAccountType = {
	email: string;
	password: string;
	repeatPassword: string;
};

const CreateAccountPage: React.FC<CreateAccountPageProps> = () => {
	const { authUser, authLoading, createUser } = useUser();
	const [loadingCreateAccount, setLoadingCreateAccount] = useState(false);
	const [createAccount, setCreateAccount] = useState<CreateAccountType>({
		email: "",
		password: "",
		repeatPassword: "",
	});

	const router = useRouter();

	const initializeCreateAccount = async () => {
		setCreateAccount((prev) => ({
			...prev,
			email: localStorage.getItem("emailForSignIn") as string,
		}));
	};

	useEffect(() => {
		setLoadingCreateAccount(false);
		if (
			isSignInWithEmailLink(auth, window.location.href) &&
			(localStorage.getItem("emailForSignIn") as string)
		) {
			initializeCreateAccount();
			setLoadingCreateAccount(false);
		} else {
			router.push("/auth/signin");
		}
	}, [router]);

	useEffect(() => {
		if (authUser && !authLoading) {
			router.push("/");
		}
	}, [authUser, authLoading]);

	return (
		<>
			<Head>
				<title>SorSUcial | Create Account</title>
				<meta
					name="description"
					content="SorSUcial is the unofficial social media for the University of Sorsogon State University."
				/>
			</Head>
			<div className="grid place-items-center h-full relative px-8 py-16">
				{!loadingCreateAccount ? (
					<CreateAccountForm
						createAccount={createAccount}
						setCreateAccount={setCreateAccount}
						createUser={createUser}
					/>
				) : (
					<CreateAccountSkeleton />
				)}
			</div>
		</>
	);
};

export default CreateAccountPage;
