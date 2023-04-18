import { UserState } from "@/atoms/userAtom";
import UserIcon from "@/components/Icons/UserIcon";
import React from "react";
import { BiCommentDetail } from "react-icons/bi";

type ReplyBoxProps = {
	userStateValue: UserState;
};

const ReplyBox: React.FC<ReplyBoxProps> = ({ userStateValue }) => {
	return (
		<form
			className="w-full flex flex-col gap-y-2 entrance-animation-slide-from-right"
			// onSubmit={(event) => handleSubmit(event)}
		>
			<div className="flex flex-row min-h-[40px] gap-x-2 relative">
				<div className="flex flex-row relative">
					{/* {replyLevel > 0 && (
											<div className="-z-0 absolute h-10 w-10 top-0 left-0">
												<div className="h-8 w-[28px] absolute right-full bottom-[50%] -translate-x-[2px] border-2 border-gray-200 border-t-transparent border-r-transparent rounded-bl-2xl"></div>
											</div>
										)} */}
					<div className="z-0 h-10 w-10 flex flex-row">
						<UserIcon user={userStateValue.user} />
					</div>
				</div>
				<div className="flex-1 min-h-[40px] rounded-[20px] bg-gray-100 flex flex-col">
					<textarea
						name="replyText"
						id="replyText"
						rows={1}
						title="Reply"
						placeholder="What do you think about this topic?"
						maxLength={8000}
						className="w-full h-full resize-none outline-none bg-transparent py-2.5 px-4 min-h-[40px] text-sm"
						onChange={(event) => {
							// onChange(event, setCommentForm);
							event.currentTarget.style.height = "0px";
							event.currentTarget.style.height =
								event.currentTarget.scrollHeight + "px";
						}}
						// value={replyForm.replyText}
						// disabled={submitting}
						// ref={replyBoxRef}
					></textarea>
					<div className="flex flex-row items-center justify-end flex-wrap p-2">
						<button
							type="button"
							title="Create Reply"
							className="flex flex-row items-center gap-x-2 page-button w-max px-4 py-2 h-max text-xs ml-auto bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600"
							// disabled={
							// 	submitting || replyForm.replyText.length === 0
							// }
						>
							<div className="h-4 w-4 aspect-square">
								<BiCommentDetail className="h-full w-full" />
							</div>
							<div className="h-full flex flex-row items-center">
								<p>Create Reply</p>
							</div>
						</button>
					</div>
				</div>
			</div>
		</form>
	);
};

export default ReplyBox;
