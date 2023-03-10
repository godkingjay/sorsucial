import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const useUser = () => {
	const [user, loading, error] = useAuthState(auth);
	const [loadingUser, setLoadingUser] = useState(false);
	const router = useRouter();

	const getUserDetails = async () => {};

	const userMemo = useMemo(() => {
		return user;
	}, [user]);

	// useEffect(() => {
	// 	setLoadingUser(true);
	// 	if (!user && !loading) {
	// 		setLoadingUser(false);
	// 		router.push("/auth/login");
	// 	} else {
	// 		getUserDetails();
	// 	}
	// }, [user, loading]);

	return {
		authUser: userMemo,
		authLoading: loading,
		authError: error,
		loadingUser,
		setLoadingUser,
	};
};

export default useUser;
