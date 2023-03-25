import { GeoPoint } from "firebase/firestore";

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
 * @property {string} [middleName] - The middle name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} [phoneNumber] - The phone number of the user.
 * @property {boolean} isFirstLogin - Whether or not this is the first time the user has logged in.
 * @property {"admin" | "staff" | "student" | "instructor" | "user"} roles - The role of the user.
 * @property {string} [imageURL] - The URL of the user's profile image.
 * @property {Date} [birthDate] - The date of birth of the user.
 * @property {"male" | "female" | "other"} [gender] - The gender of the user.
 * @property {string} [currentStatusText] - The current status text of the user.
 * @property {string} [currentStatusEmoji] - The current status emoji of the user.
 * @property {number} numberOfConnections - The number of connections the user has.
 * @property {number} numberOfFollowers - The number of followers the user has.
 * @property {GeoPoint} [location] - The location of the user.
 * @property {string} [postalCode] - The postal code of the user.
 * @property {string} [stateOrProvince] - The state or province of the user.
 * @property {string} [cityOrMunicipality] - The city or municipality of the user.
 * @property {string} [barangay] - The barangay of the user.
 * @property {string} [streetAddress] - The street address of the user.
 * @property {Date} [previousNames] - The previous names of the user.
 * @property {Date} [lastLoginAt] - The date and time the user last logged in.
 * @property {Date} [updatedAt] - The date and time the user was last changed.
 * @property {Date} createdAt - The date and time the user was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface SiteUser {
	uid: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	email: string;
	phoneNumber?: string;
	isFirstLogin: boolean;
	roles: ("admin" | "staff" | "student" | "instructor" | "user")[];
	imageURL?: string;
	birthDate?: Date;
	gender?: "male" | "female" | "other";
	currentStatusText?: string;
	currentStatusEmoji?: string;
	numberOfConnections: number;
	numberOfFollowers: number;
	location?: GeoPoint;
	postalCode?: string;
	stateOrProvince?: string;
	cityOrMunicipality?: string;
	barangay?: string;
	streetAddress?: string;
	previousNameChangeAt?: Date;
	lastLoginAt?: Date;
	updatedAt: Date;
	createdAt: Date;
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
 * @see {@link SiteUser}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {boolean} isAccepted - Whether or not the connection request has been accepted.
 * @property {boolean} isRejected - Whether or not the connection request has been rejected.
 * @property {Date} [requestAt] - The date and time the connection request was sent.
 * @property {Date} [acceptAt] - The date and time the connection request was accepted.
 * @property {Date} [updatedAt] - The date and time the connection request was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface UserConnection {
	userId: string;
	isAccepted: boolean;
	isRejected: boolean;
	requestAt?: Date;
	acceptAt?: Date;
	updatedAt?: Date;
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
 * @see {@link SiteUser}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} groupId - The unique identifier of the group.
 * @property {boolean} isOwner - Whether or not the user is the owner of the group.
 * @property {boolean} isAdmin - Whether or not the user is an admin of the group.
 * @property {boolean} isModerator - Whether or not the user is a moderator of the group.
 * @property {Date} [updatedAt] - The date and time the group was last changed.
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
	updatedAt?: Date;
}

/**
 * This interface is used to define the structure of a user's post object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface UserPost
 * @category Interfaces
 * @subcategory SiteUser
 * @see {@link SiteUser}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} postId - The unique identifier of the post.
 * @property {string} [groupId] - The unique identifier of the group.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface UserPost {
	postId: string;
	groupId?: string;
}

/**
 * This interface is used to define the structure of a user's post like object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface UserPostLike
 * @category Interfaces
 * @subcategory SiteUser
 * @see {@link SiteUser}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the post like.
 * @property {string} postId - The unique identifier of the post.
 * @property {string} [groupId] - The unique identifier of the group.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface UserPostLike {
	id: string;
	postId: string;
	groupId?: string;
}

/**
 * This interface is used to define the structure of a user's discussion object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface UserDiscussion
 * @category Interfaces
 * @subcategory SiteUser
 * @see {@link SiteUser}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} discussionId - The unique identifier of the discussion.
 * @property {string} [groupId] - The unique identifier of the group.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface UserDiscussion {
	discussionId: string;
	groupId?: string;
}

/**
 * This interface is used to define the structure of a user's discussion vote object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface UserDiscussionVote
 * @category Interfaces
 * @subcategory SiteUser
 * @see {@link SiteUser}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the discussion vote.
 * @property {string} discussionId - The unique identifier of the discussion.
 * @property {string} [groupId] - The unique identifier of the group.
 * @property {1 | -1} vote - The vote of the user.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface UserDiscussionVote {
	id: string;
	discussionId: string;
	groupId?: string;
	vote: 1 | -1;
}

/**
 * This interface is used to define the structure of a user's image object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface UserImage
 * @category Interfaces
 * @subcategory SiteUser
 * @see {@link SiteUser}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the image.
 * @property {string} userId - The unique identifier of the user.
 * @property {string} filePath - The path of the image.
 * @property {string} fileName - The name of the image.
 * @property {string} fileType - The type of the image.
 * @property {string} fileURL - The URL of the image.
 * @property {string} fileExtension - The extension of the image.
 * @property {Date} createdAt - The date and time the image was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface UserImage {
	id: string;
	userId: string;
	filePath: string;
	fileName: string;
	fileType: string;
	fileURL: string;
	fileExtension: string;
	createdAt: Date;
}
