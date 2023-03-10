import ErrorBannerTextSm from "@/components/Banner/ErrorBanner/ErrorBannerTextSm";
import { auth } from "@/firebase/clientApp";
import { authError } from "@/firebase/error";
import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { authForm } from "../AuthForm";
import SorSUcialLogo from "public/assets/logo/sorsucial.svg";
import {
	fetchSignInMethodsForEmail,
	sendSignInLinkToEmail,
} from "firebase/auth";

type SignUpFormProps = {
	handleFormChange: (form: authForm) => void;
};

const SignUpRegex = {
	email: /^[a-zA-Z0-9._-]*@sorsu.edu.ph$/,
};

const SignUpForm: React.FC<SignUpFormProps> = ({ handleFormChange }) => {
	const [signUpForm, setLoginForm] = useState({
		email: "",
	});
	const [signUpError, setSignUpError] = useState<string>("");
	const [signingUp, setSigningUp] = useState(false);
	const [validEmail, setValidEmail] = useState(true);
	const [emailSent, setEmailSent] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSignUpError("");
		if (e.target.name === "email") {
			setValidEmail(true);
		}
		setLoginForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	/**
	 * This is a TypeScript code snippet for a React component that handles the form submission for creating a new user account.
	 * It uses Firebase Authentication to check if the user's email address is already in use and sends a sign-in link to the email address if it is not.
	 *
	 * @param {React.FormEvent<HTMLFormElement>} e
	 * @return {*}
	 */
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		/**
		 * Checks if the email address is valid using a regular expression (SignUpRegex.email.test(signUpForm.email)).
		 *
		 * @see {@link SignUpRegex}
		 */
		if (SignUpRegex.email.test(signUpForm.email)) {
			setValidEmail(true);
		} else {
			setValidEmail(false);
			return;
		}

		if (validEmail && !signUpError) {
			setSigningUp(true);
			try {
				/**
				 * The fetchSignInMethodsForEmail function from Firebase Authentication checks if the email address is already associated with an existing account.
				 * If there are sign-in methods associated with the email address, it throws an error indicating that the email address is already in use.
				 * Else if there's none, then it will send a sign-in link to the email address.
				 *
				 * @see {@link signUpForm}
				 */
				const signInMethods = await fetchSignInMethodsForEmail(
					auth,
					signUpForm.email
				);
				if (signInMethods.length > 0) {
					throw new Error(authError.emailAlreadyInUse);
				} else {
					/**
					 * The sendSignInLinkToEmail function from Firebase Authentication sends a sign-in link to the email address.
					 * The url parameter is the link that the user will be redirected to after clicking the sign-in link.
					 * The handleCodeInApp parameter is set to true to indicate that the sign-in link will be handled by the app.
					 * The catch block handles any errors thrown by the sendSignInLinkToEmail function.
					 */
					await sendSignInLinkToEmail(auth, signUpForm.email, {
						url:
							(process.env.NEXT_PUBLIC_HOST as string) +
							`/auth/create-account?email=${signUpForm.email}`,
						handleCodeInApp: true,
					}).catch((error) => {
						throw error;
					});

					/**
					 * The localStorage.setItem function stores the email address in the browser's local storage.
					 * The email address is stored in the emailForSignIn key.
					 */
					localStorage.setItem("emailForSignIn", signUpForm.email);

					/**
					 * The setEmailSent function sets the emailSent state to true to indicate that the sign-in link has been sent to the email address.
					 */
					setEmailSent(true);
				}
			} catch (error: any) {
				console.log("Sign Up Error!");
				setSignUpError(error.message);
			}
			setSigningUp(false);
		}
	};

	return (
		<form
			className="auth-form"
			onSubmit={handleSubmit}
		>
			<h2 className="font-bold w-full text-center text-2xl text-logo-400 py-4 uppercase">
				Sign Up
			</h2>
			<div className="divider"></div>
			<div className="w-full flex flex-col p-4 gap-y-6 h-full overflow-y-auto scroll-y-style">
				<div className="flex flex-col flex-1 gap-y-6">
					<div className="flex flex-col gap-y-4 text-center items-center">
						<div className="h-20 w-20">
							<SorSUcialLogo className="h-full w-full aspect-square [&_*]:fill-logo-300" />
						</div>
						<div className="flex flex-col gap-y-1">
							<h2 className="font-bold">Create An Account</h2>
							<p className="text-sm">
								Tell us your email address, and we will send you an email to
								create your account.
							</p>
						</div>
					</div>
					<div className="w-full flex flex-col gap-y-4 justify-center z-10 py-4">
						<div className="w-full flex flex-col relative z-10 gap-y-1">
							<div
								className={`auth-input-container ${
									signUpForm.email ? "auth-input-container-filled" : ""
								}`}
							>
								<div className="auth-input-text">
									<label
										htmlFor="email"
										className="label"
									>
										EMAIL
									</label>
									<input
										required
										type="email"
										name="email"
										title="Email"
										className="input-field"
										onChange={handleInputChange}
									/>
								</div>
							</div>
							{!validEmail && (
								<div className="text-xs text-white rounded-md bg-red-500 w-full flex flex-col justify-center right-0 top-[105%] p-2">
									<p>Please input a school provided email address.</p>
								</div>
							)}
						</div>

						{signUpError && (
							<div>
								<ErrorBannerTextSm
									message={authError[signUpError] || signUpError}
								/>
							</div>
						)}
					</div>
					<div className="w-full">
						<button
							type="submit"
							name="signup"
							title="Sign Up"
							className="page-button bg-logo-300 hover:bg-logo-400 hover:border-logo-400 focus:bg-logo-400 focus:border-logo-400"
							disabled={signingUp}
						>
							{!signingUp ? (
								"Sign Up"
							) : (
								<FiLoader className="h-6 w-6 text-white animate-spin" />
							)}
						</button>
					</div>
				</div>
				<div className="w-full flex flex-col items-center mt-auto">
					<p className="text-black text-xs">
						Already have an account?{" "}
						<button
							type="button"
							title="Sign In"
							onClick={() => handleFormChange("login")}
							className="text-link font-bold"
						>
							Sign In
						</button>
					</p>
				</div>
			</div>
		</form>
	);
};

export default SignUpForm;
