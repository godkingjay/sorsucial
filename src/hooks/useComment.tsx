import { PostCommentFormType } from "@/components/Post/PostCard/PostComment/PostComments";
import { CommentLike, PostComment } from "@/lib/interfaces/post";
import axios from "axios";
import { apiConfig } from "@/lib/api/apiConfig";
import { SiteUser } from "@/lib/interfaces/user";
import usePost from "./usePost";
import { PostCommentData, PostState } from "@/atoms/postAtom";
import useUser from "./useUser";
import { useCallback } from "react";

export type fetchCommentsParamsType = {
	postId: string;
	commentForId: string;
};

const useComment = () => {
	const { authUser, userStateValue } = useUser();
	const { postStateValue, setPostStateValue, actionPostDeleted } = usePost();

	const actionCommentDelete = (commentDeleted: boolean, commentId: string) => {
		setPostStateValue(
			(prev) =>
				({
					...prev,
					currentPost: {
						...prev.currentPost!,
						postComments: prev.currentPost?.postComments?.map((comment) => {
							if (comment.comment.id === commentId) {
								return {
									...comment,
									commentDeleted,
								};
							}
							return comment;
						}),
					},
				} as PostState)
		);
	};

	/**
	 * *  ██████╗        ██████╗ ██████╗ ███╗   ███╗███╗   ███╗███████╗███╗   ██╗████████╗
	 * * ██╔════╝██╗    ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██╔════╝████╗  ██║╚══██╔══╝
	 * * ██║     ╚═╝    ██║     ██║   ██║██╔████╔██║██╔████╔██║█████╗  ██╔██╗ ██║   ██║
	 * * ██║     ██╗    ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║
	 * * ╚██████╗╚═╝    ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║███████╗██║ ╚████║   ██║
	 * *  ╚═════╝        ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
	 */
	/**
	 *
	 *
	 * @param {PostCommentFormType} commentForm
	 * @param {SiteUser} creator
	 */
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

			const { newComment: newCommentData }: { newComment: PostComment } =
				await axios
					.post(apiConfig.apiEndpoint + "/posts/comments/", {
						apiKey: userStateValue.api?.keys[0].key,
						commentData: newComment,
					})
					.then((res) => res.data)
					.catch((error) => {
						const { postDeleted, parentCommentDeleted, commentDeleted } =
							error.response.data;

						if (postDeleted) {
							actionPostDeleted(postDeleted, commentForm.postId);
						}

						if (parentCommentDeleted || commentDeleted) {
							actionCommentDelete(
								parentCommentDeleted || commentDeleted,
								commentForm.commentForId
							);
						}

						throw new Error(
							`=>API: Error while creating comment:\n${error.message}`
						);
					});

			if (newCommentData) {
				if (newCommentData.postId !== newCommentData.commentForId) {
					const commentFor = postStateValue.currentPost?.postComments.find(
						(comment) => comment.comment.id === newCommentData.commentForId
					)!;

					const updatedComment: Partial<PostComment> = {
						id: commentFor.comment.id,
						creatorId: commentFor.comment.creatorId,
						commentForId: commentFor.comment.commentForId,
						postId: newCommentData.postId,
						numberOfReplies: commentFor.comment.numberOfReplies! + 1,
					};

					const { isUpdated } = await axios
						.put(apiConfig.apiEndpoint + "/posts/comments/", {
							apiKey: userStateValue.api?.keys[0].key,
							commentData: updatedComment,
						})
						.then((response) => response.data)
						.catch((error) => {
							const { postDeleted, parentCommentDeleted } = error.response.data;

							if (postDeleted) {
								actionPostDeleted(postDeleted, commentFor.comment.postId);
							}

							if (parentCommentDeleted && !commentFor.commentDeleted) {
								actionCommentDelete(
									parentCommentDeleted,
									commentFor.comment.commentForId
								);
							}

							throw new Error(
								`=>API: Error while updating comment:\n${error.message}`
							);
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
									if (comment.comment.id === updatedComment.id) {
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
					currentPost:
						prev.currentPost && commentForm.postId === prev.currentPost.post.id
							? {
									...prev.currentPost!,
									postComments: [
										{
											comment: newCommentData,
											creator,
											userCommentLike: null,
										},
										...prev.currentPost!.postComments,
									],
							  }
							: prev.currentPost,
				}));
			}
		} catch (error: any) {
			console.log("MONGO: Error while creating comment: ", error.message);
		}
	};

	/**
	 * *  ██████╗██████╗        ██╗     ██╗██╗  ██╗███████╗
	 * * ██╔════╝██╔══██╗██╗    ██║     ██║██║ ██╔╝██╔════╝
	 * * ██║     ██║  ██║╚═╝    ██║     ██║█████╔╝ █████╗
	 * ! ██║     ██║  ██║██╗    ██║     ██║██╔═██╗ ██╔══╝
	 * ! ╚██████╗██████╔╝╚═╝    ███████╗██║██║  ██╗███████╗
	 * !  ╚═════╝╚═════╝        ╚══════╝╚═╝╚═╝  ╚═╝╚══════╝
	 */
	/**
	 *
	 *
	 * @param {PostCommentData} commentData
	 */
	const onCommentLike = async (commentData: PostCommentData) => {
		try {
			if (authUser) {
				const userCommentLikeCopy = commentData.userCommentLike;

				const resetCommentLike = () => {
					setPostStateValue(
						(prev) =>
							({
								...prev,
								currentPost: {
									...prev.currentPost!,
									postComments: prev.currentPost!.postComments.map((comment) => {
										if (comment.comment.id === commentData.comment.id) {
											return {
												...comment,
												comment: {
													...comment.comment,
													numberOfLikes: userCommentLikeCopy
														? comment.comment.numberOfLikes - 1
														: comment.comment.numberOfLikes + 1,
												},
												userCommentLike: userCommentLikeCopy,
											};
										}
										return comment;
									}),
								},
							} as PostState)
					);
				};

				if (commentData.userCommentLike) {
					setPostStateValue(
						(prev) =>
							({
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
													updatedAt: new Date().toISOString(),
												},
												userCommentLike: null,
											};
										}
										return comment;
									}),
								},
							} as PostState)
					);

					const { isDeleted } = await axios
						.delete(apiConfig.apiEndpoint + "/posts/comments/likes/", {
							data: {
								apiKey: userStateValue.api?.keys[0].key,
								postId: commentData.userCommentLike.postId,
								commentId: commentData.userCommentLike.commentId,
								userId: commentData.userCommentLike.userId,
							},
						})
						.then((response) => response.data)
						.catch((error) => {
							const { postDeleted, commentDeleted } = error.response.data;

							if (postDeleted) {
								actionPostDeleted(postDeleted, commentData.comment.postId);
							}

							if (commentDeleted) {
								actionCommentDelete(commentDeleted, commentData.comment.id);
							}

							resetCommentLike();

							throw new Error(
								"API: Error while deleting comment like: ",
								error.message
							);
						});

					if (!isDeleted) {
						resetCommentLike();
					}
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

					setPostStateValue(
						(prev) =>
							({
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
													updatedAt: new Date().toISOString(),
												},
												userCommentLike,
											};
										}
										return comment;
									}),
								},
							} as PostState)
					);

					await axios
						.post(apiConfig.apiEndpoint + "/posts/comments/likes/", {
							apiKey: userStateValue.api?.keys[0].key,
							commentLikeData: userCommentLike,
						})
						.catch((error) => {
							const { postDeleted, commentDeleted } = error.response.data;

							if (postDeleted) {
								actionPostDeleted(postDeleted, commentData.comment.postId);
							}

							if (commentDeleted) {
								actionCommentDelete(commentDeleted, commentData.comment.id);
							}

							resetCommentLike();

							throw new Error(
								"API: Error while creating comment like: ",
								error.message
							);
						});
				}
			} else {
				throw new Error("User not logged in!");
			}
		} catch (error: any) {
			console.log(`=>MONGO: Error while liking comment:\n${error.message}`);
		}
	};

	/**
	 * ^ ██████╗         ██████╗ ██████╗ ███╗   ███╗███╗   ███╗███████╗███╗   ██╗████████╗███████╗
	 * ^ ██╔══██╗██╗    ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██╔════╝████╗  ██║╚══██╔══╝██╔════╝
	 * ^ ██████╔╝╚═╝    ██║     ██║   ██║██╔████╔██║██╔████╔██║█████╗  ██╔██╗ ██║   ██║   ███████╗
	 * ^ ██╔══██╗██╗    ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║
	 * ^ ██║  ██║╚═╝    ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║███████╗██║ ╚████║   ██║   ███████║
	 * ^ ╚═╝  ╚═╝        ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
	 */
	/**
	 *
	 *
	 * @param {fetchCommentsParamsType} {
	 * 		postId,
	 * 		commentForId,
	 * 	}
	 */
	const fetchComments = useCallback(
		async ({ postId, commentForId }: fetchCommentsParamsType) => {
			try {
				if (!authUser) {
					throw new Error("You must be logged in to fetch comments!");
				}

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
						.get(apiConfig.apiEndpoint + "/posts/comments/comments", {
							params: {
								getUserId: authUser?.uid,
								getCommentPostId: postId,
								getCommentForId: commentForId,
								getFromLikes:
									oldestComment?.comment.numberOfLikes + 1 ||
									Number.MAX_SAFE_INTEGER,
								getFromReplies:
									oldestComment?.comment.numberOfReplies + 1 ||
									Number.MAX_SAFE_INTEGER,
								getFromDate:
									oldestComment?.comment.createdAt || new Date().toISOString(),
							},
						})
						.then((response) => {
							return response.data.comments;
						})
						.catch((error) => {
							throw new Error(
								`=>API: Error while fetching comments:\n${error.message}`
							);
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
				console.log(`MONGO: Error while fetching comments:\n${error.message}`);
			}
		},
		[authUser, postStateValue.currentPost, setPostStateValue]
	);

	/**
	 * ^ ██████╗        ██╗     ██╗██╗  ██╗███████╗
	 * ^ ██╔══██╗██╗    ██║     ██║██║ ██╔╝██╔════╝
	 * ^ ██████╔╝╚═╝    ██║     ██║█████╔╝ █████╗
	 * ^ ██╔══██╗██╗    ██║     ██║██╔═██╗ ██╔══╝
	 * ^ ██║  ██║╚═╝    ███████╗██║██║  ██╗███████╗
	 * ^ ╚═╝  ╚═╝       ╚══════╝╚═╝╚═╝  ╚═╝╚══════╝
	 */
	/**
	 *
	 *
	 * @param {PostComment} comment
	 * @return {*}
	 */
	const fetchUserCommentLike = async (comment: PostComment) => {
		try {
			if (authUser) {
				const userCommentLikeData = await axios
					.get(apiConfig.apiEndpoint + "/posts/comments/likes/", {
						params: {
							apiKey: userStateValue.api?.keys[0].key,
							postId: comment.postId,
							commentId: comment.id,
							userId: authUser.uid,
						},
					})
					.then((response) => response.data.userCommentLike)
					.catch((error) => {
						const { postDeleted, commentDeleted } = error.response.data;

						if (postDeleted) {
							actionPostDeleted(postDeleted, comment.postId);
						}

						if (commentDeleted) {
							actionCommentDelete(commentDeleted, comment.id);
						}

						throw new Error(
							`API: Error while fetching user comment like:\n${error.message}`
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
				`MONGO: Error while fetching user comment like:\n${error.message}`
			);
			return null;
		}
	};

	/**
	 * ! ██████╗         ██████╗ ██████╗ ███╗   ███╗███╗   ███╗███████╗███╗   ██╗████████╗
	 * ! ██╔══██╗██╗    ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██╔════╝████╗  ██║╚══██╔══╝
	 * ! ██║  ██║╚═╝    ██║     ██║   ██║██╔████╔██║██╔████╔██║█████╗  ██╔██╗ ██║   ██║
	 * ! ██║  ██║██╗    ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║
	 * ! ██████╔╝╚═╝    ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║███████╗██║ ╚████║   ██║
	 * ! ╚═════╝         ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
	 */
	/**
	 *
	 *
	 * @param {PostComment} comment
	 */
	const deleteComment = async (comment: PostComment) => {
		try {
			if (
				authUser?.uid === comment.creatorId ||
				userStateValue.user.roles.includes("admin")
			) {
				const { isDeleted, deletedCount } = await axios
					.delete(apiConfig.apiEndpoint + "/posts/comments/", {
						data: {
							apiKey: userStateValue.api?.keys[0].key,
							commentData: comment,
						},
					})
					.then((response) => response.data)
					.catch((error: any) => {
						const { postDeleted, commentDeleted } = error.response.data;

						if (postDeleted) {
							actionPostDeleted(postDeleted, comment.postId);
						}

						if (commentDeleted) {
							actionCommentDelete(commentDeleted, comment.id);
						}

						throw new Error(
							`=>API: Error while deleting comment:\n${error.message}`
						);
					});

				if (deletedCount > 0) {
					setPostStateValue((prev) => ({
						...prev,
						posts: prev.posts?.map((post) => {
							if (post.post.id === comment.postId) {
								return {
									...post,
									post: {
										...post.post,
										numberOfComments: post.post.numberOfComments - deletedCount,
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
									prev.currentPost!.post.numberOfComments - deletedCount,
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
												numberOfReplies: commentData.comment.numberOfReplies - 1,
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
			console.log(`=>MONGO: Error while deleting comment:\n${error.message}`);
		}
	};

	return {
		createComment,
		fetchComments,
		onCommentLike,
		fetchUserCommentLike,
		deleteComment,
	};
};

export default useComment;
