import FileIcons from "@/components/Icons/FileIcons";
import { PostFile } from "@/lib/interfaces/post";
import React from "react";
import { HiOutlineDownload } from "react-icons/hi";

type PostFileCardProps = {
	file: PostFile;
	fileDetails: any | null;
	formatFileSize: (size: number) => string;
};

const PostFileCard: React.FC<PostFileCardProps> = ({
	file,
	fileDetails,
	formatFileSize,
}) => {
	return (
		<div
			className="post-file-item"
			file-type={fileDetails?.type || "file"}
		>
			<div className="deco-1"></div>
			<div className="logo-container">
				<FileIcons type={fileDetails ? fileDetails.type : ""} />
			</div>
			<div className="details-container">
				<div className="details-header">
					<h2 className="file-name">{file.fileTitle || file.fileName}</h2>
					<p className="extra">
						<span className="name">{file.fileName}</span>
						<span className="file-extra">
							<span className="size">{formatFileSize(file.fileSize)}</span>
							<span>•</span>
							<span className="extension">{file.fileExtension}</span>
						</span>
					</p>
				</div>
				<div className="buttons-container">
					<a
						download={file.fileName}
						href={file.fileUrl}
						target="_blank"
						title="Download"
						className="button download"
						rel="noopener"
					>
						<HiOutlineDownload className="icon" />
					</a>
				</div>
			</div>
		</div>
	);
};

export default PostFileCard;
