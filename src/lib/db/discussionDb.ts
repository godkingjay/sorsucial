import mongoDb from "./db";

export default async function discussionDb() {
	const { sorsuDb } = await mongoDb();

	const discussionsCollection = sorsuDb.collection("discussions");
	const discussionVotesCollection = sorsuDb.collection("discussion-votes");
	const discussionRepliesCollection = sorsuDb.collection("discussion-replies");
	const discussionReplyVotesCollection = sorsuDb.collection(
		"discussion-reply-votes"
	);
	return {
		discussionsCollection,
		discussionVotesCollection,
		discussionRepliesCollection,
		discussionReplyVotesCollection,
	};
}
