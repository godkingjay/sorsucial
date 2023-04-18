import { UserState } from "@/atoms/userAtom";
import React from "react";
import ReplyBox from "./ReplyBox";

type DiscussionRepliesProps = {
	userStateValue: UserState;
};

const DiscussionReplies: React.FC<DiscussionRepliesProps> = ({
	userStateValue,
}) => {
	return (
		<>
			<div className="h-[1px] bg-gray-200"></div>
			<div className="p-4 flex flex-col gap-y-4">
				<div className="flex flex-col gap-y-2">
					<ReplyBox userStateValue={userStateValue} />
				</div>
			</div>
		</>
	);
};

export default DiscussionReplies;
