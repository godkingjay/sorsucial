import clientPromise from "../mongodb";

export default async function discussionDb() {
	const client = await clientPromise;
	const db = client.db("sorsu-db");
	const discussionsCollection = db.collection("discussions");
	const discussionVotesCollection = db.collection("discussion-votes");
	const discussionRepliesCollection = db.collection("discussion-replies");
	const discussionReplyVotesCollection = db.collection("discussion-reply-votes");
	return {
		discussionsCollection,
		discussionVotesCollection,
		discussionRepliesCollection,
		discussionReplyVotesCollection,
	};
}
