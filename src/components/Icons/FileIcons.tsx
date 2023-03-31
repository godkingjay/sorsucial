import React from "react";
import { BsFileEarmarkPdfFill, BsFillFileEarmarkFill } from "react-icons/bs";

type FileIconsProps = {
	type: string;
};

const FileIcons: React.FC<FileIconsProps> = ({ type }) => {
	switch (type) {
		case "pdf":
			return <BsFileEarmarkPdfFill />;
			break;

		default:
			return <BsFillFileEarmarkFill />;
			break;
	}
};

export default FileIcons;
