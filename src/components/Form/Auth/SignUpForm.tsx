import { clientAuth } from "@/firebase/clientApp";
import { authError } from "@/firebase/error";
import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { authForm } from "../AuthForm";
import SorSUcialLogo from "public/assets/logo/sorsucial.svg";
import {
	fetchSignInMethodsForEmail,
	sendSignInLinkToEmail,
} from "firebase/auth";
import Link from "next/link";
import { SignInRegex } from "./SignInForm";
import ErrorBannerTextSm from "@/components/Banner/ErrorBanner/ErrorBannerTextSm";
import { siteDetails } from "@/lib/host";

type SignUpFormProps = {
	handleFormChange: (form: authForm) => void;
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

		const { name, value } = e.target;

		if (name === "email") {
			setValidEmail(true);
		}

		setLoginForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (SignInRegex.email.test(signUpForm.email)) {
			setValidEmail(true);
		} else {
			setValidEmail(false);
			return;
		}

		if (validEmail && !signUpError) {
			setSigningUp(true);
			try {
				const signInMethods = await fetchSignInMethodsForEmail(
					clientAuth,
					signUpForm.email
				);
				if (signInMethods.length > 0) {
					throw new Error(
						authError["Firebase: Error (auth/email-already-in-use)."]
					);
				} else {
					await sendSignInLinkToEmail(clientAuth, signUpForm.email, {
						url:
							siteDetails.host +
							`auth/create-account?email=${signUpForm.email}`,
						handleCodeInApp: true,
					}).catch((error) => {
						throw error;
					});

					localStorage.setItem("emailForSignIn", signUpForm.email);

					setEmailSent(true);
				}
			} catch (error: any) {
				console.log("Sign Up Error!", error.message);
				setSignUpError(error.message);
			}
			setSigningUp(false);
		}
	};

	const handleInputTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
		(
			(e.currentTarget as HTMLInputElement).querySelector(
				"input"
			) as HTMLInputElement
		).focus();
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
				<div className="flex flex-col flex-1 gap-y-4">
					<div className="flex flex-col gap-y-4 text-center items-center">
						<div className="h-20 w-20">
							<SorSUcialLogo className="h-full w-full aspect-square [&_path]:fill-logo-300" />
						</div>
						<div className="flex flex-col gap-y-1">
							<h2 className="font-bold">Create An Account</h2>
							<p className="text-sm">
								Tell us your email address, and we will send you an email to
								create your account.
							</p>
						</div>
					</div>
					{!emailSent ? (
						<>
							<div className="w-full flex flex-col gap-y-2 justify-center z-10 py-4">
								<div className="w-full flex flex-col relative z-10 gap-y-2">
									<div
										className={`auth-input-container ${
											signUpForm.email ? "auth-input-container-filled" : ""
										}`}
										onClick={handleInputTextClick}
									>
										<div className="auth-input-text required-field">
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
									<div
										className={`${
											validEmail ? "h-0 py-0" : "h-max py-4"
										} px-4 absolute top-[110%] right-0 duration-100 text-xs text-white rounded-md bg-red-500 w-full flex flex-col justify-center overflow-hidden origin-top`}
									>
										<p>Please input a school provided email address.</p>
									</div>
								</div>
								{signUpError && (
									<div>
										<ErrorBannerTextSm
											message={authError[signUpError] || signUpError}
										/>
									</div>
								)}
							</div>
							<div className="w-full mt-auto">
								<button
									type="submit"
									name="signup"
									title="Sign Up"
									className="page-button bg-logo-300 hover:bg-logo-400 hover:border-logo-400 focus:bg-logo-400 focus:border-logo-400"
									disabled={signingUp || signUpError ? true : false}
								>
									{!signingUp ? (
										"Sign Up"
									) : (
										<FiLoader className="h-6 w-6 text-white animate-spin" />
									)}
								</button>
							</div>
						</>
					) : (
						<div className="flex flex-col w-full p-[12px] border-2 border-logo-300 border-dashed rounded-md gap-y-2 items-center">
							<div className="h-10 w-10 aspect-square text-logo-300">
								<MdEmail className="w-full h-full" />
							</div>
							<div className="flex-1">
								<p className="break-words text-sm text-center whitespace-normal">
									An email has been sent to your email{" "}
									<Link
										href="https://mail.google.com/mail/u/0/"
										tabIndex={0}
										target="_blank"
										className="text-link text-sm font-bold"
									>
										{signUpForm.email}
									</Link>
								</p>
							</div>
						</div>
					)}
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
