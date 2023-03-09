import { GeoPoint, Timestamp } from "firebase/firestore";

interface SiteUser {
	uid: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	isFirsLogin: boolean;
	role: "admin" | "staff" | "student" | "instructor" | "user";
	imageURL: string;
	birthDate: Timestamp;
	gender: "male" | "female" | "other";
	currentStatusText?: string;
	currentStatusEmoji?: string;
	numberOfConnections: number;
	numberOfFollowers: number;
	location?: GeoPoint;
	postalCode?: string;
	stateOrProvince?: string;
	cityOrMunicipality?: string;
	streetAddress?: string;
	createdAt: Timestamp;
	previousNames?: Timestamp;
	lastLoginAt: Timestamp;
	lastChangeAt: Timestamp;
}
