import { ErrorUploadModal } from "@/atoms/modalAtom";
import React from "react";
import { AiFillFileExclamation } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { SetterOrUpdater } from "recoil";

type ErrorUploadProps = {
	errorUploadModal: ErrorUploadModal;
	setErrorUploadModal: SetterOrUpdater<ErrorUploadModal>;
};

const ErrorUpload: React.FC<ErrorUploadProps> = ({
	errorUploadModal,
	setErrorUploadModal,
}) => {
	const handleClose = () => {
		setErrorUploadModal({
			open: false,
			message: "",
		});
	};

	return (
		<div className="fixed w-full h-full bg-black bg-opacity-25 z-[1000] grid place-items-center px-8 py-16 overflow-y-auto scroll-y-style">
			<div className="w-full max-w-xl bg-white flex flex-col rounded-xl shadow-around-sm">
				<div className="bg-red-500 p-4 w-full rounded-t-xl flex flex-row justify-between items-center">
					<p className="font-bold text-lg text-white">Upload Error</p>
					<button
						type="button"
						title="Close"
						className="h-8 w-8 aspect-square rounded-full p-1 text-white hover:text-red-800 focus:text-red-800"
						onClick={handleClose}
					>
						<IoClose className="h-full w-full" />
					</button>
				</div>
				<div className="p-4 w-full">
					<div className="flex flex-row items-start gap-x-4 w-full p-4 border-2 border-red-500 border-dashed rounded-md">
						<div className="w-16 h-16 text-red-500">
							<AiFillFileExclamation className="h-full w-full" />
						</div>
						<p className="text-red-500 mt-4">{errorUploadModal.message}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ErrorUpload;
