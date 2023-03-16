import CreateAccountForm from "@/components/Form/Auth/CreateAccountForm";
import CreateAccountSkeleton from "@/components/Skeleton/Auth/CreateAccountSkeleton";
import { auth } from "@/firebase/clientApp";
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
	/**
	 * Hooks for the create account page.
	 *
	 * @property {Object} authUser - The user object from the auth state.
	 * @property {boolean} authLoading - The loading state of the auth state.
	 * @property {Function} createAccount - The function to create an account.
	 */
	const { authUser, authLoading, createAccount } = useUser();

	/**
	 * State for the create account page.
	 *
	 * @property {boolean} loadingCreateAccount - The loading state of the create account page.
	 */
	const [loadingCreateAccount, setLoadingCreateAccount] = useState(false);

	/**
	 * State for the create account form.
	 * The state is initialized with an empty object.
	 * The state changes when the user types in the input fields.
	 *
	 * @property {Object} createAccountForm - The state for the create account form.
	 * @property {Function} setCreateAccountForm - The function to set the state of the create account form.
	 *
	 * @see {@link CreateAccountType} for the type of the create account form.
	 */
	const [createAccountForm, setCreateAccountForm] = useState<CreateAccountType>(
		{
			email: "",
			password: "",
			repeatPassword: "",
		}
	);

	/**
	 * Router for the create account page.
	 * The router is used to redirect the user to the home page if the user is already logged in.
	 */
	const router = useRouter();

	/**
	 * This function initializes the create account form.
	 */
	const initializeCreateAccount = async () => {
		setCreateAccountForm((prev) => ({
			...prev,
			email: localStorage.getItem("emailForSignIn") as string,
		}));
	};

	/**
	 * This effect initializes the create account form.
	 * Changes the state of the create account page to loading.
	 *
	 * @see {@link initializeCreateAccount} for the function that initializes the create account form.
	 * @listens {Object} router - The router object.
	 */
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

	/**
	 * This effect redirects the user to the home page if the user is already logged in.
	 *
	 * @see {@link authUser} for the user object from the auth state.
	 * @see {@link authLoading} for the loading state of the auth state.
	 */
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
						createAccountForm={createAccountForm}
						setCreateAccountForm={setCreateAccountForm}
						createAccount={createAccount}
					/>
				) : (
					<CreateAccountSkeleton />
				)}
			</div>
		</>
	);
};

export default CreateAccountPage;
