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
					creator,
				})
				.then((res) => res.data.newComment)
				.catch((error) => {
					console.log("API: Error while creating comment: ", error.message);
				});

			if (newCommentData) {
				if (postStateValue.currentPost?.post.id == newCommentData.postId) {
					setPostStateValue((prev) => ({
						...prev,
						currentPost: {
							...prev.currentPost!,
							post: {
								...prev.currentPost!.post,
								numberOfComments: prev.currentPost!.post.numberOfComments + 1,
							},
							postComments: prev.currentPost!.postComments.concat({
								comment: newCommentData,
								creator,
								commentLike: null,
							}),
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

	// const fetchComments = ({ postId, commentForId }) => {};

	return {
		createComment,
	};
};

export default useComment;
