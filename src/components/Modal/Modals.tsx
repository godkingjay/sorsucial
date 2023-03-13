import React from "react";
import ErrorUpload from "./ErrorUploadModal";
import { useRecoilState } from "recoil";
import { errorUploadModalState } from "@/atoms/modalAtom";

type ModalsProps = {};

const Modals: React.FC<ModalsProps> = () => {
	const [errorUploadModal, setErrorUploadModal] = useRecoilState(
		errorUploadModalState
	);

	return (
		<>
			{errorUploadModal.open && (
				<ErrorUpload
					errorUploadModal={errorUploadModal}
					setErrorUploadModal={setErrorUploadModal}
				/>
			)}
		</>
	);
};

export default Modals;
