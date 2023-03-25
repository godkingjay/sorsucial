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
 * @property {Date} [startAt] - The date and time the program started.
 * @property {Date} [endAt] - The date and time the program ended.
 * @property {Date} [updatedAt] - The date and time the program was last changed.
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
	startAt?: Date;
	endAt?: Date;
	updatedAt?: Date;
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
 * @subcategory Program
 * @see {@link Program}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} courseId - The unique identifier of the course.
 * @property {Date} [startAt] - The date and time the course started.
 * @property {Date} [endAt] - The date and time the course ended.
 * @property {Date} [updatedAt] - The date and time the course was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Course {
	courseId: string;
	startAt?: Date;
	endAt?: Date;
	updatedAt?: Date;
}

/**
 * This interface is used to define the structure of a program instructor object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface ProgramInstructor
 * @category Interfaces
 * @subcategory Program
 * @see {@link Program}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {string} instructorId - The unique identifier of the instructor.
 * @property {Date} [startAt] - The date and time the instructor started teaching in the program.
 * @property {Date} [endAt] - The date and time the instructor ended teaching in the program.
 * @property {Date} [updatedAt] - The date and time the program instructor was last changed.
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
	updatedAt?: Date;
}
