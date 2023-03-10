import React, { useState } from "react";
import LoginForm from "./Auth/LoginForm";
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
				<LoginForm handleFormChange={handleFormChange} />
			)}
			{/* {authForm === "signup" && <SignUpForm />} */}
		</>
	);
};

export default AuthForm;
