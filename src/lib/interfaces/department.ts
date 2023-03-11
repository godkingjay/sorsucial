import { GeoPoint, Timestamp } from "firebase/firestore";

/**
 * This interface is used to define the structure of a department object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface Department
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the department.
 * @property {string} campusId - The unique identifier of the campus.
 * @property {string} name - The name of the department.
 * @property {string} [description] - The description of the department.
 * @property {string} [streetAddress] - The street address of the department.
 * @property {string} [stateOrProvince] - The state or province of the department.
 * @property {string} [cityOrMunicipality] - The city or municipality of the department.
 * @property {string} [postalCode] - The postal code of the department.
 * @property {GeoPoint} [location] - The location of the department.
 * @property {Timestamp} [builtAt] - The date and time the department was built.
 * @property {Timestamp} [lastChangeAt] - The date and time the department was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Department {
	id: string;
	campusId: string;
	name: string;
	description?: string;
	streetAddress?: string;
	stateOrProvince?: string;
	cityOrMunicipality?: string;
	postalCode?: string;
	location?: GeoPoint;
	builtAt?: Timestamp;
	lastChangeAt?: Timestamp;
}
