export const apiConfig = {
	apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
	privateKey: process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};
