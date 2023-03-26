/**
 * This interface represents a tag in the database.
 * It is used to store the tag's name, description, and the number of posts and discussions that are tagged with it.
 *
 * ----------------------------------------------------------------
 *
 * @export
 * @interface Tag
 * @category Interfaces
 *
 * ----------------------------------------------------------------
 *
 * @property {string} id - The tag's id.
 * @property {string} name - The tag's name.
 * @property {string} [description] - The tag's description.
 * @property {number} totalCount - The total number of posts and discussions that are tagged with this tag.
 * @property {number} postCount - The number of posts that are tagged with this tag.
 * @property {number} discussionCount - The number of discussions that are tagged with this tag.
 * @property {Date} updatedAt - The date and time the tag was last changed.
 * @property {Date} createdAt - The date and time the tag was created.
 *
 * ----------------------------------------------------------------
 *
 * @author Jarrian Vince Gojar
 */
export interface Tag {
	id: string;
	name: string;
	description?: string;
	totalCount: number;
	postCount: number;
	discussionCount: number;
	updatedAt: Date;
	createdAt: Date;
}
