import { clientAuth } from "@/firebase/clientApp";
import { fetchSignInMethodsForEmail } from "firebase/auth";

/**
 * The `useCheck` function is a React hook that encapsulates the functionality of checking if a user
 * email exists in the authentication system.
 *
 * @returns The `useCheck` function returns an object with a property `checkUserEmailExists` that
 * references the `checkUserEmailExists` function defined in the `useCheck` function.
 *
 * @see {@link https://reactjs.org/docs/hooks-intro.html - Introducing Hooks | React}
 * @see {@link https://reactjs.org/docs/hooks-reference.html - Hooks API Reference | React}
 * @see {@link https://legacy.reactjs.org/docs/hooks-custom.html - Custom Hook}
 */
const useCheck = () => {
	/**
	 * This is a TypeScript React function that checks if a user email exists by fetching sign-in methods
	 * for the email.
	 *
	 * @param {string} userEmail - a string representing the email address of a user.
	 *
	 * @returns The function `checkUserEmailExists` returns a Promise that resolves to a boolean value.
	 * The boolean value indicates whether or not the provided email address exists in the authentication
	 * system. If the email address exists, the function returns `true`, otherwise it returns `false`.
	 *
	 * @see {@link https://firebase.google.com/docs/auth/web/email-link-auth#differentiating_emailpassword_from_email_link - Differentiating email/password from email link | Firebase}
	 * @see {@link https://firebase.google.com/docs/auth/web/manage-users - Managing users | Firebase}
	 */
	const checkUserEmailExists = async (userEmail: string): Promise<boolean> => {
		try {
			/**
			 * `const signInMethods = await fetchSignInMethodsForEmail(clientAuth, userEmail)` is calling the
			 * Firebase Authentication API's `fetchSignInMethodsForEmail` method to check if the provided email
			 * address (`userEmail`) is associated with any existing user accounts. The `clientAuth` parameter
			 * is a Firebase Auth instance that is used to authenticate the request. The method returns a
			 * Promise that resolves to an array of sign-in methods (e.g. "password", "Google", "Facebook",
			 * etc.) associated with the email address. If the array is empty, it means that the email address
			 * is not associated with any existing user accounts.
			 *
			 * @see {@link https://firebase.google.com/docs/reference/js/firebase.auth.Auth#fetchsigninmethodsforemail - fetchSignInMethodsForEmail | Firebase}
			 */
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
			console.log(`=>Error checking if user email exists:\n${error.message}`);
			throw error;
		}
	};

	/**
	 * `return { checkUserEmailExists };` is creating an object with a property `checkUserEmailExists`
	 * that references the `checkUserEmailExists` function defined in the `useCheck` function. This object
	 * is then returned by the `useCheck` function and can be used to access the `checkUserEmailExists`
	 * function in other parts of the code. This is an example of using the module pattern in JavaScript
	 * to encapsulate functionality and expose only what is necessary to the outside world.
	 */
	return {
		checkUserEmailExists,
	};
};

export default useCheck;
