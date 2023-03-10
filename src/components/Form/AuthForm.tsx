import React, { useState } from "react";
import SignInForm from "./Auth/SignInForm";
import SignUpForm from "./Auth/SignUpForm";

type AuthFormProps = {};

export type authForm = "login" | "signup" | "resetPassword";

const AuthForm: React.FC<AuthFormProps> = () => {
	const [authForm, setAuthForm] = useState<authForm>("login");

	const handleFormChange = (form: authForm) => {
		setAuthForm(form);
	};

	return (
		<>
			{authForm === "login" && (
				<SignInForm handleFormChange={handleFormChange} />
			)}
			{authForm === "signup" && (
				<SignUpForm handleFormChange={handleFormChange} />
			)}
		</>
	);
};

export default AuthForm;
