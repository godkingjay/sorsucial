import { DiscussionData, DiscussionOptionsState } from "@/atoms/discussionAtom";
import React from "react";
import { BsFacebook } from "react-icons/bs";
import { IoLinkOutline } from "react-icons/io5";
import { discussionShareType } from "../../DiscussionCard";
import useDiscussion from "@/hooks/useDiscussion";

type DiscussionShareMenuProps = {
	discussionData: DiscussionData;
	handleFooterShareClick: (type: discussionShareType) => void;
};

const DiscussionShareMenu: React.FC<DiscussionShareMenuProps> = ({
	discussionData,
	handleFooterShareClick,
}) => {
	const { discussionOptionsStateValue } = useDiscussion();

	return (
		<div
			className="discussion-footer-share-menu-wrapper"
			menu-open={
				discussionOptionsStateValue.share === discussionData.discussion.id
					? "true"
					: "false"
			}
		>
			<div className="discussion-footer-share-menu-container">
				<button
					type="button"
					title="Share to Facebook"
					className="rounded-full bg-gray-100 text-blue-500 h-10 w-10 aspect-square hover:text-blue-600 focus-within:text-blue-600"
					onClick={() =>
						discussionOptionsStateValue.share === discussionData.discussion.id &&
						handleFooterShareClick("facebook")
					}
					disabled={
						discussionOptionsStateValue.share !== discussionData.discussion.id
					}
				>
					<BsFacebook className="h-full w-full" />
				</button>
				<button
					type="button"
					title="Copy Link"
					className="rounded-full bg-gray-100 text-gray-500 h-10 w-10 aspect-square p-2 hover:bg-gray-200 focus-within:bg-gray-200"
					onClick={() =>
						discussionOptionsStateValue.share === discussionData.discussion.id &&
						handleFooterShareClick("copy")
					}
					disabled={
						discussionOptionsStateValue.share !== discussionData.discussion.id
					}
				>
					<IoLinkOutline className="h-full w-full" />
				</button>
			</div>
			<h2 className="absolute bottom-[100%] left-[50%] translate-x-[-50%] text-2xs font-bold w-max text-gray-500">
				Share To
			</h2>
		</div>
	);
};

export default DiscussionShareMenu;
