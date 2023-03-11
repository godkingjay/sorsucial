import ErrorBannerTextSm from "@/components/Banner/ErrorBanner/ErrorBannerTextSm";
import { CreateAccountType } from "@/pages/auth/create-account";
import React, { SetStateAction, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiLoader } from "react-icons/fi";

type CreateAccountFormProps = {
	createAccount: CreateAccountType;
	setCreateAccount: (value: SetStateAction<CreateAccountType>) => void;
};

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
	createAccount,
	setCreateAccount,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showRepeatPassword, setRepeatShowPassword] = useState(false);
	const [createAccountError, setCreateAccountError] = useState("");
	const [creatingAccount, setCreatingAccount] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCreateAccountError("");
		setCreateAccount((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (createAccountError) {
			return;
		}

		if (createAccount.password !== createAccount.repeatPassword) {
			setCreateAccountError("Passwords do not match.");
			return;
		}

		setCreatingAccount(true);
		try {
		} catch (error: any) {
			console.log("Account Creation Failed!");
			setCreateAccountError(error.message);
		}
		setCreatingAccount(false);
	};

	return (
		<form
			className="auth-form gap-y-8"
			onSubmit={handleFormSubmit}
		>
			<div className="w-full flex flex-col relative z-10 gap-y-4">
				<div
					className={`auth-input-container ${
						createAccount.password ? "auth-input-container-filled" : ""
					}`}
				>
					<div className="auth-input-text">
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
					className={`auth-input-container ${
						createAccount.repeatPassword ? "auth-input-container-filled" : ""
					}`}
				>
					<div className="auth-input-text">
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
						title={showRepeatPassword ? "Hide Password" : "Show Password"}
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
				{createAccountError && (
					<div className="h-max w-full">
						<ErrorBannerTextSm message="Password does not match" />
					</div>
				)}
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
	);
};

export default CreateAccountForm;