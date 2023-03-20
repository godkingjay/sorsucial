import CreateAccountForm from "@/components/Form/Auth/CreateAccountForm";
import CreateAccountSkeleton from "@/components/Skeleton/Auth/CreateAccountSkeleton";
import LoadingScreen from "@/components/Skeleton/LoadingScreen";
import { auth } from "@/firebase/clientApp";
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
	/**
	 * Hooks for the create account page.
	 *
	 * @property {Object} authUser - The user object from the auth state.
	 * @property {boolean} authLoading - The loading state of the auth state.
	 * @property {Function} createAccount - The function to create an account.
	 */
	const { authUser, authLoading, loadingUser, createAccount, userStateValue } =
		useUser();

	/**
	 * Hooks for the create account page.
	 * The hooks are used to check if the user is already logged in.
	 * If the user is already logged in, the user is redirected to the sign in page.
	 */
	const { checkUserEmailExists } = useCheck();

	/**
	 * State for the create account page.
	 * This is used to check if the user email is already taken.
	 * If the user email is already taken, the user is redirected to the sign in page.
	 * The state is initialized with true.
	 */
	const [checkingUserEmail, setCheckingUserEmail] = useState(true);

	/**
	 * State for the create account page.
	 *
	 * @property {boolean} loadingCreateAccount - The loading state of the create account page.
	 */
	const [loadingCreateAccount, setLoadingCreateAccount] = useState(true);

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
	const initializeCreateAccount = async (email: string) => {
		setCreateAccountForm((prev) => ({
			...prev,
			email: email,
		}));
	};

	/**
	 * This function checks if the user email is already taken.
	 * If the user email is already taken, the user is redirected to the sign in page.
	 *
	 * @return {*}
	 */
	const loadPage = async () => {
		setLoadingCreateAccount(false);
		setCheckingUserEmail(true);

		const params = new URLSearchParams(window.location.search);
		const email =
			(localStorage.getItem("emailForSignIn") as string) || params.get("email");

		if (isSignInWithEmailLink(auth, window.location.href) && email) {
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

	/**
	 * This effect redirects the user to the sign in page if the user does not have email in store or email provided is already taken.
	 * The effect is only called once when the page is loaded.
	 */
	useEffect(() => {
		loadPage().then((initializationStatus) => {
			if (!initializationStatus) {
				router.push("/auth/signin");
			}
		});
	}, []);

	/**
	 * This effect redirects the user to the home page if the user is already logged in.
	 *
	 * @see {@link authUser} for the user object from the auth state.
	 * @see {@link authLoading} for the loading state of the auth state.
	 */
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
