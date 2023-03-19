import React from "react";
import ErrorUpload from "./ErrorUploadModal";
import { useRecoilState } from "recoil";
import { errorModalState } from "@/atoms/modalAtom";

type ModalsProps = {};

const Modals: React.FC<ModalsProps> = () => {
	const [errorModalStateValue, setErrorModalStateValue] =
		useRecoilState(errorModalState);

	return (
		<>
			{errorModalStateValue.open && errorModalStateValue.view === "upload" && (
				<ErrorUpload
					errorModalStateValue={errorModalStateValue}
					setErrorModalStateValue={setErrorModalStateValue}
				/>
			)}
		</>
	);
};

export default Modals;
