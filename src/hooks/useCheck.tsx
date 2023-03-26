import { clientAuth, clientDb } from "@/firebase/clientApp";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

const useCheck = () => {
	const checkUserEmailExists = async (userEmail: string): Promise<boolean> => {
		try {
			const signInMethods = await fetchSignInMethodsForEmail(
				clientAuth,
				userEmail
			);

			if (signInMethods.length > 0) {
				return true;
			} else {
				return false;
			}
		} catch (error: any) {
			console.log("Fetching Users Error!: ", error.message);
			throw error;
		}
	};

	return {
		checkUserEmailExists,
	};
};

export default useCheck;
