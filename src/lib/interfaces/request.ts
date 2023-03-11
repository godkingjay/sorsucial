import { Timestamp } from "firebase/firestore";

/**
 * This interface is used to define the structure of an instructor request object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface InstructorRequest
 * @category Interfaces
 * @subcategory Request
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the request.
 * @property {string} userId - The unique identifier of the user.
 * @property {string} instructorId - The unique identifier of the instructor.
 * @property {string} firstName - The first name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {boolean} isAccepted - The status of the request.
 * @property {boolean} isRejected - The status of the request.
 * @property {Timestamp} [createdAt] - The date and time the request was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface InstructorRequest {
	id: string;
	userId: string;
	instructorId: string;
	firstName: string;
	lastName: string;
	isAccepted: boolean;
	isRejected: boolean;
	createdAt?: Timestamp;
}
