import { credential, initializeApp } from "firebase-admin";

const adminApp = initializeApp({
	credential: credential.cert({
		projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
		clientEmail: process.env.NEXT_PUBLIC_ADMIN_CLIENT_EMAIL,
		privateKey: process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY,
	}),
	projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
	databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
	storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
});

const authAdmin = adminApp.auth();
const firestoreAdmin = adminApp.firestore();
const storageAdmin = adminApp.storage();

export { adminApp, authAdmin, firestoreAdmin, storageAdmin };
