import clientPromise from "../mongodb";

export default async function postDb() {
	const client = await clientPromise;
	const db = client.db("sorsu-db");
	const postsCollection = db.collection("posts");
	const postLikesCollection = db.collection("post-likes");
	const postCommentsCollection = db.collection("post-comments");
	const postCommentLikesCollection = db.collection("post-comment-likes");

	return {
		postsCollection,
		postLikesCollection,
		postCommentsCollection,
		postCommentLikesCollection,
	};
}
