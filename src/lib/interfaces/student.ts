import { Timestamp } from "firebase/firestore";

/**
 * This interface is used to define the structure of a student object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface Student
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {string} studentId - The unique identifier of the student.
 * @property {string} campusId - The unique identifier of the campus.
 * @property {string} [departmentId] - The unique identifier of the department.
 * @property {string} programId - The unique identifier of the program.
 * @property {number} year - The year of the student.
 * @property {number} block - The block of the student.
 * @property {("summa cum laude" | "magna cum laude" | "cum laude" | "none")} [award] - The award of the student.
 * @property {Timestamp} [enrolledAt] - The date and time the student enrolled.
 * @property {Timestamp} [graduatedAt] - The date and time the student graduated.
 * @property {Timestamp} [lastChangeAt] - The date and time the student was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Student {
	userId: string;
	studentId: string;
	campusId: string;
	departmentId?: string;
	programId: string;
	year: number;
	block: number;
	award?: "summa cum laude" | "magna cum laude" | "cum laude" | "none";
	enrolledAt?: Timestamp;
	graduatedAt?: Timestamp;
	lastChangeAt?: Timestamp;
}

/**
 * This interface is used to define the structure of a student course object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface StudentCourse
 * @category Interfaces
 * @subcategory Student
 * @see {@link Student}
 *
 * ----------------------------------------------------------------
 *
 * @property {number} courseId - The unique identifier of the course.
 * @property {string} [description] - The description of the course.
 * @property {Timestamp} [lastChangeAt] - The date and time the course was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface StudentCourse {
	courseId: number;
	description?: string;
	lastChangeAt?: Timestamp;
}
