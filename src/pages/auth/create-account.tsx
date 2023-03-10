import { auth } from "@/firebase/clientApp";
import { isSignInWithEmailLink } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type CreateAccountPageProps = {};

const CreateAccountPage: React.FC<CreateAccountPageProps> = () => {
	const [createAccount, setCreateAccount] = useState({
		email: "",
		password: "",
	});

	const router = useRouter();

	const initializeCreateAccount = async () => {
		setCreateAccount((prev) => ({
			...prev,
			email: localStorage.getItem("emailForSignIn") as string,
		}));
	};

	useEffect(() => {
		if (isSignInWithEmailLink(auth, router.asPath)) {
			initializeCreateAccount();
		} else {
			router.push("/auth/login");
		}
	}, [router]);

	return <div>CreateAccountPage</div>;
};

export default CreateAccountPage;
