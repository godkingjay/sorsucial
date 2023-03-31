import React from "react";
import { CreatePostType, maxPostItems } from "../../PostCreationModal";
import { IoAdd } from "react-icons/io5";
import {
	validAllTypes,
	validArchiveTypes,
	validConfigTypes,
} from "@/lib/types/validFiles";
import { BsFileEarmark } from "react-icons/bs";
import Image from "next/image";
import FileIcons from "@/components/Icons/FileIcons";

type PostFilesTabProps = {
	createPostForm: CreatePostType;
	uploadFileRef: React.RefObject<HTMLInputElement>;
	handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const PostFilesTab: React.FC<PostFilesTabProps> = ({
	createPostForm,
	uploadFileRef,
	handleFileUpload,
}) => {
	return (
		<div className="post-creation-form-file-tab-container">
			<div className="post-file-tab-output-container">
				{createPostForm.files.map((file) => {
					const fileDetails =
						validAllTypes.find((type) => type.ext.includes(file.type)) || null;

					console.log(fileDetails);

					return (
						<div
							key={file.index}
							className="post-file-item"
							data-file-type={fileDetails?.type || "file"}
						>
							<div className="logo-container">
								{fileDetails ? <FileIcons type={fileDetails.type} /> : null}
							</div>
							<p className="text-sm text-gray-500">Drag and drop files</p>
						</div>
					);
				})}
			</div>
			<button
				type="button"
				title="Add File"
				className="flex flex-row items-center justify-center gap-x-2 border-2 border-dashed rounded-lg text-purple-500 border-purple-500 text-sm font-semibold py-2 px-6 relative overflow-hidden [&:hover>.deco]:w-full [&:focus-within>.deco]:w-full [&:hover>.deco]:rounded-r-none [&:focus-within>.deco]:rounded-r-none outline-none disabled:pointer-events-none disabled:grayscale"
				onClick={(event) =>
					event.currentTarget.disabled ? null : uploadFileRef.current?.click()
				}
				disabled={createPostForm.files.length >= maxPostItems.files}
			>
				<div className="deco -z-10 absolute h-full w-0 duration-500 ease-in-out top-0 left-0 bg-purple-100 rounded-r-full"></div>
				<div className="h-6 w-6">
					<IoAdd className="h-full w-full" />
				</div>
				<div className="h-full flex flex-row items-center">
					<p>Add File</p>
				</div>
			</button>
			<input
				type="file"
				title="Upload File"
				accept={validAllTypes.join(",")}
				ref={uploadFileRef}
				onChange={(event) =>
					event.currentTarget.disabled ? null : handleFileUpload(event)
				}
				max={maxPostItems.files - createPostForm.files.length}
				disabled={createPostForm.files.length >= maxPostItems.files}
				hidden
				multiple
			/>
		</div>
	);
};

export default PostFilesTab;
