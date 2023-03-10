import { Timestamp } from "firebase/firestore";

/**
 * This interface is used to define the structure of a course object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface Course
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the course.
 * @property {string} campusId - The unique identifier of the campus.
 * @property {string} departmentId - The unique identifier of the department.
 * @property {string} programId - The unique identifier of the program.
 * @property {string} name - The name of the course.
 * @property {string} [description] - The description of the course.
 * @property {string} code - The code of the course.
 * @property {number} units - The number of units of the course.
 * @property {boolean} isElective - Whether the course is an elective.
 * @property {Timestamp} [startAt] - The date and time the course started.
 * @property {Timestamp} [endAt] - The date and time the course ended.
 * @property {Timestamp} [lastChangeAt] - The date and time the course was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Course {
	id: string;
	campusId: string;
	departmentId: string;
	programId: string;
	name: string;
	description?: string;
	code: string;
	units: number;
	isElective: boolean;
	startAt?: Timestamp;
	endAt?: Timestamp;
	lastChangeAt?: Timestamp;
}
