import ErrorBannerTextSm from "@/components/Banner/ErrorBanner/ErrorBannerTextSm";
import { auth } from "@/firebase/clientApp";
import { authError } from "@/firebase/error";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiLoader } from "react-icons/fi";
import { authForm } from "../AuthForm";
import { useRouter } from "next/router";

/**
 * The SignInFormProps interface is used to type the props of the SignInForm component.
 *
 * The SignInFormProps interface has the following properties:
 * - handleFormChange: A function that is used to change the form.
 */
type SignInFormProps = {
	handleFormChange: (form: authForm) => void;
};

/**
 * The SignInRegex object is used to store the regular expressions used to validate the input fields.
 *
 * The SignInRegex object has the following properties:
 * - email: The regular expression used to validate the email input field.
 * The email input field should only accept emails with the domain name @sorsu.edu.ph.
 * The email input field should only accept letters, numbers, periods, underscores, and dashes.
 *
 * The SignInRegex object is used to validate the input fields.
 *
 * The SignInRegex object is used to determine if the user is allowed to sign in.
 */
export const SignInRegex = {
	email: /^[a-zA-Z0-9._-]*@sorsu.edu.ph$/,
	password: /^(?=.*[A-Za-z\d@$!%*?&])[A-Za-z\d@$!%*?&]{8,256}$/,
};

/**
 * The SignInForm component is used to sign in the user.
 *
 * The SignInForm component has the following properties:
 * - handleFormChange: A function that is used to change the form.
 *
 * The SignInForm component is used in the AuthForm component.
 */
