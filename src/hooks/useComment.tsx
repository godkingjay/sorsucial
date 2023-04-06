import { PostCommentFormType } from "@/components/Post/PostCard/PostComment/PostComment";
import { PostComment } from "@/lib/interfaces/post";
import useUser from "./useUser";

const useComment = () => {
	const { userStateValue } = useUser();

	const createComment = async (comment: PostCommentFormType) => {
		try {
			if (userStateValue.user.uid) {
				const date = new Date();

				const newComment: PostComment = {
					id: "",
					postId: comment.postId,
					groupId: comment.groupId,
					creatorId: userStateValue.user.uid,
					commentText: comment.commentText,
					commentLevel: comment.commentLevel,
					commentForId: comment.commentForId,
					numberOfLikes: 0,
					numberOfReplies: 0,
					isHidden: false,
					updatedAt: date,
					createdAt: date,
				};
			}
		} catch (error: any) {
			console.log("MONGO: Error while creating comment: ", error.message);
		}
	};

	return {
		createComment,
	};
};

export default useComment;
