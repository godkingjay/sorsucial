/**
 * This interface is used to define the structure of a instructor object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface Instructor
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {string} instructorId - The unique identifier of the instructor.
 * @property {string} userId - The unique identifier of the user.
 * @property {string} campusId - The unique identifier of the campus.
 * @property {string} [departmentId] - The unique identifier of the department.
 * @property {string} [specialty] - The specialty of the instructor.
 * @property {number} yearsOfService - The number of years the instructor has been working.
 * @property {string} [status] - The status of the instructor.
 * @property {Date} [workStartAt] - The date and time the instructor started working.
 * @property {Date} [workEndAt] - The date and time the instructor ended working.
 * @property {Date} [updatedAt] - The date and time the instructor was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Instructor {
	instructorId: string;
	userId: string;
	campusId: string;
	departmentId?: string;
	specialty?: string;
	yearsOfService: number;
	status?: "working" | "retired" | "quit";
	workStartAt?: Date;
	workEndAt?: Date;
	updatedAt?: Date;
}

/**
 * This interface is used to define the structure of a instructor course object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface InstructorCourse
 * @category Interfaces
 * @subcategory Instructor
 * @see {@link Instructor}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} courseId - The unique identifier of the course.
 * @property {string} [description] - The description of the course.
 * @property {Date} [updatedAt] - The date and time the course was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface InstructorCourse {
	courseId: string;
	description?: string;
	updatedAt?: Date;
}
