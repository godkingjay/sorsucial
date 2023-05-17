import admin, { credential } from "firebase-admin";

const firebaseAdminConfig = {
	credential: credential.cert({
		projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
		clientEmail: process.env.NEXT_PUBLIC_ADMIN_CLIENT_EMAIL,
		privateKey: process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
	}),
	projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
	databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
	storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
};

const adminApp = admin.apps.length
	? admin.app()
	: admin.initializeApp(firebaseAdminConfig);
const authAdmin = adminApp.auth();
const adminDb = adminApp.firestore();
const adminStorage = adminApp.storage();

export { adminApp, authAdmin, adminDb, adminStorage };
