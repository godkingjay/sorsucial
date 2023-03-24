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
 * @property {Date} [startAt] - The date and time the course started.
 * @property {Date} [endAt] - The date and time the course ended.
 * @property {Date} [lastChangeAt] - The date and time the course was last changed.
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
	startAt?: Date;
	endAt?: Date;
	lastChangeAt?: Date;
}

/**
 * This interface is used to define the structure of a course instructor object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface CourseInstructor
 * @category Interfaces
 * @subcategory Course
 * @see {@link Course}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {string} instructorId - The unique identifier of the instructor.
 * @property {Date} [startAt] - The date and time the user started teaching the course.
 * @property {Date} [endAt] - The date and time the user stopped teaching the course.
 * @property {Date} [lastChangeAt] - The date and time the course instructor was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface CourseInstructor {
	userId: string;
	instructorId: string;
	startAt?: Date;
	endAt?: Date;
	lastChangeAt?: Date;
}

/**
 * This interface is used to define the structure of a course student object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface CourseStudent
 * @category Interfaces
 * @subcategory Course
 * @see {@link Course}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {string} studentId - The unique identifier of the student.
 * @property {number} [grade] - The grade of the student in the course.
 * @property {Date} [startAt] - The date and time the user started taking the course.
 * @property {Date} [endAt] - The date and time the user stopped taking the course.
 * @property {Date} [lastChangeAt] - The date and time the course student was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface CourseStudent {
	userId: string;
	studentId: string;
	grade?: number;
	startAt?: Date;
	endAt?: Date;
	lastChangeAt?: Date;
}
