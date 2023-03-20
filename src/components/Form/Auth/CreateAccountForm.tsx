import { CreateAccountType } from "@/pages/auth/create-account";
import React, { SetStateAction, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiLoader } from "react-icons/fi";
import SorSUcialLogo from "public/assets/logo/sorsucial.svg";
import { SignInRegex } from "./SignInForm";

type CreateAccountFormProps = {
	createAccountForm: CreateAccountType;
	setCreateAccountForm: (value: SetStateAction<CreateAccountType>) => void;
	createAccount: (email: string, password: string) => void;
};

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
	createAccountForm,
	setCreateAccountForm,
	createAccount,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showRepeatPassword, setRepeatShowPassword] = useState(false);
	const [createAccountError, setCreateAccountError] = useState("");
	const [creatingAccount, setCreatingAccount] = useState(false);
	const [createAccountFormError, setCreateAccountFormError] = useState({
		password: false,
		repeatPassword: false,
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCreateAccountError("");

		const { name, value } = e.target;

		setCreateAccountForm((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === "password") {
			setCreateAccountFormError((prev) => ({
				...prev,
				password: !SignInRegex.password.test(value),
			}));
		}

		if (name === "repeatPassword" || createAccountForm.repeatPassword) {
			if (name === "repeatPassword") {
				setCreateAccountFormError((prev) => ({
					...prev,
					repeatPassword: value !== createAccountForm.password ? true : false,
				}));
			} else if (name === "password") {
				setCreateAccountFormError((prev) => ({
					...prev,
					repeatPassword:
						value !== createAccountForm.repeatPassword ? true : false,
				}));
			}
		}
	};

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (
			createAccountError ||
			createAccountFormError.password ||
			createAccountFormError.repeatPassword
		) {
			return;
		}

		setCreatingAccount(true);
		try {
			await createAccount(createAccountForm.email, createAccountForm.password);
		} catch (error: any) {
			console.log("Account Creation Failed!");
			setCreateAccountError(error.message);
		}
		setCreatingAccount(false);
	};

	/**
	 * Handles the click event of the input text div to focus the input element inside it when clicked.
	 *
	 * @param {React.MouseEvent<HTMLDivElement>} e - The click event.
	 */
	const handleInputTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
		(
			(e.currentTarget as HTMLInputElement).querySelector(
				"input"
			) as HTMLInputElement
		).focus();
	};

	return (
		<div className="w-full max-w-md flex flex-col bg-white shadow-around-sm rounded-xl">
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
									{createAccountForm.email}
								</span>
							</p>
						</div>
					</div>
				</div>
				<div className="px-4">
					<div className="divider my-4"></div>
				</div>
				<div className="px-4">
					<form
						className="auth-form gap-y-8"
						onSubmit={handleFormSubmit}
					>
						<div className="w-full flex flex-col relative z-10 gap-y-4">
							<div className="w-full flex flex-col gap-y-2">
								<div
									className={`auth-input-container
										${createAccountForm.password && " auth-input-container-filled"}
										${createAccountFormError.password && " !border-red-500 text-red-500"}
									`}
									onClick={handleInputTextClick}
								>
									<div className="auth-input-text required-field">
										<label
											htmlFor="password"
											className="label"
										>
											Password
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
										onClick={() => setShowPassword((prev) => !prev)}
									>
										{showPassword ? (
											<AiFillEye className="h-full w-full" />
										) : (
											<AiFillEyeInvisible className="h-full w-full" />
										)}
									</button>
								</div>
								<div
									className={`${
										!createAccountFormError.password ? "h-0 py-0" : "h-max py-4"
									} px-4 duration-100 text-xs text-white rounded-md bg-red-500 w-full flex flex-col justify-center overflow-hidden origin-top`}
								>
									<ul className="flex flex-col gap-y-1">
										<li>
											<p>1. Password must be at least 8 characters long.</p>
										</li>
										<li>
											<p>
												2. Password should only contain A-Z, a-z, 0-9, or
												special characters(@, $, !, %, *, ?, &), and no spaces.
											</p>
										</li>
									</ul>
								</div>
							</div>
							<div className="w-full flex flex-col gap-y-2">
								<div
									className={`auth-input-container ${
										createAccountForm.repeatPassword
											? "auth-input-container-filled"
											: ""
									}`}
									onClick={handleInputTextClick}
								>
									<div className="auth-input-text required-field">
										<label
											htmlFor="repeatPassword"
											className="label"
										>
											Repeat Password
										</label>
										<input
											required
											type={showRepeatPassword ? "text" : "password"}
											name="repeatPassword"
											title="Repeat Password"
											className="input-field"
											onChange={handleInputChange}
											minLength={8}
											maxLength={256}
										/>
									</div>
									<button
										type="button"
										title={
											showRepeatPassword ? "Hide Password" : "Show Password"
										}
										className="aspect-square h-5 w-5 text-gray-500 text-opacity-50 hover:text-logo-300 focus:text-logo-300"
										onClick={() => setRepeatShowPassword((prev) => !prev)}
									>
										{showRepeatPassword ? (
											<AiFillEye className="h-full w-full" />
										) : (
											<AiFillEyeInvisible className="h-full w-full" />
										)}
									</button>
								</div>
								<div
									className={`${
										!createAccountFormError.repeatPassword ||
										!createAccountForm.repeatPassword
											? "h-0 py-0"
											: "h-max py-4"
									} px-4 duration-100 text-xs text-white rounded-md bg-red-500 w-full flex flex-col justify-center overflow-hidden origin-top`}
								>
									<p>Password does not match.</p>
								</div>
							</div>
						</div>
						<div>
							<button
								type="submit"
								title="Create Account"
								className="page-button bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600 focus:bg-green-600 focus:border-green-600"
								disabled={creatingAccount}
							>
								{!creatingAccount ? (
									"Sign Up"
								) : (
									<FiLoader className="h-6 w-6 text-white animate-spin" />
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateAccountForm;
