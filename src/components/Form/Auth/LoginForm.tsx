import ErrorBannerTextSm from "@/components/Banner/ErrorBanner/ErrorBannerTextSm";
import { auth } from "@/firebase/clientApp";
import { authError } from "@/firebase/error";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiLoader } from "react-icons/fi";
import { authForm } from "../AuthForm";

type LoginFormProps = {
	handleFormChange: (form: authForm) => void;
};

const LoginRegex = {
	email: /^[a-zA-Z0-9._-]*@sorsu.edu.ph$/,
};

const LoginForm: React.FC<LoginFormProps> = ({ handleFormChange }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [loginForm, setLoginForm] = useState({
		email: "",
		password: "",
	});
	const [loginError, setLoginError] = useState<string>("");
	const [loggingIn, setLoggingIn] = useState(false);
	const [validEmail, setValidEmail] = useState(true);

	const handleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginError("");
		if (e.target.name === "email") {
			setValidEmail(true);
		}
		setLoginForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (LoginRegex.email.test(loginForm.email)) {
			setValidEmail(true);
		} else {
			setValidEmail(false);
			return;
		}
		if (validEmail && loginForm.password && !loginError) {
			setLoggingIn(true);
			try {
				await signInWithEmailAndPassword(
					auth,
					loginForm.email,
					loginForm.password
				).catch((error) => {
					throw error;
				});
			} catch (error: any) {
				console.log("Login Error!");
				setLoginError(error.message);
			}
			setLoggingIn(false);
		}
	};

	return (
		<form
			className="auth-form"
			onSubmit={handleSubmit}
		>
			<h2 className="font-bold w-full text-center text-2xl text-logo-500 py-4 uppercase">
				Login
			</h2>
			<div className="divider"></div>
			<div className="w-full flex flex-col p-4 gap-y-6 h-full">
				<div className="flex flex-col flex-1 gap-y-6">
					<div className="w-full flex flex-col gap-y-4 flex-1 justify-center z-10">
						<div className="w-full flex flex-col relative z-10 gap-y-1">
							<div
								className={`auth-input-container ${
									loginForm.email ? "auth-input-container-filled" : ""
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
						<div className="w-full -z-10">
							<div
								className={`auth-input-container ${
									loginForm.password ? "auth-input-container-filled" : ""
								}`}
							>
								<div className="auth-input-text">
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
									className="aspect-square h-5 w-5 [&:hover_path]:fill-logo-300 [&:focus_path]:fill-logo-300"
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
						{loginError && (
							<div>
								<ErrorBannerTextSm message={authError[loginError]} />
							</div>
						)}
					</div>
					<div className="divider"></div>
					<div className="w-full flex-1">
						<button
							type="submit"
							name="login"
							title="Login"
							className="page-button bg-logo-300 hover:bg-logo-400 hover:border-logo-400 focus:bg-logo-400 focus:border-logo-400"
							disabled={loggingIn}
						>
							{!loggingIn ? (
								"Login"
							) : (
								<FiLoader className="h-6 w-6 text-white animate-spin" />
							)}
						</button>
					</div>
				</div>
				<button
					type="button"
					title="Sign Up"
					className="w-full flex flex-col items-center mt-auto"
					onClick={() => handleFormChange("signup")}
				>
					<p
						tabIndex={0}
						className="text-link"
					>
						No account Yet? Sign Up instead.
					</p>
				</button>
			</div>
		</form>
	);
};

export default LoginForm;
