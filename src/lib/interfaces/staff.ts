/**
 * This interface is used to define the structure of a staff object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface Staff
 * @category Interfaces
 * @subcategory Staff
 * @see {@link Staff}
 *
 * ----------------------------------------------------------------
 *
 * @property {string} staffId - The unique identifier of the staff.
 * @property {string} userId - The unique identifier of the user.
 * @property {string} campusId - The unique identifier of the campus.
 * @property {string} [workType] - The type of work the staff does.
 * @property {number} yearsOfService - The number of years the staff has been working.
 * @property {string} [status] - The status of the staff.
 * @property {Date} [workStartAt] - The date and time the staff started working.
 * @property {Date} [workEndAt] - The date and time the staff ended working.
 * @property {Date} [updatedAt] - The date and time the staff was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Staff {
	staffId: string;
	userId: string;
	campusId: string;
	workType?: string;
	yearsOfService: number;
	status?: "working" | "retired" | "quit";
	workStartAt?: Date;
	workEndAt?: Date;
	updatedAt?: Date;
}
