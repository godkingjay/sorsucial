import { auth } from "@/firebase/clientApp";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

type LoginFormProps = {};

const LoginForm: React.FC<LoginFormProps> = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [loginForm, setLoginForm] = useState({
		email: "",
		password: "",
	});
	const [loginError, setLoginError] = useState("");

	const handleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (loginForm.email && loginForm.password) {
			try {
				await signInWithEmailAndPassword(
					auth,
					loginForm.email,
					loginForm.password
				).catch((error) => {
					throw error;
				});
			} catch (error: any) {
				console.log("Login error: " + error.message);
				setLoginError(error.message);
			}
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
					<div className="w-full flex flex-col gap-y-4 flex-1 justify-center">
						<div className="w-full flex flex-col">
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
						</div>
						<div className="w-full">
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
					</div>
					<div className="divider"></div>
					<div className="w-full flex-1">
						<button
							type="submit"
							name="login"
							title="Login"
							className="page-button hover:bg-logo-400 hover:border-logo-400 focus:bg-logo-400 focus:border-logo-400"
						>
							Login
						</button>
					</div>
				</div>
				<div className="w-full flex flex-col items-center mt-auto">
					<p
						tabIndex={0}
						className="text-link"
					>
						No account Yet? Sign Up instead.
					</p>
				</div>
			</div>
		</form>
	);
};

export default LoginForm;
