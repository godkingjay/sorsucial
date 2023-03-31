import React from "react";
import {
	BsFileEarmarkArrowDownFill,
	BsFileEarmarkBinaryFill,
	BsFileEarmarkCodeFill,
	BsFileEarmarkMusicFill,
	BsFileEarmarkPdfFill,
	BsFileEarmarkPptFill,
	BsFileEarmarkRichtextFill,
	BsFileEarmarkSpreadsheetFill,
	BsFileEarmarkTextFill,
	BsFileEarmarkZipFill,
	BsFillDatabaseFill,
	BsFillFileEarmarkFill,
	BsFillFileEarmarkFontFill,
	BsFillFileEarmarkImageFill,
	BsFillFileEarmarkMedicalFill,
	BsFillFileEarmarkPlayFill,
	BsFillFileEarmarkPostFill,
} from "react-icons/bs";
import { IoDisc } from "react-icons/io5";
import { RiFileSettingsFill } from "react-icons/ri";

type FileIconsProps = {
	type: string;
};

const FileIcons: React.FC<FileIconsProps> = ({ type }) => {
	switch (type) {
		case "archive":
			return <BsFileEarmarkZipFill />;
			break;

		case "config":
			return <RiFileSettingsFill />;
			break;

		case "data":
			return <BsFileEarmarkBinaryFill />;
			break;

		case "database":
			return <BsFillDatabaseFill />;
			break;

		case "developer-files":
			return <BsFileEarmarkCodeFill />;
			break;

		case "disk-image":
			return <IoDisc />;
			break;

		case "document":
			return <BsFileEarmarkRichtextFill />;
			break;

		case "font":
			return <BsFillFileEarmarkFontFill />;
			break;

		case "html":
			return <BsFileEarmarkCodeFill />;
			break;

		case "image":
			return <BsFillFileEarmarkImageFill />;
			break;

		case "message":
			return <BsFillFileEarmarkMedicalFill />;
			break;

		case "music":
			return <BsFileEarmarkMusicFill />;
			break;

		case "page-layout":
			return <BsFillFileEarmarkPostFill />;
			break;

		case "pdf":
			return <BsFileEarmarkPdfFill />;
			break;

		case "presentation":
			return <BsFileEarmarkPptFill />;
			break;

		case "program":
			return <BsFileEarmarkArrowDownFill />;
			break;

		case "spreadsheet":
			return <BsFileEarmarkSpreadsheetFill />;
			break;

		case "text":
			return <BsFileEarmarkTextFill />;
			break;

		case "vector-image":
			return <BsFillFileEarmarkImageFill />;
			break;

		case "video":
			return <BsFillFileEarmarkPlayFill />;
			break;

		default:
			return <BsFillFileEarmarkFill />;
			break;
	}
};

export default FileIcons;
