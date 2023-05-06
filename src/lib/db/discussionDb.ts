import {
	SiteDiscussion,
	DiscussionVote,
	Reply,
	ReplyVote,
} from "./../interfaces/discussion";
import mongoDb from "./db";

/**
 * This function returns collections related to discussions and their votes and replies in a MongoDB
 * database.
 *
 * @returns {Promise<{
 * 	discussionsCollection: Collection<Document>;
 * 	discussionVotesCollection: Collection<Document>;
 * 	discussionRepliesCollection: Collection<Document>;
 * 	discussionReplyVotesCollection: Collection<Document>;
 * }>} - An object containing four collections from a MongoDB database related to discussions and
 * their votes and replies and their votes.
 *
 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/db.html | Db}
 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/collection.html | Collection}
 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/document.html | Document}
 */
export default async function discussionDb() {
	const { sorsuDb } = await mongoDb();

	/**
	 * This creates a constant variable `discussionsCollection` that is assigned the value of the "discussions"
	 * collection from the MongoDB database. The `sorsuDb` object is obtained from the `mongoDb()` function
	 * call, which connects to the MongoDB database. The `collection()` method is then called on the `sorsuDb`
	 * object to retrieve the "discussions" collection.
	 *
	 * @see {@link SiteDiscussion} - MongoDB document interface for the "discussions" collection.
	 *
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/db.html | Db}
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/collection.html | Collection}
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/document.html | Document}
	 */
	const discussionsCollection = sorsuDb.collection("discussions");

	/**
	 * `const discussionVotesCollection = sorsuDb.collection("discussion-votes");` is creating a constant
	 * variable `discussionVotesCollection` that is assigned the value of the "discussion-votes"
	 * collection from the MongoDB database. The `sorsuDb` object is obtained from the `mongoDb()`
	 * function call, which connects to the MongoDB database. The `collection()` method is then called on
	 * the `sorsuDb` object to retrieve the "discussion-votes" collection.
	 *
	 * @see {@link DiscussionVote} - MongoDB document interface for the "discussion-votes" collection.
	 *
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/db.html | Db}
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/collection.html | Collection}
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/document.html | Document}
	 */
	const discussionVotesCollection = sorsuDb.collection("discussion-votes");

	/**
	 * `const discussionRepliesCollection = sorsuDb.collection("discussion-replies");` is creating a
	 * constant variable `discussionRepliesCollection` that is assigned the value of the
	 * "discussion-replies" collection from the MongoDB database. The `sorsuDb` object is obtained from
	 * the `mongoDb()` function call, which connects to the MongoDB database. The `collection()` method is
	 * then called on the `sorsuDb` object to retrieve the "discussion-replies" collection.
	 *
	 * @see {@link Reply} - MongoDB document interface for the "discussion-replies" collection.
	 *
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/db.html | Db}
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/collection.html | Collection}
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/document.html | Document}
	 */
	const discussionRepliesCollection = sorsuDb.collection("discussion-replies");

	/**
	 * `const discussionReplyVotesCollection = sorsuDb.collection("discussion-reply-votes");` is creating
	 * a constant variable `discussionReplyVotesCollection` that is assigned the value of the
	 * "discussion-reply-votes" collection from the MongoDB database. The `sorsuDb` object is obtained
	 * from the `mongoDb()` function call, which connects to the MongoDB database. The `collection()`
	 * method is then called on the `sorsuDb` object to retrieve the "discussion-reply-votes" collection.
	 * This collection is related to the replies of discussions and contains the votes for each reply.
	 *
	 * @see {@link ReplyVote} - MongoDB document interface for the "discussion-reply-votes" collection.
	 *
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/db.html | Db}
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/collection.html | Collection}
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/document.html | Document}
	 */
	const discussionReplyVotesCollection = sorsuDb.collection(
		"discussion-reply-votes"
	);

	/**
	 * This `return` statement is returning an object that contains four collections from a MongoDB
	 * database related to discussions and their votes and replies and their votes. The collections are
	 * `discussionsCollection`, `discussionVotesCollection`, `discussionRepliesCollection`, and
	 * `discussionReplyVotesCollection`. These collections can be used to perform CRUD (Create, Read,
	 * Update, Delete) operations on the documents in the collections.
	 *
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/db.html | Db}
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/collection.html | Collection}
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/document.html | Document}
	 */
	return {
		discussionsCollection,
		discussionVotesCollection,
		discussionRepliesCollection,
		discussionReplyVotesCollection,
	};
}
