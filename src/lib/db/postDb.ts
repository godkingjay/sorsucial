import mongoDb from "./db";

export default async function postDb() {
	const { sorsuDb } = await mongoDb();

	const postsCollection = sorsuDb.collection("posts");
	const postLikesCollection = sorsuDb.collection("post-likes");
	const postCommentsCollection = sorsuDb.collection("post-comments");
	const postCommentLikesCollection = sorsuDb.collection("post-comment-likes");

	return {
		postsCollection,
		postLikesCollection,
		postCommentsCollection,
		postCommentLikesCollection,
	};
}
