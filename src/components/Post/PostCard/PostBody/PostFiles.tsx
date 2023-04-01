import { PostData } from "@/atoms/postAtom";
import FileIcons from "@/components/Icons/FileIcons";
import { validAllTypes } from "@/lib/types/validFiles";
import React from "react";
import { HiDownload, HiOutlineDownload } from "react-icons/hi";

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
						<div
							className="post-file-item"
							key={file.id}
							file-type={fileDetails?.type || "file"}
						>
							<div className="deco-1"></div>
							<div className="logo-container">
								<FileIcons type={fileDetails ? fileDetails.type : ""} />
							</div>
							<div className="details-container">
								<div className="details-header">
									<h2 className="file-name">
										{file.fileTitle || file.fileName}
									</h2>
									<p className="extra">
										<span className="name">{file.fileName}</span>
										<span className="file-extra">
											<span className="size">
												{formatFileSize(file.fileSize)}
											</span>
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
				})}
			</div>
		</div>
	);
};

export default PostFiles;
