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
 * @property {Date} updatedAt - The date and time the program was last changed.
 * @property {Date} createdAt - The date and time the program was created.
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
	updatedAt: Date;
	createdAt: Date;
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
 * @property {string} campusId - The unique identifier of the campus.
 * @property {string} description - The description of the course.
 * @property {Date} [startAt] - The date and time the course started.
 * @property {Date} [endAt] - The date and time the course ended.
 * @property {Date} updatedAt - The date and time the course was last changed.
 * @property {Date} createdAt - The date and time the course was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface ProgramCourse {
	courseId: string;
	programId: string;
	description?: string;
	startAt?: Date;
	endAt?: Date;
	updatedAt: Date;
	createdAt: Date;
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
 * @property {string} programId - The unique identifier of the program.
 * @property {string} [description] - The description of the program instructor.
 * @property {Date} [startAt] - The date and time the instructor started teaching in the program.
 * @property {Date} [endAt] - The date and time the instructor ended teaching in the program.
 * @property {Date} updatedAt - The date and time the program instructor was last changed.
 * @property {Date} createdAt - The date and time the program instructor was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface ProgramInstructor {
	userId: string;
	instructorId: string;
	programId: string;
	description?: string;
	startAt?: Date;
	endAt?: Date;
	updatedAt: Date;
	createdAt: Date;
}

/**
 * This interface is used to define the structure of a program student object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @interface ProgramStudents
 * @category Interfaces
 * @subcategory Program
 * @see {@link Program}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {string} studentId - The unique identifier of the student.
 * @property {string} programId - The unique identifier of the program.
 * @property {string} [description] - The description of the program student.
 * @property {Date} [startAt] - The date and time the student started studying in the program.
 * @property {Date} [endAt] - The date and time the student ended studying in the program.
 * @property {Date} updatedAt - The date and time the program student was last changed.
 * @property {Date} createdAt - The date and time the program student was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface ProgramStudents {
	userId: string;
	studentId: string;
	programId: string;
	description?: string;
	startAt?: Date;
	endAt?: Date;
	updatedAt: Date;
	createdAt: Date;
}
