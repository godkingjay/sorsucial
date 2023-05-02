import { validAllTypes } from "@/lib/types/validFiles";
import React from "react";
import PostFileCard from "./PostCards/PostFileCard";
import { SitePost } from "@/lib/interfaces/post";

type PostFilesProps = {
	postFiles: SitePost["postFiles"];
};

const PostFiles: React.FC<PostFilesProps> = ({ postFiles }) => {
	return (
		<div className="post-files-wrapper">
			<div className="post-files-header">
				<div className="divider"></div>
				<h2 className="text">Attached Files</h2>
			</div>
			<div className="post-files-container">
				{postFiles.map((file) => {
					const fileDetails =
						validAllTypes.find((type) => type.ext.includes(file.fileType)) ||
						null;

					return (
						<PostFileCard
							key={file.id}
							file={file}
							fileDetails={fileDetails}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default PostFiles;
