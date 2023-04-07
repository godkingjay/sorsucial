import { UserState } from "@/atoms/userAtom";
import React, { useEffect, useRef, useState } from "react";
import CommentBox from "./CommentBox";
import { PostState } from "@/atoms/postAtom";
import useComment from "@/hooks/useComment";
import PostCommentInputBoxSkeleton from "@/components/Skeleton/Post/PostComment.tsx/PostCommentInputBoxSkeleton";
import UserIcon from "@/components/Icons/UserIcon";
import Link from "next/link";

type PostCommentsProps = {
	userStateValue: UserState;
	userMounted: boolean;
	currentPost: PostState["currentPost"];
};

export type PostCommentFormType = {
	postId: string;
	groupId?: string;
	commentText: string;
	commentForId: string;
	commentLevel: number;
};

const PostComments: React.FC<PostCommentsProps> = ({
	userStateValue,
	userMounted,
	currentPost,
}) => {
	const [postCommentForm, setPostCommentForm] = useState<PostCommentFormType>({
		postId: currentPost?.post.id!,
		groupId: currentPost?.post.groupId,
		commentText: "",
		commentLevel: 0,
		commentForId: currentPost?.post.id!,
	});
	const { createComment, fetchComments } = useComment();
	const [creatingComment, setCreatingComment] = useState(false);
	const [firstLoadingComments, setFirstLoadingComments] = useState(false);
	const [loadingComments, setLoadingComments] = useState(true);
	const componentDidMount = useRef(false);

	const firstFetchComments = async () => {
		setFirstLoadingComments(true);
		await fetchPostComments();
		setFirstLoadingComments(false);
	};

	const fetchPostComments = async () => {
		setLoadingComments(true);
		try {
			if (currentPost) {
				await fetchComments({
					postId: currentPost.post.id,
					commentForId: currentPost.post.id,
				});
			}
		} catch (error: any) {
			console.log("Hook: Error while fetching post comments: ", error.message);
		}
		setLoadingComments(false);
	};

	const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (creatingComment) return;

		setCreatingComment(true);

		try {
			await createComment(postCommentForm, userStateValue.user);
			setPostCommentForm((prev) => ({
				...prev,
				commentText: "",
			}));
		} catch (error) {
			console.log("Hook: Error while creating comment: ", error);
		}

		setCreatingComment(false);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPostCommentForm((prev) => ({
			...prev,
			commentText: e.target.value,
		}));
	};

	useEffect(() => {
		if (userMounted && !componentDidMount.current) {
			componentDidMount.current = true;
			firstFetchComments();
		}
	}, [userMounted, componentDidMount.current]);

	return (
		<>
			<div className="h-[1px] bg-gray-200"></div>
			<div className="p-4 flex flex-col gap-y-4">
				{firstLoadingComments || !userMounted ? (
					<>
						<PostCommentInputBoxSkeleton />
					</>
				) : (
					<>
						<div className="flex flex-col gap-y-2">
							{currentPost?.postComments.map((comment) => (
								<React.Fragment key={comment.comment.id}>
									<div className="flex flex-row gap-x-2 w-full relative min-h-[40px]">
										<UserIcon user={comment.creator} />
										<div className="flex-1 flex flex-col gap-y-1">
											<div className="w-full flex-1 flex flex-row">
												<div className="bg-gray-100 w-fit py-2 rounded-[20px] px-4 text-sm flex flex-col gap-y-1">
													<h2 className="font-semibold text-xs truncate">
														{comment.creator ? (
															<Link
																href={`/user/${comment.creator.uid}`}
																className="inline hover:underline focus:underline"
															>
																{`${comment.creator.firstName} ${comment.creator.lastName}`}
															</Link>
														) : (
															<span>Unknown User</span>
														)}
													</h2>
													<p className="break-words">
														{comment.comment.commentText}
													</p>
												</div>
											</div>
										</div>
										<div className="absolute top-0 left-5 h-full w-max pt-12 translate-x-[-100%]">
											<div className="w-[2px] h-full bg-gray-500 bg-opacity-20"></div>
										</div>
									</div>
								</React.Fragment>
							))}
						</div>
						<CommentBox
							userStateValue={userStateValue}
							value={postCommentForm.commentText}
							onChange={handleInputChange}
							onSubmit={handleCommentSubmit}
							submitting={creatingComment}
						/>
					</>
				)}
			</div>
		</>
	);
};

export default PostComments;
