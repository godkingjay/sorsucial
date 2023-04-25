import React from "react";

type PostDiscussionNotFoundProps = {
	type:
		| "user-post"
		| "announcement"
		| "group-post"
		| "discussion"
		| "group-discussion";
};

const PostDiscussionNotFound: React.FC<PostDiscussionNotFoundProps> = ({
	type,
}) => {
	return (
		<div className="flex flex-col items-center mx-4 my-8">
			<p>PostDiscussionNotFound</p>
		</div>
	);
};

export default PostDiscussionNotFound;
