export const authError: {
	[key: string]: string;
} = {
	"Firebase: Error (auth/user-not-found).": "Incorrect email or password.",
	"Firebase: Error (auth/wrong-password).": "Incorrect email or password.",
	"Firebase: Error (auth/network-request-failed)":
		"Network request failed. Please try again later.",
	"Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).":
		"Multiple failed login attempts. Please try again later",
	'Firebase: Error (auth/invalid-json-payload-received.-unknown-name-"email":-proto-field-is-not-repeating,-cannot-start-list.).':
		"Unknown email.",
	"Firebase: Error (auth/user-disabled).": "User has been disabled.",
	"Firebase: Error (auth/email-already-in-use).":
		"A user with that email already exists.",
	"Firebase: Exceeded daily quota for email sign-in. (auth/quota-exceeded).":
		"Something went wrong. Please try again later.",
};
