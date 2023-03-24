import CreateAccountForm from "@/components/Form/Auth/CreateAccountForm";
import CreateAccountSkeleton from "@/components/Skeleton/Auth/CreateAccountSkeleton";
import LoadingScreen from "@/components/Skeleton/LoadingScreen";
import { clientAuth } from "@/firebase/clientApp";
import useCheck from "@/hooks/useCheck";
import useUser from "@/hooks/useUser";
import { isSignInWithEmailLink } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type CreateAccountPageProps = {};

/**
 * This is the type for the create account form.
 *
 * @typedef {Object} CreateAccountType - The type for the create account form.
 *
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 * @property {string} repeatPassword - The repeated password of the user.
 */
export type CreateAccountType = {
	email: string;
	password: string;
	repeatPassword: string;
};

const CreateAccountPage: React.FC<CreateAccountPageProps> = () => {
	const { authUser, authLoading, loadingUser, createAccount, userStateValue } =
		useUser();
	const { checkUserEmailExists } = useCheck();
	const [checkingUserEmail, setCheckingUserEmail] = useState(true);
	const [loadingCreateAccount, setLoadingCreateAccount] = useState(true);
	const [createAccountForm, setCreateAccountForm] = useState<CreateAccountType>(
		{
			email: "",
			password: "",
			repeatPassword: "",
		}
	);
	const router = useRouter();
	const initializeCreateAccount = async (email: string) => {
		setCreateAccountForm((prev) => ({
			...prev,
			email: email,
		}));
	};

	const loadPage = async () => {
		setLoadingCreateAccount(false);
		setCheckingUserEmail(true);

		const params = new URLSearchParams(window.location.search);
		const email =
			(localStorage.getItem("emailForSignIn") as string) || params.get("email");

		if (isSignInWithEmailLink(clientAuth, window.location.href) && email) {
			const emailExists = await checkUserEmailExists(email);

			if (!emailExists) {
				await initializeCreateAccount(email);
				setLoadingCreateAccount(false);
				setCheckingUserEmail(false);
			}

			return !emailExists;
		} else {
			return false;
		}
	};

	useEffect(() => {
		loadPage().then((initializationStatus) => {
			if (!initializationStatus) {
				router.push("/auth/signin");
			}
		});
	}, []);

	useEffect(() => {
		if (
			authUser &&
			!authLoading &&
			!userStateValue.user.isFirstLogin &&
			!loadingUser
		) {
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
			{!loadingCreateAccount ? (
				<div className="grid place-items-center h-full relative px-8 py-16">
					{!checkingUserEmail ? (
						<CreateAccountForm
							createAccountForm={createAccountForm}
							setCreateAccountForm={setCreateAccountForm}
							createAccount={createAccount}
						/>
					) : (
						<CreateAccountSkeleton />
					)}
				</div>
			) : (
				<LoadingScreen />
			)}
		</>
	);
};

export default CreateAccountPage;
