import { UserState } from "@/atoms/userAtom";
import React from "react";
import { BiCommentDetail } from "react-icons/bi";
import { PostCommentFormType } from "./PostComments";
import UserIcon from "@/components/Icons/UserIcon";
import useUser from "@/hooks/useUser";

type CommentBoxProps = {
	commentForm: PostCommentFormType;
	setCommentForm: React.Dispatch<React.SetStateAction<PostCommentFormType>>;
	commentLevel: number;
	commentForId: string;
	submitting: boolean;
	commentBoxRef: React.RefObject<HTMLTextAreaElement>;
	setShowComments?: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: (
		event: React.FormEvent<HTMLFormElement>,
		commentForm: PostCommentFormType,
		setCommentForm: React.Dispatch<React.SetStateAction<PostCommentFormType>>,
		commentForId: string,
		commentLevel: number
	) => void;
	onChange: (
		event: React.ChangeEvent<HTMLTextAreaElement>,
		setCommentForm: React.Dispatch<React.SetStateAction<PostCommentFormType>>
	) => void;
};

const CommentBox: React.FC<CommentBoxProps> = ({
	commentForm,
	setCommentForm,
	commentLevel,
	commentForId,
	submitting,
	commentBoxRef,
	setShowComments,
	onChange,
	onSubmit,
}) => {
	const { userStateValue } = useUser();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit(event, commentForm, setCommentForm, commentForId, commentLevel);
		if (setShowComments) {
			setShowComments(true);
		}
	};

	return (
		<form
			className="w-full flex flex-col gap-y-2 entrance-animation-slide-from-right"
			onSubmit={(event) => handleSubmit(event)}
		>
			<div className="flex flex-row min-h-[40px] gap-x-2 relative">
				<div className="flex flex-row relative">
					{commentLevel > 0 && (
						<div className="-z-0 absolute h-10 w-10 top-0 left-0">
							<div className="h-8 w-[28px] absolute right-full bottom-[50%] -translate-x-[2px] border-2 border-gray-200 border-t-transparent border-r-transparent rounded-bl-2xl"></div>
						</div>
					)}
					<div className="z-0 h-10 w-10 flex flex-row">
						<UserIcon user={userStateValue.user} />
					</div>
				</div>
				<div className="flex-1 min-h-[40px] rounded-[20px] bg-gray-100 flex flex-col">
					<textarea
						name="commentText"
						id="commentText"
						rows={1}
						title="Comment"
						placeholder="Write a comment..."
						maxLength={8000}
						className="w-full h-full resize-none outline-none bg-transparent py-2.5 px-4 min-h-[40px] text-sm"
						onChange={(event) => {
							onChange(event, setCommentForm);
							event.currentTarget.style.height = "0px";
							event.currentTarget.style.height =
								event.currentTarget.scrollHeight + "px";
						}}
						value={commentForm.commentText}
						disabled={submitting}
						ref={commentBoxRef}
					></textarea>
					<div className="flex flex-row items-center justify-end flex-wrap p-2">
						<button
							type="submit"
							title="Create Comment"
							className="flex flex-row items-center gap-x-2 page-button w-max px-4 py-2 h-max text-xs ml-auto bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600"
							disabled={submitting || commentForm.commentText.length === 0}
						>
							<div className="h-4 w-4 aspect-square">
								<BiCommentDetail className="h-full w-full" />
							</div>
							<div className="hidden xs:flex h-full flex-row items-center">
								<p>Create Comment</p>
							</div>
						</button>
					</div>
				</div>
			</div>
		</form>
	);
};

export default CommentBox;
