import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { PostComment } from "@/lib/interfaces/post";
import axios from "axios";
import { apiConfig } from "@/lib/api/apiConfig";
import { SiteUser } from "@/lib/interfaces/user";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const client = await clientPromise;
		const db = client.db("sorsu-db");
		const postsCollection = db.collection("posts");
		const postCommentsCollection = db.collection("post-comments");

		switch (req.method) {
			case "POST": {
				const { newComment } = req.body;

				if (!newComment) {
					res.status(500).json({ error: "No comment data provided" });
					return;
				}

				const objectId = new ObjectId();
				const objectIdString = objectId.toHexString();

				newComment.id = objectIdString;

				const newCommentState = await postCommentsCollection.insertOne({
					_id: objectId,
					...newComment,
				});

				const newPostState =
					newComment.commentLevel === 0
						? await postsCollection.updateOne(
								{
									id: newComment.postId,
								},
								{
									$inc: {
										numberOfComments: 1,
										numberOfFirstLevelComments: 1,
									},
								}
						  )
						: await postsCollection.updateOne(
								{
									id: newComment.postId,
								},
								{
									$inc: {
										numberOfComments: 1,
									},
								}
						  );

				res.status(200).json({ newCommentState, newComment });
				break;
			}

			case "GET": {
				const { getCommentPostId, getCommentForId, getFromLikes, getFromDate } =
					req.query;

				if (!getCommentPostId) {
					res.status(500).json({ error: "No post id provided" });
					return;
				}

				if (!getCommentForId) {
					res.status(500).json({ error: "Comment receiver Id not provide" });
					return;
				}

				const comments = getFromDate
					? await postCommentsCollection
							.find({
								postId: getCommentPostId,
								commentForId: getCommentForId,
								numberOfLikes: {
									$lt: parseInt(getFromLikes as string),
								},
								createdAt: {
									$lt: getFromDate,
								},
							})
							.sort({ numberOfLikes: -1, createdAt: -1 })
							.limit(10)
							.toArray()
					: await postCommentsCollection
							.find({
								postId: getCommentPostId,
								commentForId: getCommentForId,
								numberOfLikes: {
									$lt: parseInt(getFromLikes as string),
								},
							})
							.sort({ numberOfLikes: -1, createdAt: -1 })
							.limit(10)
							.toArray();

				const commentsData = await Promise.all(
					comments.map(async (commentDoc) => {
						const comment = commentDoc as unknown as PostComment;
						const creatorData = await axios
							.get(apiConfig.apiEndpoint + "user/user", {
								params: {
									getUserId: comment.creatorId,
								},
							})
							.then((response) => response.data.userData as SiteUser)
							.catch((error) => {
								res.status(500).json({ error: "API: Fetching creator error!" });
								return;
							});

						if (!creatorData) {
							res.status(404).json({ error: "User not found" });
							return;
						}

						return {
							comment,
							creator: creatorData,
						};
					})
				);

				if (commentsData.length) {
					res.status(200).json({ comments: commentsData });
				} else {
					res.status(200).json({ comments: [] });
				}

				break;
			}

			case "PUT": {
				const { updatedComment } = req.body;

				if (!updatedComment) {
					res.status(500).json({ error: "No comment data provided" });
					return;
				}

				const updatedCommentState = await postCommentsCollection.updateOne(
					{
						id: updatedComment.id,
					},
					{
						$set: {
							...updatedComment,
						},
					}
				);

				res.status(200).json({ isUpdated: updatedCommentState.acknowledged });

				break;
			}

			default: {
				res.status(405).json({ error: "Method not allowed" });
				break;
			}
		}
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
}
