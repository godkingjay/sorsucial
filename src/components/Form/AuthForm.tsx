import React, { useState } from "react";
import LoginForm from "./Auth/LoginForm";

type AuthFormProps = {};

export type authPage = "login" | "signup" | "resetPassword";

const AuthForm: React.FC<AuthFormProps> = () => {
	const [authPage, setAuthPage] = useState<authPage>("login");

	return (
		<>
			<LoginForm />
		</>
	);
};

export default AuthForm;
