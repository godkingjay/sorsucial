import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const useUser = () => {
	const [user] = useAuthState(auth);
	const [loadingUser, setLoadingUser] = useState(true);
	const router = useRouter();

	const getUserDetails = async () => {
		setLoadingUser(false);
	};

	useEffect(() => {
		if (!user) {
      setLoadingUser(false);
			router.push("/auth/login");
		} else {
			getUserDetails();
		}
	}, [user]);

	return {
		user,
    loadingUser,
    setLoadingUser
	};
};

export default useUser;
