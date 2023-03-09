import { GeoPoint, Timestamp } from "firebase/firestore";

/**
 * This interface is used to define the structure of a user object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface SiteUser - The user object.
 * @category Interfaces
 * @subcategory User
 *
 * ----------------------------------------------------------------
 *
 * @property {string} uid - The unique identifier of the user.
 * @property {string} firstName - The first name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} phoneNumber - The phone number of the user.
 * @property {boolean} isFirsLogin - Whether or not this is the first time the user has logged in.
 * @property {"admin" | "staff" | "student" | "instructor" | "user"} role - The role of the user.
 * @property {string} imageURL - The URL of the user's profile image.
 * @property {Timestamp} birthDate - The date of birth of the user.
 * @property {"male" | "female" | "other"} gender - The gender of the user.
 * @property {string} [currentStatusText] - The current status text of the user.
 * @property {string} [currentStatusEmoji] - The current status emoji of the user.
 * @property {number} numberOfConnections - The number of connections the user has.
 * @property {number} numberOfFollowers - The number of followers the user has.
 * @property {GeoPoint} [location] - The location of the user.
 * @property {string} [postalCode] - The postal code of the user.
 * @property {string} [stateOrProvince] - The state or province of the user.
 * @property {string} [cityOrMunicipality] - The city or municipality of the user.
 * @property {string} [streetAddress] - The street address of the user.
 * @property {Timestamp} createdAt - The date and time the user was created.
 * @property {Timestamp} [previousNames] - The previous names of the user.
 * @property {Timestamp} lastLoginAt - The date and time the user last logged in.
 * @property {Timestamp} lastChangeAt - The date and time the user was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface SiteUser {
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

/**
 * This interface is used to define the structure of a user's connection object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface UserConnection - The connections object.
 * @category Interfaces
 * @subcategory SiteUser
 *
 * ----------------------------------------------------------------
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {boolean} isAccepted - Whether or not the connection request has been accepted.
 * @property {boolean} isRejected - Whether or not the connection request has been rejected.
 * @property {Timestamp} requestAt - The date and time the connection request was sent.
 * @property {Timestamp} [acceptAt] - The date and time the connection request was accepted.
 * @property {Timestamp} lastChangeAt - The date and time the connection request was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface UserConnection {
	userId: string;
	isAccepted: boolean;
	isRejected: boolean;
	requestAt: Timestamp;
	acceptAt?: Timestamp;
	lastChangeAt: Timestamp;
}

/**
 * This interface is used to define the structure of a user's group object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface UserGroup
 * @category Interfaces
 * @subcategory SiteUser
 *
 * ----------------------------------------------------------------
 *
 * @property {string} groupId - The unique identifier of the group.
 * @property {boolean} isOwner - Whether or not the user is the owner of the group.
 * @property {boolean} isAdmin - Whether or not the user is an admin of the group.
 * @property {boolean} isModerator - Whether or not the user is a moderator of the group.
 * @property {Timestamp} lastChangeAt - The date and time the group was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface UserGroup {
	groupId: string;
	isOwner: boolean;
	isAdmin: boolean;
	isModerator: boolean;
	lastChangeAt: Timestamp;
}
