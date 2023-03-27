import { PostCreationModalState, errorModalState } from "@/atoms/modalAtom";
import { UserState } from "@/atoms/userAtom";
import { PollItem, SitePost } from "@/lib/interfaces/post";
import React, { useRef, useState } from "react";
import { FaEye, FaLock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { SetterOrUpdater, useSetRecoilState } from "recoil";
import { DropdownOption } from "../Controls/CustomDropdown";
import { MdPublic } from "react-icons/md";
import PostCreationModalFormHead from "./PostCreationModal/PostCreationModalFormHead";
import PostTab from "./PostCreationModal/PostCreationTabs/PostTab";
import PostCreationTabs from "./PostCreationModal/PostCreationTabs";
import usePost from "@/hooks/usePost";
import { FiLoader } from "react-icons/fi";

type PostCreationModalProps = {
	postCreationModalStateValue: PostCreationModalState;
	setPostCreationModalStateValue: SetterOrUpdater<PostCreationModalState>;
	userStateValue: UserState;
};

export type PostPollItemType = {
	postItemTitle: string;
	logoType?: PollItem["logoType"];
	emoji?: string;
	image?: {
		name: string;
		url: string;
		size: number;
		type: string;
		height: number;
		width: number;
	};
};

export type PostImageOrVideoType = {
	name: string;
	url: string;
	index: number;
	size: number;
	type: string;
	height: number;
	width: number;
};

export type PostFileType = {
	name: string;
	url: string;
	size: number;
	type: string;
};

export type PostLinkType = {
	linkTitle?: string;
	linkDescription?: string;
	url: string;
};

export type CreatePostType = {
	groupId?: SitePost["groupId"];
	creatorId?: SitePost["creatorId"];
	postTitle: SitePost["postTitle"];
	postBody: SitePost["postBody"];
	postTags: SitePost["postTags"];
	postType: SitePost["postType"];
	isCommentable: SitePost["isCommentable"];
	privacy: SitePost["privacy"];
	imageOrVideo: PostImageOrVideoType[];
	file: PostFileType[];
	link: PostLinkType[];
	poll: {
		pollTitle: string;
		pollDescription?: string;
		maxVotes?: number;
		isActive: boolean;
		postItems: PostPollItemType[];
	} | null;
};

export const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
export const validVideoTypes = ["video/mp4", "video/avi", "video/mov"];

export const postPrivacyOptions: DropdownOption[] = [
	{
		label: "Public",
		value: "public",
		icon: <MdPublic className="w-full h-full" />,
	},
	{
		label: "Restricted",
		value: "restricted",
		icon: <FaEye className="w-full h-full" />,
	},
	{
		label: "Private",
		value: "private",
		icon: <FaLock className="w-full h-full" />,
	},
];

const PostCreationModal: React.FC<PostCreationModalProps> = ({
	postCreationModalStateValue,
	setPostCreationModalStateValue,
	userStateValue,
}) => {
	const defaultCreatePostForm: CreatePostType = {
		postTitle: "",
		postBody: "",
		postTags: [],
		postType: postCreationModalStateValue.postType,
		isCommentable: true,
		privacy: "public",
		imageOrVideo: [],
		file: [],
		link: [],
		poll: null,
	};
	const { createPost } = usePost();
	const [createPostForm, setCreatePostForm] = useState<CreatePostType>(
		defaultCreatePostForm
	);
	const [creatingPost, setCreatingPost] = useState(false);
	const uploadImageOrVideoRef = useRef<HTMLInputElement>(null);
	const setErrorModalStateValue = useSetRecoilState(errorModalState);

	const handleCreatePostSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		setCreatingPost(true);
		try {
			await createPost(createPostForm, userStateValue.user)
				.then(() => {
					setCreatePostForm(defaultCreatePostForm);
					setPostCreationModalStateValue((prev) => ({
						...prev,
						open: false,
						postType: "feed",
						tab: "post",
					}));
				})
				.catch((error) => {
					console.log("Hook: Post Creation Error", error.message);
				});
		} catch (error: any) {
			console.log("Post Creation Error", error.message);
		}
		setCreatingPost(false);
	};

	const handleSelectPrivacy = (value: string) => {
		setCreatePostForm((prev) => ({
			...prev,
			privacy: value as CreatePostType["privacy"],
		}));
	};

	const handleClose = () => {
		setPostCreationModalStateValue((prev) => ({
			...prev,
			open: false,
			postType: "feed",
			tab: "post",
		}));
	};

	const handleFormTabChange = (tab: PostCreationModalState["tab"]) => {
		setPostCreationModalStateValue((prev) => ({
			...prev,
			tab,
		}));
	};

	const handleTextChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setCreatePostForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageOrVideoUpload = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.files?.length) {
			const imagesOrVideos = Array.from(event.target.files);

			imagesOrVideos.map((imageOrVideo) => {
				if (validateImageOrVideo(imageOrVideo)) {
					if (validImageTypes.includes(imageOrVideo.type)) {
						const reader = new FileReader();

						reader.onload = (readerEvent) => {
							const result = readerEvent.target?.result;

							if (result) {
								const img = new Image();

								img.onload = () => {
									const canvas = document.createElement("canvas");
									const ctx = canvas.getContext(
										"2d"
									) as CanvasRenderingContext2D;

									const height = img.height;
									const width = img.width;

									canvas.height = height;
									canvas.width = width;

									ctx.fillStyle = "#fff";
									ctx.fillRect(0, 0, width, height);

									ctx.drawImage(img, 0, 0, width, height);

									canvas.toBlob(
										(blob) => {
											if (blob) {
												setCreatePostForm((prev) => ({
													...prev,
													imageOrVideo: [
														...prev.imageOrVideo,
														{
															name: imageOrVideo.name,
															url: URL.createObjectURL(blob),
															index: prev.imageOrVideo.length,
															size: blob.size,
															type: blob.type,
															height: height,
															width: width,
														},
													],
												}));

												URL.revokeObjectURL(result as string);
											}
										},
										"image/jpeg",
										0.8
									);

									URL.revokeObjectURL(result as string);
									img.remove();
									canvas.remove();
									reader.abort();
								};

								img.src = result as string;
							} else {
								setErrorModalStateValue((prev) => ({
									...prev,
									open: true,
									view: "upload",
									message: "Image not loaded.",
								}));
							}
						};

						reader.readAsDataURL(imageOrVideo);
					} else if (validVideoTypes.includes(imageOrVideo.type)) {
						const reader = new FileReader();

						reader.onload = () => {
							const result = reader.result;

							if (result) {
								const blob = new Blob([result], {
									type: imageOrVideo.type || "video/mp4",
								});

								const video = document.createElement("video");

								video.onloadedmetadata = () => {
									setCreatePostForm((prev) => ({
										...prev,
										imageOrVideo: [
											...prev.imageOrVideo,
											{
												name: imageOrVideo.name,
												url: URL.createObjectURL(blob),
												index: prev.imageOrVideo.length,
												size: blob.size,
												type: blob.type,
												height: video.videoHeight,
												width: video.videoWidth,
											},
										],
									}));

									URL.revokeObjectURL(result as string);
									video.remove();
									reader.abort();
								};

								video.src = URL.createObjectURL(blob) as string;
							} else {
								setErrorModalStateValue((prev) => ({
									...prev,
									open: true,
									view: "upload",
									message: "Video not loaded.",
								}));
							}
						};

						reader.readAsArrayBuffer(imageOrVideo);
					} else {
						setErrorModalStateValue((prev) => ({
							...prev,
							open: true,
							view: "upload",
							message: "Invalid file type",
						}));
					}
				}
			});

			event.target.value = "";
		}
	};

	const validateImageOrVideo = (imageOrVideo: File) => {
		if (validImageTypes.includes(imageOrVideo.type)) {
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
		} else if (validVideoTypes.includes(imageOrVideo.type)) {
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
	};

	return (
		<div className="fixed w-full h-full bg-black bg-opacity-25 z-[1000] flex flex-col items-center px-8 py-16 overflow-y-auto scroll-y-style overflow-x-hidden">
			<div className="w-full max-w-xl bg-white flex flex-col rounded-xl shadow-around-lg pointer-events-auto">
				<div className="p-4 px-16 w-full rounded-t-xl flex flex-row justify-center items-center relative">
					<p className="font-bold text-lg text-black truncate">
						{postCreationModalStateValue.postType === "announcement" &&
							"Create Announcement"}
						{postCreationModalStateValue.postType === "feed" && "Create Post"}
						{postCreationModalStateValue.postType === "group" &&
							"Create Group Post"}
					</p>
					<button
						type="button"
						title="Close"
						className="h-8 w-8 aspect-square bg-gray-200 rounded-full p-1 text-gray-400 absolute top-[50%] right-4 translate-y-[-50%] hover:bg-red-100 hover:text-red-500"
						onClick={handleClose}
					>
						<IoClose className="h-full w-full" />
					</button>
				</div>
				<div className="h-[1px] bg-black bg-opacity-10"></div>
				<form
					className="post-creation-modal-form"
					onSubmit={handleCreatePostSubmit}
				>
					<PostCreationModalFormHead
						userStateValue={userStateValue}
						handleClose={handleClose}
						handleSelectPrivacy={handleSelectPrivacy}
						postType={postCreationModalStateValue.postType}
					/>
					<div className="post-creation-modal-form-content">
						<div className="post-creation-form-title-container">
							<textarea
								required
								name="postTitle"
								title="Post Title"
								placeholder="Title"
								className="post-creation-form-title-input-field"
								minLength={1}
								maxLength={300}
								onChange={(e) => {
									handleTextChange(e);
									e.currentTarget.style.height = "0px";
									e.currentTarget.style.height =
										e.currentTarget.scrollHeight + "px";
								}}
								rows={1}
								value={createPostForm.postTitle}
								disabled={creatingPost}
							/>
							<p
								className={`mt-auto text-2xs font-semibold
									${
										300 - createPostForm.postTitle.length === 0
											? "text-red-500"
											: "text-gray-400"
									}
								`}
							>
								{300 - createPostForm.postTitle.length}/300
							</p>
						</div>
						<div className="post-creation-form-pages">
							<div className="post-creation-form-body-container">
								<div
									className={`
									flex-1 h-full flex-row
									${postCreationModalStateValue.tab === "post" ? "flex" : "hidden"}
								`}
								>
									<PostTab
										handleTextChange={handleTextChange}
										createPostForm={createPostForm}
										creatingPost={creatingPost}
									/>
								</div>
								<div
									className={`
									flex-1 h-full flex-row
									${postCreationModalStateValue.tab === "image/video" ? "flex" : "hidden"}
								`}
								>
									<div className="post-creation-form-image-or-video-tab">
										<div className="image-or-video-tab-input-container">
											<div className="text-blue-500">
												<p>Drag and drop images or videos</p>
											</div>
											<div className="text-xs text-gray-500">
												<p>or</p>
											</div>
											<div>
												<button
													type="button"
													title="Upload Image or Video"
													className="page-button w-max h-max py-1.5 px-6 bg-transparent border-blue-500 text-blue-500 text-xs hover:bg-blue-50 focus:bg-blue-100 outline-none"
													onClick={() => uploadImageOrVideoRef.current?.click()}
												>
													Upload
												</button>
											</div>
										</div>
										<div className="image-or-video-tab-output-container"></div>
										<input
											type="file"
											title="Upload Image or Video"
											accept={validImageTypes.concat(validVideoTypes).join(",")}
											ref={uploadImageOrVideoRef}
											onChange={handleImageOrVideoUpload}
											max={20 - createPostForm.imageOrVideo.length}
											hidden
											multiple
										/>
									</div>
								</div>
							</div>
							<PostCreationTabs
								handleFormTabChange={handleFormTabChange}
								postCreationModalStateValue={postCreationModalStateValue}
							/>
						</div>
					</div>
					<div>
						<button
							type="submit"
							title={`${
								postCreationModalStateValue.postType === "announcement"
									? "Create an announcement"
									: postCreationModalStateValue.postType === "group"
									? "Create a group post"
									: "Create a post"
							}`}
							className="page-button h-max py-2 px-4 text-sm bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600 focus:bg-blue-600 focus:border-blue-600"
							disabled={!createPostForm.postTitle.trim() || creatingPost}
						>
							{!creatingPost ? (
								<>
									{postCreationModalStateValue.postType === "announcement" &&
										"Create Announcement"}
									{postCreationModalStateValue.postType === "feed" &&
										"Create Post"}
									{postCreationModalStateValue.postType === "group" &&
										"Create Group Post"}
								</>
							) : (
								<FiLoader className="h-5 w-5 text-white animate-spin" />
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PostCreationModal;