const SignInForm: React.FC<SignInFormProps> = ({ handleFormChange }) => {
	/**
	 * The showPassword state value is used to determine if the password input field should be shown as plain text or as password.
	 */
	const [showPassword, setShowPassword] = useState(false);
	/**
	 * The signInForm state value is used to store the values of the input fields.
	 *
	 * The signInForm state value is an object with the following properties:
	 * - email: The email input field value.
	 * - password: The password input field value.
	 *
	 * The signInForm state value is initialized to an empty string for both properties.
	 *
	 * The signInForm state value is updated when the user types in the input fields.
	 *
	 * The signInForm state value is used to sign in the user.
	 *
	 * The signInForm state value is also used to validate the input fields.
	 *
	 * The signInForm state value is also used to determine if the user is allowed to sign in.
	 */
	const [signInForm, setSignInForm] = useState({
		email: "",
		password: "",
	});

	/**
	 * The signInError state value is used to store the error message of the sign in process.
	 *
	 * The signInError state value is initialized to an empty string.
	 *
	 * The signInError state value is updated when the user submits the form.
	 *
	 * The signInError state value is used to display the error message of the sign in process.
	 *
	 * The signInError state value is also used to determine if the error banner should be shown.
	 *
	 * The signInError state value is also used to determine if the user is allowed to sign in.
	 */
	const [signInError, setSignInError] = useState<string>("");

	/**
	 * The signingIn state value is used to determine if the user is signing in.
	 *
	 * The signingIn state value is initialized to false.
	 *
	 * The signingIn state value is updated when the user submits the form.
	 *
	 * The signingIn state value is used to determine if the user is allowed to sign in.
	 *
	 * The signingIn state value is also used to determine if the loading spinner should be shown.
	 *
	 * The signingIn state value is also used to determine if the user is allowed to click the show password button.
	 */
	const [signingIn, setSigningIn] = useState(false);

	/**
	 * The validEmail state value is used to determine if the email input field value is a valid email address.
	 *
	 * The validEmail state value is initialized to true.
	 *
	 * The validEmail state value is updated when the user types in the email input field.
	 *
	 * The validEmail state value is used to determine if the user is allowed to sign in.
	 */
	const [validEmail, setValidEmail] = useState(true);

	const [validPassword, setValidPassword] = useState(true);

	/**
	 * The router state value is used to navigate to the home page.
	 *
	 * The router state value is initialized to the useRouter() function.
	 *
	 * The router state value is used to navigate to the home page when the user successfully signs in.
	 */
	const router = useRouter();

	/**
	 * Handles the show password button click event and toggles the showPassword state value.
	 */
	const handleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	/**
	 * Handles the input change event and updates the signInForm state value.
	 *
	 * @param e The input change event.
	 */
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		/**
		 * Resets the signInError state value to an empty string.
		 *
		 * This is to prevent the error banner from showing up when the user is typing in the input field.
		 */
		setSignInError("");

		const { name, value } = e.target;

		/**
		 * Checks if the input field is the email input field.
		 *
		 * If the input field is the email input field, then the validEmail state value is updated.
		 *
		 * If the input field is not the email input field, then the validEmail state value is not updated.
		 *
		 * The validEmail state value is used to determine if the user is allowed to sign in.
		 */
		if (name === "email") {
			setValidEmail(() =>
				e.target.value.match(SignInRegex.email) ? true : false
			);
		}

		/**
		 * Checks if the input field is the password input field.
		 *
		 * If the input field is the password input field, then the validPassword state value is updated.
		 *
		 * The validPassword state value is used to determine if the user is allowed to sign in.
		 */
		if (name === "password") {
			setValidPassword(() =>
				value.match(SignInRegex.password) ? true : false
			);
		}

		/**
		 * Updates the signInForm state value.
		 *
		 * The name of the input field is used as the key of the state value.
		 */
		setSignInForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	/**
	 * Handles the submit event of the form.
	 *
	 * @param e The submit event.
	 */
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		/**
		 * Prevents the default submit event.
		 *
		 * This is to prevent the page from reloading when the user submits the form.
		 */
		e.preventDefault();

		/**
		 * Checks if the email input field is valid.
		 *
		 * If the email input field is valid, then the user is signed in.
		 *
		 * If the email input field is invalid, then the user is not signed in.
		 */
		if (SignInRegex.email.test(signInForm.email)) {
			/**
			 * Sets the validEmail state value to true.
			 *
			 * This is to allow the user to sign in if the email input field is valid.
			 */
			setValidEmail(true);
		} else {
			/**
			 * Sets the validEmail state value to false.
			 *
			 * This is to prevent the user from signing in if the email input field is invalid.
			 */
			setValidEmail(false);
			return;
		}

		/**
		 * Checks if the email and password input fields are not empty.
		 *
		 * If the email and password input fields are not empty, then the user is signed in.
		 */
		if (validEmail && signInForm.password && !signInError) {
			/**
			 * Sets the signingIn state value to true.
			 *
			 * This is to prevent the user from signing in multiple times.
			 */
			setSigningIn(true);
			/**
			 * Signs in the user using the email and password input fields.
			 *
			 * If the user is successfully signed in, then the user is redirected to the home page.
			 *
			 * If the user is not successfully signed in, then the user is not redirected to the home page.
			 *
			 * The error message is displayed in the error banner.
			 *
			 * The signingIn state value is set to false.
			 *
			 * This is to allow the user to sign in again.
			 */
			try {
				/**
				 * Signs in the user using the email and password input fields.
				 *
				 * @throws An error if the user is not successfully signed in.
				 */
				await signInWithEmailAndPassword(
					auth,
					signInForm.email,
					signInForm.password
				).catch((error) => {
					throw error;
				});

				/**
				 * Redirects the user to the home page.
				 *
				 * This is to prevent the user from accessing the sign in page if the user is already signed in.
				 */
				router.push("/");
			} catch (error: any) {
				console.log("SignIn Error!");
				/**
				 * Displays the error message in the error banner.
				 *
				 * This is to inform the user that the user is not successfully signed in.
				 *
				 * The error message is retrieved from the authError object.
				 */
				setSignInError(error.message);
			}

			/**
			 * Sets the signingIn state value to false.
			 *
			 * This is to allow the user to sign in again.
			 */
			setSigningIn(false);
		}
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
									${!validEmail && signInForm.email && " !border-red-500 text-red-500"}
								`}
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
									validEmail || !signInForm.email ? "h-0 py-0" : "h-max py-4"
								} px-4 duration-100 text-xs text-white rounded-md bg-red-500 w-full flex flex-col justify-center overflow-hidden origin-top`}
							>
								<p>Please input a school provided email address.</p>
							</div>
						</div>
						<div className="w-full z-[9] flex flex-col gap-y-2">
							<div
								className={`auth-input-container
									${signInForm.password ? "auth-input-container-filled" : ""}
									${!validPassword && signInForm.password && " !border-red-500 text-red-500"}
								`}
								onClick={handleInputTextClick}
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
