import { errorModalState } from "@/atoms/modalAtom";
import { validImageTypes, validVideoTypes } from "@/lib/types/validFiles";
import React, { useCallback } from "react";
import { useSetRecoilState } from "recoil";

export type ImageOrVideoType = {
	name: string;
	url: string;
	size: number;
	type: string;
	height: number;
	width: number;
};

const useInput = () => {
	const setErrorModalStateValue = useSetRecoilState(errorModalState);

	const validateImageOrVideo = useCallback(
		(imageOrVideo: File) => {
			if (validImageTypes.ext.includes(imageOrVideo.type)) {
				if (imageOrVideo.size > 1024 * 1024 * 2) {
					setErrorModalStateValue((prev) => ({
						...prev,
						open: true,
						view: "upload",
						message: "Image size should be less than 2MB",
					}));
					return false;
				}

				return true;
			} else if (validVideoTypes.ext.includes(imageOrVideo.type)) {
				if (imageOrVideo.size > 1024 * 1024 * 20) {
					setErrorModalStateValue((prev) => ({
						...prev,
						open: true,
						view: "upload",
						message: "Video size should be less than 20MB",
					}));
					return false;
				}

				return true;
			} else {
				setErrorModalStateValue((prev) => ({
					...prev,
					open: true,
					view: "upload",
					message: "Invalid file type",
				}));

				return false;
			}
		},
		[setErrorModalStateValue]
	);

	const uploadImageOrVideo = useCallback(
		async (file: File): Promise<ImageOrVideoType | null> => {
			if (!file || !validateImageOrVideo(file)) {
				return null;
			}

			if (validImageTypes.ext.includes(file.type)) {
				return new Promise((resolve) => {
					const reader = new FileReader();

					reader.onload = async (event) => {
						const result = event.target?.result as string;
						const img = new Image();

						img.onload = async () => {
							const canvas = document.createElement("canvas");
							const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

							const height = img.height;
							const width = img.width;

							canvas.height = height;
							canvas.width = width;

							ctx.fillStyle = "#fff";
							ctx.fillRect(0, 0, width, height);

							ctx.drawImage(img, 0, 0, width, height);

							canvas.toBlob(
								async (blob) => {
									if (blob) {
										const imageOrVideo: ImageOrVideoType = {
											name: file.name,
											url: URL.createObjectURL(blob),
											size: blob.size,
											type: blob.type,
											height,
											width,
										};
										resolve(imageOrVideo);
									}
								},
								"image/jpeg",
								0.8
							);

							URL.revokeObjectURL(result);
							img.remove();
							canvas.remove();
							reader.abort();
						};

						img.src = result;
					};

					reader.readAsDataURL(file);
				});
			} else if (validVideoTypes.ext.includes(file.type)) {
				return new Promise((resolve) => {
					const reader = new FileReader();

					reader.onload = () => {
						const result = reader.result as ArrayBuffer;
						const blob = new Blob([result], { type: file.type || "video/mp4" });
						const video = document.createElement("video");

						video.onloadedmetadata = () => {
							const imageOrVideo: ImageOrVideoType = {
								name: file.name,
								url: URL.createObjectURL(blob),
								size: blob.size,
								type: blob.type,
								height: video.videoHeight,
								width: video.videoWidth,
							};
							resolve(imageOrVideo);

							URL.revokeObjectURL(imageOrVideo.url);
							video.remove();
							reader.abort();
						};

						video.src = URL.createObjectURL(blob);
					};

					reader.readAsArrayBuffer(file);
				});
			}

			return null;
		},
		[validateImageOrVideo]
	);

	return {
		uploadImageOrVideo,
	};
};

export default useInput;
