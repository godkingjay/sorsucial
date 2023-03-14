import ErrorBannerTextSm from "@/components/Banner/ErrorBanner/ErrorBannerTextSm";
import { auth } from "@/firebase/clientApp";
import { authError } from "@/firebase/error";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiLoader } from "react-icons/fi";
import { authForm } from "../AuthForm";
import { useRouter } from "next/router";

type SignInFormProps = {
	handleFormChange: (form: authForm) => void;
};

const SignInRegex = {
	email: /^[a-zA-Z0-9._-]*@sorsu.edu.ph$/,
};

const SignInForm: React.FC<SignInFormProps> = ({ handleFormChange }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [signInForm, setSignInForm] = useState({
		email: "",
		password: "",
	});
	const [signInError, setSignInError] = useState<string>("");
	const [signingIn, setSigningIn] = useState(false);
	const [validEmail, setValidEmail] = useState(true);
	const router = useRouter();

	const handleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSignInError("");
		if (e.target.name === "email") {
			setValidEmail(() =>
				e.target.value.match(SignInRegex.email) ? true : false
			);
		}
		setSignInForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (SignInRegex.email.test(signInForm.email)) {
			setValidEmail(true);
		} else {
			setValidEmail(false);
			return;
		}
		if (validEmail && signInForm.password && !signInError) {
			setSigningIn(true);
			try {
				await signInWithEmailAndPassword(
					auth,
					signInForm.email,
					signInForm.password
				).catch((error) => {
					throw error;
				});

				router.push("/");
			} catch (error: any) {
				console.log("SignIn Error!");
				setSignInError(error.message);
			}
			setSigningIn(false);
		}
	};

	return (
		<form
			className="auth-form"
			onSubmit={handleSubmit}
		>
			<h2 className="font-bold w-full text-center text-2xl text-logo-400 py-4 uppercase">
				Sign In
			</h2>
			<div className="divider"></div>
			<div className="w-full flex flex-col p-4 gap-y-6 h-full">
				<div className="flex flex-col flex-1 gap-y-6">
					<div className="w-full flex flex-col gap-y-4 z-10 py-4">
						<div className="w-full flex flex-col relative z-10 gap-y-2">
							<div
								className={`auth-input-container
								${signInForm.email ? "auth-input-container-filled" : ""}
								${
									validEmail && signInForm.email
										? " !border-green-500"
										: " !border-red-500 text-red-500"
								}
								`}
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
								} px-4 duration-100 text-xs text-white rounded-md bg-red-500 w-full flex flex-col justify-center overflow-hidden origin-top`}
							>
								<p>Please input a school provided email address.</p>
							</div>
						</div>
						<div className="w-full -z-10">
							<div
								className={`auth-input-container ${
									signInForm.password ? "auth-input-container-filled" : ""
								}`}
							>
								<div className="auth-input-text required-field">
									<label
										htmlFor="password"
										className="label"
									>
										PASSWORD
									</label>
									<input
										required
										type={showPassword ? "text" : "password"}
										name="password"
										title="Password"
										className="input-field"
										onChange={handleInputChange}
										minLength={8}
										maxLength={256}
									/>
								</div>
								<button
									type="button"
									title={showPassword ? "Hide Password" : "Show Password"}
									className="aspect-square h-5 w-5 text-gray-500 text-opacity-50 hover:text-logo-300 focus:text-logo-300"
									onClick={handleShowPassword}
								>
									{showPassword ? (
										<AiFillEye className="h-full w-full" />
									) : (
										<AiFillEyeInvisible className="h-full w-full" />
									)}
								</button>
							</div>
						</div>
						{signInError && (
							<div>
								<ErrorBannerTextSm message={authError[signInError]} />
							</div>
						)}
					</div>
					<div className="w-full">
						<button
							type="submit"
							name="signIn"
							title="SignIn"
							className="page-button bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600"
							disabled={signingIn}
						>
							{!signingIn ? (
								"Sign In"
							) : (
								<FiLoader className="h-6 w-6 text-white animate-spin" />
							)}
						</button>
					</div>
				</div>
				<div className="w-full flex flex-col items-center mt-auto">
					<p className="text-black text-xs">
						No account Yet?{" "}
						<button
							type="button"
							title="Sign Up"
							onClick={() => handleFormChange("signup")}
							className="text-link font-bold"
						>
							Sign Up
						</button>
					</p>
				</div>
			</div>
		</form>
	);
};

export default SignInForm;
