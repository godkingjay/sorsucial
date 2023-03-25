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
 * @property {boolean} isAccepted - The status of the request.
 * @property {boolean} isRejected - The status of the request.
 * @property {Date} [createdAt] - The date and time the request was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface InstructorRequest {
	id: string;
	userId: string;
	instructorId: string;
	isAccepted: boolean;
	isRejected: boolean;
	createdAt?: Date;
}

/**
 * This interface is used to define the structure of a staff request object.
 * This is the object that is stored in the database.
 *
 * @export
 * @interface StaffRequest
 * @category Interfaces
 * @subcategory Request
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the request.
 * @property {string} userId - The unique identifier of the user.
 * @property {string} staffId - The unique identifier of the staff.
 * @property {boolean} isAccepted - The status of the request.
 * @property {boolean} isRejected - The status of the request.
 * @property {Date} [createdAt] - The date and time the request was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface StaffRequest {
	id: string;
	userId: string;
	staffId: string;
	isAccepted: boolean;
	isRejected: boolean;
	createdAt?: Date;
}
