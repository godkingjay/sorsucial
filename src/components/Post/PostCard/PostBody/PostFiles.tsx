import { PostData } from "@/atoms/postAtom";
import { validAllTypes } from "@/lib/types/validFiles";
import React from "react";
import PostFileCard from "./PostCards/PostFileCard";

type PostFilesProps = {
	postData: PostData;
	formatFileSize: (size: number) => string;
};

const PostFiles: React.FC<PostFilesProps> = ({ postData, formatFileSize }) => {
	return (
		<div className="post-files-wrapper">
			<div className="post-files-header">
				<div className="divider"></div>
				<h2 className="text">Attached Files</h2>
			</div>
			<div className="post-files-container">
				{postData.post.postFiles.map((file) => {
					const fileDetails =
						validAllTypes.find((type) => type.ext.includes(file.fileType)) ||
						null;

					return (
						<PostFileCard
							key={file.id}
							file={file}
							fileDetails={fileDetails}
							formatFileSize={formatFileSize}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default PostFiles;
