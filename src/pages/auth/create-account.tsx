import CreateAccountForm from "@/components/Form/Auth/CreateAccountForm";
import CreateAccountSkeleton from "@/components/Skeleton/Auth/CreateAccountSkeleton";
import { auth } from "@/firebase/clientApp";
import useUser from "@/hooks/useUser";
import { isSignInWithEmailLink } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import SorSUcialLogo from "public/assets/logo/sorsucial.svg";
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
					<div className="w-full max-w-md flex flex-col bg-white shadow-shadow-around-sm rounded-xl">
						<div className="p-4 bg-logo-300 text-white rounded-t-xl">
							<h1 className="text-center font-bold text-lg">Create Account</h1>
						</div>
						<div className="py-4 flex flex-col gap-y-4">
							<div className="flex flex-col mx-4">
								<div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-100 p-4 rounded-lg">
									<div className="h-16 w-16 aspect-square">
										<SorSUcialLogo className="h-full w-full [&_path]:fill-logo-300" />
									</div>
									<div className="flex flex-col gap-y-2 flex-1">
										<p className="break-words text-center sm:text-left">
											Create an account for{" "}
											<span className="font-bold text-logo-300">
												{createAccount.email}
											</span>
										</p>
									</div>
								</div>
							</div>
							<div className="px-4">
								<div className="divider my-4"></div>
							</div>
							<div className="px-4">
								<CreateAccountForm
									createAccount={createAccount}
									setCreateAccount={setCreateAccount}
									createUser={createUser}
								/>
							</div>
						</div>
					</div>
				) : (
					<CreateAccountSkeleton />
				)}
			</div>
		</>
	);
};

export default CreateAccountPage;
