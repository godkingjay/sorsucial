import { GeoPoint, Timestamp } from "firebase/firestore";

/**
 * This interface is used to define the structure of a campus object.
 * This is the object that is stored in the database.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface Campus
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The unique identifier of the campus.
 * @property {string} name - The name of the campus.
 * @property {string[]} departments - The list of departments in the campus.
 * @property {string} [streetAddress] - The street address of the campus.
 * @property {string} [stateOrProvince] - The state or province of the campus.
 * @property {string} [cityOrMunicipality] - The city or municipality of the campus.
 * @property {string} [postalCode] - The postal code of the campus.
 * @property {GeoPoint} [location] - The location of the campus.
 * @property {Timestamp} [builtAt] - The date and time the campus was built.
 * @property {Timestamp} [lastChangeAt] - The date and time the campus was last changed.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Campus {
	id: string;
	name: string;
	departments: string[];
	streetAddress?: string;
	stateOrProvince?: string;
	cityOrMunicipality?: string;
	postalCode?: string;
	location?: GeoPoint;
	builtAt?: Timestamp;
	lastChangeAt?: Timestamp;
}
