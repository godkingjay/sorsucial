import { PostCommentFormType } from "@/components/Post/PostCard/PostComment/PostComments";
import { PostComment } from "@/lib/interfaces/post";
import axios from "axios";
import { apiConfig } from "@/lib/api/apiConfig";
import { SiteUser } from "@/lib/interfaces/user";
import usePost from "./usePost";

export type fetchCommentsParamsType = {
	postId: string;
	commentForId: string;
};

const useComment = () => {
	const { postStateValue, setPostStateValue } = usePost();

	const createComment = async (
		commentForm: PostCommentFormType,
		creator: SiteUser
	) => {
		try {
			const commentDate = new Date();

			const newComment: PostComment = {
				id: "",
				postId: commentForm.postId,
				creatorId: creator.uid,
				commentText: commentForm.commentText,
				commentLevel: commentForm.commentLevel,
				commentForId: commentForm.commentForId,
				numberOfLikes: 0,
				numberOfReplies: 0,
				isHidden: false,
				updatedAt: commentDate,
				createdAt: commentDate,
			};

			if (commentForm.groupId) {
				newComment.groupId = commentForm.groupId;
			}

			const newCommentData: PostComment = await axios
				.post(apiConfig.apiEndpoint + "post/comment/comment", {
					newComment,
				})
				.then((res) => res.data.newComment)
				.catch((error) => {
					console.log("API: Error while creating comment: ", error.message);
				});

			if (newCommentData) {
				if (newCommentData.postId !== newCommentData.commentForId) {
					const updatedComment: Partial<PostComment> = {
						id: newCommentData.commentForId,
						numberOfReplies:
							postStateValue.currentPost?.postComments.find(
								(comment) => comment.comment.id === newCommentData.commentForId
							)?.comment.numberOfReplies! + 1,
					};

					const isUpdated = await axios
						.put(apiConfig.apiEndpoint + "post/comment/comment", {
							updatedComment,
						})
						.then((response) => response.data.isUpdated)
						.catch((error) => {
							console.log("API: Error while updating comment: ", error.message);
						});

					if (isUpdated) {
						if (newCommentData.commentLevel === 0) {
							setPostStateValue((prev) => ({
								...prev,
								currentPost: {
									...prev.currentPost!,
									post: {
										...prev.currentPost!.post,
										numberOfFirstLevelComments:
											prev.currentPost!.post.numberOfFirstLevelComments + 1,
									},
								},
							}));
						}

						setPostStateValue((prev) => ({
							...prev,
							currentPost: {
								...prev.currentPost!,
								postComments: prev.currentPost!.postComments.map((comment) => {
									if (comment.comment.id === newCommentData.commentForId) {
										return {
											...comment,
											comment: {
												...comment.comment,
												numberOfReplies: comment.comment.numberOfReplies + 1,
											},
										};
									}
									return comment;
								}),
							},
						}));
					}
				}

				if (postStateValue.currentPost?.post.id == newCommentData.postId) {
					setPostStateValue((prev) => ({
						...prev,
						currentPost: {
							...prev.currentPost!,
							post: {
								...prev.currentPost!.post,
								numberOfComments: prev.currentPost!.post.numberOfComments + 1,
							},
							postComments: [
								{
									comment: newCommentData,
									creator,
									commentLike: null,
								},
								...prev.currentPost!.postComments,
							],
						},
					}));
				}

				setPostStateValue((prev) => ({
					...prev,
					posts: prev.posts?.map((post) => {
						if (post.post.id === newCommentData.postId) {
							return {
								...post,
								post: {
									...post.post,
									numberOfComments: post.post.numberOfComments + 1,
								},
							};
						}
						return post;
					}),
				}));
			}
		} catch (error: any) {
			console.log("MONGO: Error while creating comment: ", error.message);
		}
	};

	const fetchComments = async ({
		postId,
		commentForId,
	}: fetchCommentsParamsType) => {
		try {
			if (postStateValue.currentPost !== null) {
				const lastIndex = postStateValue.currentPost.postComments.reduceRight(
					(acc, comment, index) => {
						if (comment.comment.commentForId === commentForId && acc === -1) {
							return index;
						}
						return acc;
					},
					-1
				);

				const oldestComment =
					postStateValue.currentPost.postComments[lastIndex];

				const commentsData = await axios
					.get(apiConfig.apiEndpoint + "post/comment/comment", {
						params: {
							getCommentPostId: postId,
							getCommentForId: commentForId,
							getFromLikes: oldestComment
								? oldestComment.comment.numberOfLikes + 1
								: Number.MAX_SAFE_INTEGER,
							getFromDate: oldestComment?.comment.createdAt,
						},
					})
					.then((response) => {
						return response.data.comments;
					})
					.catch((error) => {
						console.log("API: Error while fetching comments: ", error.message);
					});

				if (commentsData.length) {
					setPostStateValue((prev) => ({
						...prev,
						currentPost: {
							...prev.currentPost!,
							postComments: prev.currentPost!.postComments.concat(commentsData),
						},
					}));
				} else {
					console.log("MONGO: No comments found!");
				}
			}
		} catch (error: any) {
			console.log("MONGO: Error while fetching comments: ", error.message);
		}
	};

	return {
		createComment,
		fetchComments,
	};
};

export default useComment;
