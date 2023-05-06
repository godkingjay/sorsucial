import clientPromise from "../mongodb";

/**
 * This is an async function that returns a MongoDB client and database instance for the "sorsu-db"
 * database.
 *
 * @returns {Promise<{
 *  client: MongoClient;
 *  sorsuDb: Db;
 * }>} - An object with two properties: `client` and `sorsuDb`. The `client` property is the MongoDB
 * client object and the `sorsuDb` property is the database object for the "sorsu-db" database.
 *
 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/mongoclient.html | MongoClient}
 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/db.html | Db}
 */
export default async function mongoDb() {
	/**
	 * `const client = await clientPromise;` is awaiting the resolution of the `clientPromise` promise,
	 * which is expected to return a MongoDB client object. Once the promise is resolved, the `client`
	 * constant is assigned the value of the resolved promise, which is the MongoDB client object.
	 *
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/mongoclient.html | MongoClient}
	 */
	const client = await clientPromise;

	/**
	 * `const sorsuDb = await client.db("sorsu-db");` is retrieving the database object for the "sorsu-db"
	 * database from the MongoDB client object. The `client.db()` method returns a database object that
	 * can be used to interact with the specified database. In this case, the returned database object is
	 * assigned to the `sorsuDb` constant.
	 *
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/db.html | Db}
	 */
	const sorsuDb = await client.db("sorsu-db");

	/**
	 * This code is returning an object with two properties: `client` and `sorsuDb`. The `client` property
	 * is the MongoDB client object and the `sorsuDb` property is the database object for the "sorsu-db"
	 * database. This object can be used to interact with the MongoDB database.
	 *
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/mongoclient.html | MongoClient}
	 * @see {@link https://mongodb.github.io/node-mongodb-native/api-generated/db.html | Db}
	 */
	return {
		client,
		sorsuDb,
	};
}
