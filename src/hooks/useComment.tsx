import { PostCommentFormType } from "@/components/Post/PostCard/PostComment/PostComments";
import { CommentLike, PostComment } from "@/lib/interfaces/post";
import axios from "axios";
import { apiConfig } from "@/lib/api/apiConfig";
import { SiteUser } from "@/lib/interfaces/user";
import usePost from "./usePost";
import { PostCommentData, PostState } from "@/atoms/postAtom";
import useUser from "./useUser";

export type fetchCommentsParamsType = {
	postId: string;
	commentForId: string;
};

const useComment = () => {
	const { authUser, userStateValue } = useUser();
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
				.post(apiConfig.apiEndpoint + "post/comment/", {
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
						.put(apiConfig.apiEndpoint + "post/comment/", {
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
									userCommentLike: null,
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

	const deleteComment = async (comment: PostComment) => {
		try {
			if (
				authUser?.uid === comment.creatorId ||
				userStateValue.user.roles.includes("admin")
			) {
				const deleteState = await axios
					.delete(apiConfig.apiEndpoint + "post/comment/", {
						data: {
							deletedComment: comment,
						},
					})
					.then((response) => {
						return {
							isDeleted: response.data.isDeleted,
							deletedCount: response.data.deletedCount,
						};
					})
					.catch((error) => {
						throw new Error(
							"API: Error while deleting comment: ",
							error.message
						);
					});

				if (deleteState.deletedCount > 0) {
					setPostStateValue((prev) => ({
						...prev,
						posts: prev.posts?.map((post) => {
							if (post.post.id === comment.postId) {
								return {
									...post,
									post: {
										...post.post,
										numberOfComments:
											post.post.numberOfComments - deleteState.deletedCount,
										numberOfFirstLevelComments:
											comment.commentLevel === 0
												? post.post.numberOfFirstLevelComments - 1
												: post.post.numberOfFirstLevelComments,
									},
								};
							}
							return post;
						}),
						currentPost: {
							...prev.currentPost!,
							post: {
								...prev.currentPost!.post,
								numberOfComments:
									prev.currentPost!.post.numberOfComments -
									deleteState.deletedCount,
								numberOfFirstLevelComments:
									comment.commentLevel === 0
										? prev.currentPost!.post.numberOfFirstLevelComments - 1
										: prev.currentPost!.post.numberOfFirstLevelComments,
							},
							postComments: prev
								.currentPost!.postComments.map((commentData) => {
									if (commentData.comment.id === comment.commentForId) {
										return {
											...commentData,
											comment: {
												...commentData.comment,
												numberOfReplies:
													commentData.comment.numberOfReplies - 1,
											},
										};
									}

									return commentData;
								})
								.filter((commentData) => commentData.comment.id !== comment.id),
						},
					}));
				} else {
					throw new Error("Comment was not deleted!");
				}
			} else {
				throw new Error("You are not authorized to delete this comment!");
			}
		} catch (error: any) {
			console.log("MONGO: Error while deleting comment: ", error.message);
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

				const commentsData: PostCommentData[] = await axios
					.get(apiConfig.apiEndpoint + "post/comment/comments", {
						params: {
							getUserId: authUser?.uid,
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
					setPostStateValue(
						(prev) =>
							({
								...prev,
								currentPost: {
									...prev.currentPost!,
									postComments: [
										...prev.currentPost!.postComments,
										...commentsData,
									],
								},
							} as PostState)
					);
				} else {
					console.log("MONGO: No comments found!");
				}
			}
		} catch (error: any) {
			console.log("MONGO: Error while fetching comments: ", error.message);
		}
	};

	const fetchUserCommentLike = async (comment: PostComment) => {
		try {
			if (authUser) {
				const userCommentLikeData = await axios
					.get(apiConfig.apiEndpoint + "post/comment/like/", {
						params: {
							getPostId: comment.postId,
							getCommentId: comment.id,
							getUserId: authUser.uid,
						},
					})
					.then((response) => response.data.userCommentLike)
					.catch((error) => {
						throw new Error(
							"API: Error while fetching user comment like: ",
							error.message
						);
					});

				if (userCommentLikeData) {
					return userCommentLikeData;
				} else {
					return null;
				}
			} else {
				throw new Error("User not logged in!");
			}
		} catch (error: any) {
			console.log(
				"MONGO: Error while fetching user comment like: ",
				error.message
			);
			return null;
		}
	};

	const onCommentLike = async (commentData: PostCommentData) => {
		try {
			if (authUser) {
				if (commentData.userCommentLike) {
					await axios
						.delete(apiConfig.apiEndpoint + "post/comment/like/", {
							data: {
								deletePostId: commentData.userCommentLike.postId,
								deleteCommentId: commentData.userCommentLike.commentId,
								deleteUserId: commentData.userCommentLike.userId,
							},
						})
						.catch((error) => {
							throw new Error(
								"API: Error while deleting comment like: ",
								error.message
							);
						});

					setPostStateValue((prev) => ({
						...prev,
						currentPost: {
							...prev.currentPost!,
							postComments: prev.currentPost!.postComments.map((comment) => {
								if (comment.comment.id === commentData.comment.id) {
									return {
										...comment,
										comment: {
											...comment.comment,
											numberOfLikes: comment.comment.numberOfLikes - 1,
										},
										userCommentLike: null,
									};
								}
								return comment;
							}),
						},
					}));
				} else {
					// Create new comment like

					const userCommentLike: CommentLike = {
						userId: authUser.uid,
						postId: commentData.comment.postId,
						commentId: commentData.comment.id,
						createdAt: new Date(),
					};

					if (commentData.comment.groupId) {
						userCommentLike.groupId = commentData.comment.groupId;
					}

					await axios
						.post(apiConfig.apiEndpoint + "post/comment/like/", {
							newUserCommentLike: userCommentLike,
						})
						.catch((error) => {
							throw new Error(
								"API: Error while creating comment like: ",
								error.message
							);
						});

					setPostStateValue((prev) => ({
						...prev,
						currentPost: {
							...prev.currentPost!,
							postComments: prev.currentPost!.postComments.map((comment) => {
								if (comment.comment.id === commentData.comment.id) {
									return {
										...comment,
										comment: {
											...comment.comment,
											numberOfLikes: comment.comment.numberOfLikes + 1,
										},
										userCommentLike,
									};
								}
								return comment;
							}),
						},
					}));
				}
			} else {
				throw new Error("User not logged in!");
			}
		} catch (error: any) {
			console.log("MONGO: Error while liking comment: ", error.message);
		}
	};

	return {
		createComment,
		fetchComments,
		onCommentLike,
		deleteComment,
	};
};

export default useComment;
