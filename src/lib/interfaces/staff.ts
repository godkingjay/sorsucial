import { Timestamp } from "firebase/firestore";

/**
 * This interface is used to define the structure of a staff object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface Staff
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {string} staffId - The unique identifier of the staff.
 * @property {string} userId - The unique identifier of the user.
 * @property {string} campusId - The unique identifier of the campus.
 * @property {string} [departmentId] - The unique identifier of the department.
 * @property {boolean} isInstructor - Whether the staff is an instructor.
 * @property {string} [instructorId] - The unique identifier of the instructor.
 * @property {string} [specialty] - The specialty of the staff.
 * @property {number} yearsOfService - The number of years the staff has been working.
 * @property {string} [status] - The status of the staff.
 * @property {Timestamp} [workStartAt] - The date and time the staff started working.
 * @property {Timestamp} [workEndAt] - The date and time the staff ended working.
 * @property {Timestamp} [lastChangeAt] - The date and time the staff was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Staff {
	staffId: string;
	userId: string;
	campusId: string;
	departmentId?: string;
	isInstructor: boolean;
	instructorId?: string;
	specialty?: string;
	yearsOfService: number;
	status?: "working" | "retired" | "quit";
	workStartAt?: Timestamp;
	workEndAt?: Timestamp;
	lastChangeAt?: Timestamp;
}

/**
 * This interface is used to define the structure of a staff object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface InstructorCourse
 * @category Interfaces
 * @subcategory Staff
 * @see {@link Staff}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} courseId - The unique identifier of the course.
 * @property {string} [description] - The description of the course.
 * @property {Timestamp} [lastChangeAt] - The date and time the course was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface InstructorCourse {
	courseId: string;
	description?: string;
	lastChangeAt?: Timestamp;
}
