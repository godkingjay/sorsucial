import React, { useRef } from "react";
import { HiOutlineUpload } from "react-icons/hi";
import Image from "next/image";
import { ImageOrVideoType } from "@/hooks/useInput";
import { validImageTypes } from "@/lib/types/validFiles";

type UploadImageSingleProps = {
	image: ImageOrVideoType | null;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const UploadImageSingle: React.FC<UploadImageSingleProps> = ({
	image,
	onChange,
}) => {
	const uploadImageRef = useRef<HTMLInputElement>(null);

	return (
		<div className="w-full flex flex-col items-center">
			<button
				type="button"
				title="Add Photo"
				className={`
          w-40 h-40 border-2 border-gray-500 z-20 rounded-full flex flex-col items-center justify-center text-xs text-gray-500 font-bold hover:text-blue-500 focus:text-blue-500 hover:border-blue-500 focus:border-blue-500 gap-y-2 relative
          ${image ? " border-solid" : " border-dashed"}
        `}
				onClick={() => uploadImageRef.current?.click()}
			>
				{image ? (
					<div className="-z-0 absolute right-0 top-[50%] translate-y-[-50%] h-full w-full grid place-items-center rounded-full overflow-hidden bg-gray-300">
						<Image
							src={image.url}
							alt="Profile Photo"
							width={256}
							height={256}
							className="object-cover h-full w-full"
						/>
					</div>
				) : (
					<>
						<div className="h-6 w-6 aspect-square">
							<HiOutlineUpload className="h-full w-full" />
						</div>
						<p>Upload Image</p>
					</>
				)}
			</button>
			<input
				required
				type="file"
				title="Profile Photo"
				ref={uploadImageRef}
				accept={validImageTypes.ext.join(",")}
				onChange={onChange}
				hidden
			/>
		</div>
	);
};

export default UploadImageSingle;
