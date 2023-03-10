import { Timestamp } from "firebase/firestore";

/**
 * This interface is used to define the structure of a program object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface Program
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the program.
 * @property {string} campusId - The unique identifier of the campus.
 * @property {string} departmentId - The unique identifier of the department.
 * @property {string} name - The name of the program.
 * @property {string} [description] - The description of the program.
 * @property {string} code - The code of the program.
 * @property {number} units - The number of units of the program.
 * @property {number} durationYear - The duration of the program in years.
 * @property {Timestamp} [startAt] - The date and time the program started.
 * @property {Timestamp} [endAt] - The date and time the program ended.
 * @property {Timestamp} [lastChangeAt] - The date and time the program was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Program {
	id: string;
	campusId: string;
	departmentId: string;
	name: string;
	description?: string;
	code: string;
	units: number;
	durationYear: number;
	startAt?: Timestamp;
	endAt?: Timestamp;
	lastChangeAt?: Timestamp;
}

/**
 * This interface is used to define the structure of a course object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface Course
 * @category Interfaces
 * @subcategory Course
 * @see {@link Course}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} courseId - The unique identifier of the course.
 * @property {Timestamp} [startAt] - The date and time the course started.
 * @property {Timestamp} [endAt] - The date and time the course ended.
 * @property {Timestamp} [lastChangeAt] - The date and time the course was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Course {
	courseId: string;
	startAt?: Timestamp;
	endAt?: Timestamp;
	lastChangeAt?: Timestamp;
}
