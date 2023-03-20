import { db } from "@/firebase/clientApp";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

const useCheck = () => {
	const checkUserEmailExists = async (userEmail: string): Promise<boolean> => {
		try {
			const usersQuery = query(
				collection(db, "users"),
				where("email", "==", userEmail),
				limit(1)
			);

			const usersSnapshot = await getDocs(usersQuery);

			if (usersSnapshot.docs.length > 0) {
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
