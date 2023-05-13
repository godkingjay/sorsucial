import { GroupData } from "@/atoms/groupAtom";
import useGroup from "@/hooks/useGroup";
import useInput, { ImageOrVideoType } from "@/hooks/useInput";
import { validImageTypes } from "@/lib/types/validFiles";
import Link from "next/link";
import React, { useCallback, useRef, useState } from "react";
import { BsPersonBoundingBox, BsThreeDots } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { MdInsertPhoto } from "react-icons/md";

type GroupProfileMenuProps = {
	groupData: GroupData;
};

const GroupProfileMenu: React.FC<GroupProfileMenuProps> = ({ groupData }) => {
	const { groupOptionsStateValue, setGroupOptionsStateValue } = useGroup();

	const { uploadImageOrVideo } = useInput();

	const [uploadingPhoto, setUploadingPhoto] = useState(false);

	const uploadProfilePhotoRef = useRef<HTMLInputElement>(null);
	const uploadCoverPhotoRef = useRef<HTMLInputElement>(null);

	const handleGroupProfileMenu = () => {
		if (groupOptionsStateValue.menu === groupData.group.id) {
			setGroupOptionsStateValue((prev) => ({
				...prev,
				menu: "",
			}));
		} else {
			setGroupOptionsStateValue((prev) => ({
				...prev,
				menu: groupData.group.id,
			}));
		}
	};

	const handleUploadPhoto = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			try {
				if (!uploadingPhoto && event.target.files && event.target.files[0]) {
					setUploadingPhoto(true);
					const image = await uploadImageOrVideo(event.target.files[0]);

					if (image) {
					}

					setUploadingPhoto(false);
				}
			} catch (error: any) {
				console.log(
					`=>Hook: Hook Fetch Current User Data Error:\n${error.message}`
				);
				setUploadingPhoto(false);
			}
		},
		[uploadImageOrVideo, uploadingPhoto]
	);

	return (
		<>
			<div
				className="w-8 relative group"
				data-open={groupOptionsStateValue.menu === groupData.group.id}
			>
				<button
					type="button"
					title="User Menu"
					className="h-8 w-8 aspect-square rounded-full p-2 duration-100 text-gray-700 hover:bg-gray-100"
					onClick={handleGroupProfileMenu}
				>
					<BsThreeDots className="h-full w-full" />
				</button>
				<div
					className="
					z-[20] w-56 absolute bg-white rounded-md p-1 shadow-around-xl bottom-[110%] right-0 duration-100
					flex flex-col
					group-data-[open=true]:pointer-events-auto group-data-[open=true]:opacity-100 group-data-[open=true]:translate-y-0
					group-data-[open=false]:pointer-events-none group-data-[open=false]:opacity-0 group-data-[open=false]:translate-y-[8px]
				"
				>
					<button
						type="button"
						title="Change Profile Photo"
						className="user-menu-item"
						tabIndex={
							groupOptionsStateValue.menu === groupData.group.id ? 0 : -1
						}
						onClick={() =>
							!uploadingPhoto && uploadProfilePhotoRef.current?.click()
						}
					>
						<div className="icon-container">
							<BsPersonBoundingBox className="icon" />
						</div>
						<div className="label-container">
							<p className="label">Change Group Photo</p>
						</div>
					</button>
					<button
						type="button"
						title="Change Cover Photo"
						className="user-menu-item"
						tabIndex={
							groupOptionsStateValue.menu === groupData.group.id ? 0 : -1
						}
						onClick={() =>
							!uploadingPhoto && uploadCoverPhotoRef.current?.click()
						}
					>
						<div className="icon-container">
							<MdInsertPhoto className="icon" />
						</div>
						<div className="label-container">
							<p className="label">Change Cover Photo</p>
						</div>
					</button>
					<Link
						href={`/user/${groupData.group.id}/settings/`}
						title="Settings"
						className="user-menu-item"
						tabIndex={
							groupOptionsStateValue.menu === groupData.group.id ? 0 : -1
						}
					>
						<div className="icon-container">
							<IoSettingsOutline className="icon" />
						</div>
						<div className="label-container">
							<p className="label">Settings</p>
						</div>
					</Link>
				</div>
			</div>
			<input
				type="file"
				name="profile"
				title="Upload Photo"
				accept={validImageTypes.ext.join(",")}
				ref={uploadProfilePhotoRef}
				onChange={handleUploadPhoto}
				hidden
			/>
			<input
				type="file"
				name="cover"
				title="Upload Photo"
				accept={validImageTypes.ext.join(",")}
				ref={uploadCoverPhotoRef}
				onChange={handleUploadPhoto}
				hidden
			/>
		</>
	);
};

export default GroupProfileMenu;
