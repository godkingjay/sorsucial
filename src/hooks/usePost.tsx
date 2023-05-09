import {
	PostData,
	PostState,
	postOptionsState,
	postState,
} from "@/atoms/postAtom";
import {
	CreatePostFileType,
	CreatePostImageOrVideoType,
	CreatePostType,
} from "@/components/Modal/PostCreationModal";
import { clientDb, clientStorage } from "@/firebase/clientApp";
import { apiConfig } from "@/lib/api/apiConfig";
import {
	PostFile,
	PostImageOrVideo,
	PostLike,
	PostLink,
	SitePost,
} from "@/lib/interfaces/post";
import axios from "axios";
import { useRecoilState } from "recoil";
import useUser from "./useUser";
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
import { collection, doc } from "firebase/firestore";
import { APIEndpointPostsParams, QueryPostsSortBy } from "@/lib/types/api";
import { useCallback, useState } from "react";
import useGroup from "./useGroup";
import { GroupState } from "@/atoms/groupAtom";

/**
 * ~ ██████╗  ██████╗ ███████╗████████╗    ██╗  ██╗ ██████╗  ██████╗ ██╗  ██╗
 * ~ ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝    ██║  ██║██╔═══██╗██╔═══██╗██║ ██╔╝
 * ~ ██████╔╝██║   ██║███████╗   ██║       ███████║██║   ██║██║   ██║█████╔╝
 * ~ ██╔═══╝ ██║   ██║╚════██║   ██║       ██╔══██║██║   ██║██║   ██║██╔═██╗
 * ~ ██║     ╚██████╔╝███████║   ██║       ██║  ██║╚██████╔╝╚██████╔╝██║  ██╗
 * ~ ╚═╝      ╚═════╝ ╚══════╝   ╚═╝       ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝
 */
/**
 * The usePost Hook is used to create, update, delete, and fetch posts.
 */
const usePost = () => {
	/**
	 * The postStateValue is the current post state.
	 *
	 * The setPostStateValue is the function to set the post state.
	 */
	const [postStateValue, setPostStateValue] = useRecoilState(postState);
	/**
	 * The postOptionsStateValue is the current post options state.
	 * This is used to show the post menus.
	 *
	 * The setPostOptionsStateValue is the function to set the post options state.
	 */
	const [postOptionsStateValue, setPostOptionsStateValue] =
		useRecoilState(postOptionsState);
	/**
	 * The authUser is the current authenticated user.
	 *
	 * The userStateValue is the current user state.
	 * It contains the current authenticated user and the current user's profile.
	 */
	const { authUser, userStateValue } = useUser();

	const { groupStateValue, setGroupStateValue } = useGroup();

	const [fetchingPostsFor, setFetchingPostsFor] = useState("");

	const actionPostDeleted = (postDeleted: boolean, postId: string) => {
		setPostStateValue((prev) => ({
			...prev,
			posts: prev.posts.map((post) => {
				if (post.post.id === postId) {
					return {
						...post,
						postDeleted,
					};
				}

				return post;
			}),
			currentPost:
				prev.currentPost?.post.id === postId
					? {
							...prev.currentPost,
							postDeleted,
					  }
					: prev.currentPost,
		}));
	};

	/**
	 * *  ██████╗           ██████╗  ██████╗ ███████╗████████╗
	 * * ██╔════╝    ██╗    ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
	 * * ██║         ╚═╝    ██████╔╝██║   ██║███████╗   ██║
	 * * ██║         ██╗    ██╔═══╝ ██║   ██║╚════██║   ██║
	 * * ╚██████╗    ╚═╝    ██║     ╚██████╔╝███████║   ██║
	 * *  ╚═════╝           ╚═╝      ╚═════╝ ╚══════╝   ╚═╝
	 */

	/**
	 * The createPost function is used to create a new post.
	 * It takes in the post form and the creator.
	 *
	 * The post is created in the database and the storage.
	 *
	 * @param {CreatePostType} postForm
	 * @param {SiteUser} creator
	 */
	const createPost = async (postForm: CreatePostType) => {
		/**
		 * Try and catch block to create a new post.
		 */
		try {
			/**
			 * The postDate is the current date.
			 * This is used to set the post's created and updated date.
			 */
			const postDate = new Date();

			/**
			 * The newPost is the new post to be created.
			 *
			 * This is the document that will be created in the database.
			 * It is of the SitePost interface.
			 */
			const newPost: SitePost = {
				id: "",
				creatorId: userStateValue.user.uid,
				privacy: postForm.privacy,
				postTitle: postForm.postTitle.trim(),
				postBody: postForm.postBody?.trim(),
				postType: postForm.postType,
				postTags: postForm.postTags,
				postImagesOrVideos: [],
				postFiles: [],
				postLinks: [],
				postPoll: null,
				numberOfLikes: 0,
				numberOfComments: 0,
				numberOfFirstLevelComments: 0,
				isHidden: false,
				isCommentable: postForm.isCommentable,
				updatedAt: postDate,
				createdAt: postDate,
			};

			/**
			 * If the post is a group post, then set the groupId.
			 */
			if (postForm.groupId) {
				newPost.groupId = postForm.groupId;
			}

			/**
			 * Try creating the post in the database.
			 */
			const newPostData: SitePost = await axios
				.post(apiConfig.apiEndpoint + "/posts/", {
					apiKey: userStateValue.api?.keys[0].key,
					postData: newPost,
					creator: userStateValue.user,
				})
				.then((res) => res.data.newPost)
				.catch((error) => {
					throw new Error("API: Post Creation Error:\n" + error.message);
				});

			/**
			 * If the post is created successfully then proceed.
			 */
			if (newPostData) {
				/**
				 * If the post has images or videos, then upload them.
				 *
				 * The postImagesOrVideos is the array of images or videos to be uploaded.
				 */
				if (postForm.imagesOrVideos.length) {
					await Promise.all(
						/**
						 * Map through the postImagesOrVideos array.
						 *
						 * For each image or video, upload it.
						 */
						postForm.imagesOrVideos.map(async (imageOrVideo) => {
							/**
							 * The postImageOrVideoRef is the reference to the image or video in the storage.
							 */
							const postImageOrVideoRef = doc(
								collection(clientDb, `posts/${newPostData.id}/imagesOrVideos`)
							);

							/**
							 * The postImageOrVideo is the image or video to be uploaded.
							 *
							 * This is the document that will be created in the database.
							 *
							 * It is of the PostImageOrVideo interface.
							 */
							const postImageOrVideo = await uploadPostImageOrVideo(
								newPostData,
								imageOrVideo,
								postImageOrVideoRef.id
							).catch((error: any) => {
								throw new Error(
									"Hook: Upload Image Or Video Error:\n" + error.message
								);
							});

							/**
							 * If the image or video is uploaded successfully, then add it to the postImagesOrVideos array.
							 *
							 * This is used to update the recoil state.
							 */
							if (postImageOrVideo) {
								newPostData.postImagesOrVideos.push(postImageOrVideo);
							}
						})
					).then(async () => {
						/**
						 * After all the images or videos are uploaded, then update the postImagesOrVideos array in the database.
						 */
						await axios
							.put(apiConfig.apiEndpoint + "/posts/", {
								apiKey: userStateValue.api?.keys[0].key,
								postData: {
									...newPostData,
									updatedAt: new Date(),
								},
							})
							.catch((error) => {
								throw new Error(
									"API: Post Update Images Or Videos Error:\n" + error.message
								);
							});
					});
				}

				/**
				 * If the post has files, then upload them.
				 *
				 * The postFiles is the array of files to be uploaded.
				 *
				 * The postFiles array is of the PostFile interface.
				 */
				if (postForm.files.length) {
					await Promise.all(
						postForm.files.map(async (file) => {
							/**
							 * The postFileRef is the reference to the file in the storage.
							 */
							const postFileRef = doc(
								collection(clientDb, `posts/${newPostData.id}/files`)
							);

							/**
							 * The postFile is the file to be uploaded.
							 *
							 * This is the document that will be created in the database.
							 */
							const postFile = await uploadPostFile(
								newPostData,
								file,
								postFileRef.id
							).catch((error: any) => {
								throw new Error("Hook: Upload File Error:\n" + error.message);
							});

							/**
							 * If the file is uploaded successfully, then add it to the postFiles array.
							 *
							 * This is used to update the recoil state.
							 */
							if (postFile) {
								newPostData.postFiles.push(postFile);
							}
						})
					).then(async () => {
						/**
						 * After all the files are uploaded, then update the postFiles array in the database.
						 */
						await axios
							.put(apiConfig.apiEndpoint + "/posts/", {
								apiKey: userStateValue.api?.keys[0].key,
								postData: {
									...newPostData,
									updatedAt: new Date(),
								},
							})
							.catch((error) => {
								throw new Error("API: Post Files Error:\n" + error.message);
							});
					});
				}

				/**
				 * If the post has links, then add them to the post document.
				 *
				 * The postLinks is the array of links to be added.
				 */
				if (postForm.links.length) {
					postForm.links.map((link) => {
						/**
						 * The postLinkId is the reference to the link in the database.
						 */
						const postLinkId = doc(
							collection(clientDb, `posts/${newPostData.id}/links`)
						);

						/**
						 * The newPostLink is the link to be added.
						 */
						const date = new Date();

						/**
						 * The newPostLink is the link to be added.
						 */
						const newPostLink: PostLink = {
							id: postLinkId.id,
							postId: newPostData.id,
							index: link.index,
							url: link.url,
							blocked: false,
							updatedAt: date,
							createdAt: date,
						};

						/**
						 * Add the newPostLink to the postLinks array.
						 *
						 * This is used to update the recoil state.
						 */
						newPostData.postLinks.push(newPostLink);
					});

					/**
					 * After all the links are added, then update the postLinks array in the database.
					 */
					await axios
						.put(apiConfig.apiEndpoint + "/posts/", {
							apiKey: userStateValue.api?.keys[0].key,
							postData: {
								...newPostData,
								updatedAt: new Date(),
							},
						})
						.catch((error) => {
							throw new Error("API: Post Links Error:\n" + error.message);
						});
				}

				if (postForm.poll) {
				}

				function createPostIndex() {
					const index = {
						newest: 0,
						["latest" +
						(newPostData.postType ? `-${newPostData.postType}` : "") +
						(newPostData.privacy ? `-${newPostData.privacy}` : "") +
						(newPostData.groupId ? `-${newPostData.groupId}` : "")]: 0,
						["latest" +
						(newPostData.postType ? `-${newPostData.postType}` : "") +
						(newPostData.privacy ? `-${newPostData.privacy}` : "") +
						(newPostData.groupId ? `-${newPostData.groupId}` : "") +
						(newPostData.postType === "announcement" ? "-sorsu" : "")]: 0,
						["latest" +
						(newPostData.postType ? `-${newPostData.postType}` : "") +
						(newPostData.privacy ? `-${newPostData.privacy}` : "") +
						(newPostData.groupId ? `-${newPostData.groupId}` : "") +
						(newPostData.creatorId
							? `-${
									newPostData.postType === "announcement"
										? "sorsu"
										: newPostData.creatorId
							  }`
							: "") +
						(newPostData.postType === "announcement" ? "-sorsu" : "")]: 0,
					};
					return index;
				}

				/**
				 * Update the post in the recoil state.
				 *
				 * The post is added to the top of the posts array.
				 *
				 * This is done so that the post is displayed at the top of the posts list.
				 */
				setPostStateValue(
					(prev) =>
						({
							...prev,
							posts: [
								{
									post: {
										...newPostData,
										updatedAt: new Date().toISOString(),
									},
									creator: userStateValue.user,
									index: createPostIndex(),
								},
								...prev.posts,
							],
						} as PostState)
				);

				if (newPostData.groupId) {
					setGroupStateValue((prev) => ({
						...prev,
						groups: prev.groups.map((group) => {
							if (group.group.id === newPostData.groupId) {
								return {
									...group,
									group: {
										...group.group,
										numberOfPosts: group.group.numberOfPosts + 1,
									},
								};
							}

							return group;
						}),
						currentGroup:
							prev.currentGroup &&
							prev.currentGroup?.group.id === newPostData.groupId
								? {
										...prev.currentGroup,
										group: {
											...prev.currentGroup.group,
											numberOfPosts: prev.currentGroup.group.numberOfPosts + 1,
										},
								  }
								: prev.currentGroup,
					}));
				}
			}
		} catch (error: any) {
			console.log("MONGO: Post Creation Error", error.message);
		}
	};

	/**
	 * *  ██████╗           ██╗███╗   ███╗ █████╗  ██████╗ ███████╗     ██████╗ ██████╗     ██╗   ██╗██╗██████╗ ███████╗ ██████╗
	 * * ██╔════╝    ██╗    ██║████╗ ████║██╔══██╗██╔════╝ ██╔════╝    ██╔═══██╗██╔══██╗    ██║   ██║██║██╔══██╗██╔════╝██╔═══██╗
	 * * ██║         ╚═╝    ██║██╔████╔██║███████║██║  ███╗█████╗      ██║   ██║██████╔╝    ██║   ██║██║██║  ██║█████╗  ██║   ██║
	 * * ██║         ██╗    ██║██║╚██╔╝██║██╔══██║██║   ██║██╔══╝      ██║   ██║██╔══██╗    ╚██╗ ██╔╝██║██║  ██║██╔══╝  ██║   ██║
	 * * ╚██████╗    ╚═╝    ██║██║ ╚═╝ ██║██║  ██║╚██████╔╝███████╗    ╚██████╔╝██║  ██║     ╚████╔╝ ██║██████╔╝███████╗╚██████╔╝
	 * *  ╚═════╝           ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝     ╚═════╝ ╚═╝  ╚═╝      ╚═══╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝
	 */

	/**
	 * The uploadPostImageOrVideo function is used to upload an image or video to the storage.
	 *
	 * This function is used to upload the images or videos that are added to the post.
	 * It will automatically upload the image or video to the storage and then add the image or video details
	 * as an object array item in the post document.
	 *
	 * @param {SitePost} post - The post to which the image or video belongs to
	 * @param {CreatePostImageOrVideoType} imageOrVideo - The type of image or video to upload to the storage (image or video)
	 * @param {string} imageOrVideoId - The id of the image or video to upload to the storage
	 *
	 * @returns {Promise<PostImageOrVideo | PostImageOrVideo | undefined>} - The uploaded image or video object or undefined if there is an error uploading the image or video to the storage.
	 */
	const uploadPostImageOrVideo = async (
		post: SitePost,
		imageOrVideo: CreatePostImageOrVideoType,
		imageOrVideoId: string
	) => {
		/**
		 * Try to upload the image or video to the storage.
		 * If there is an error, then log the error.
		 */
		try {
			/**
			 * The storageRef is the reference to the image or video in the storage.
			 *
			 * The image or video will be stored in the storage in the following path:
			 *
			 * https://storage
			 * 	      	/posts
			 * 	      		/postId
			 * 	      			/imagesOrVideos
			 * 	      				/imageOrVideoId
			 *
			 */
			const storageRef = ref(
				clientStorage,
				`posts/${post.id}/imagesOrVideos/${imageOrVideoId}`
			);

			/**
			 * Fetch the image or video from the url.
			 */
			const response = await fetch(imageOrVideo.url as string);

			/**
			 * Convert the image or video to a blob.
			 */
			const blob = await response.blob();

			/**
			 * After fetching the image or video from the url,
			 * then upload the image or video to the storage.
			 *
			 * The uploadBytes function is used to upload the image or video to the storage.
			 *
			 * The image or video will be uploaded to the storage in the following path:
			 *
			 * https://storage
			 * 	      	/posts
			 * 	      		/postId
			 * 	      			/imagesOrVideos
			 * 	      				/imageOrVideoId
			 *
			 * If there is an error, then log the error.
			 */
			await uploadBytes(storageRef, blob).catch((error: any) => {
				throw new Error(
					"Firebase Storage: Image Or Video Upload Error:\n" + error.message
				);
			});

			/**
			 * After uploading the image or video to the storage,
			 * then get the download url of the image or video.
			 * The url will be used to display the image or video in the post.
			 *
			 * If there is an error, then log the error.
			 */
			const downloadURL = await getDownloadURL(storageRef).catch(
				(error: any) => {
					throw new Error(
						"Firebase Storage: Image Or Video Download URL Error:\n" +
							error.message
					);
				}
			);

			/**
			 * After getting the download url of the image or video,
			 * then add the image or video details to the database.
			 */
			const date = new Date();

			/**
			 * The newPostImageOrVideo is the image or video to be added.
			 *
			 * The image or video will be stored in the database in the following path:
			 *
			 * https://
			 * 		database
			 * 			/posts
			 * 				/postId
			 * 					/imagesOrVideos
			 * 						/imageOrVideoId
			 *
			 */
			const newPostImageOrVideo: PostImageOrVideo = {
				id: imageOrVideoId,
				postId: post.id,
				index: imageOrVideo.index,
				height: imageOrVideo.height,
				width: imageOrVideo.width,
				fileTitle: imageOrVideo.fileTitle,
				fileDescription: imageOrVideo.fileDescription,
				fileName: imageOrVideo.name,
				fileType: imageOrVideo.type,
				filePath: storageRef.fullPath,
				fileUrl: downloadURL,
				fileExtension: imageOrVideo.name.split(".").pop() as string,
				fileSize: imageOrVideo.size,
				updatedAt: date,
				createdAt: date,
			};

			/**
			 * After successfully uploading the image or video to the storage and creating the image or video details,
			 * return the image or video details.
			 */
			return newPostImageOrVideo;
		} catch (error: any) {
			console.log("Firebase: Image Or Video Upload Error:\n", error.message);
		}
	};

	/**
	 * *  ██████╗           ███████╗██╗██╗     ███████╗
	 * * ██╔════╝    ██╗    ██╔════╝██║██║     ██╔════╝
	 * * ██║         ╚═╝    █████╗  ██║██║     █████╗
	 * * ██║         ██╗    ██╔══╝  ██║██║     ██╔══╝
	 * * ╚██████╗    ╚═╝    ██║     ██║███████╗███████╗
	 * *  ╚═════╝           ╚═╝     ╚═╝╚══════╝╚══════╝
	 */
	/**
	 * The uploadPostFile function is used to upload a file to the storage.
	 *
	 * This function is used to upload the files that are added to the post.
	 * It will automatically upload the file to the storage and then add the
	 * file details to the post document as an object array item.
	 *
	 * @param {SitePost} post
	 * @param {CreatePostFileType} file
	 * @param {string} fileId
	 *
	 * @returns {Promise<PostFile | undefined>} - The uploaded file object or undefined if there is an error uploading the file to the storage.
	 */
	const uploadPostFile = async (
		post: SitePost,
		file: CreatePostFileType,
		fileId: string
	) => {
		/**
		 * Try to upload the file to the storage.
		 *
		 * If there is an error uploading the file to the storage,
		 * then log the error.
		 */
		try {
			/**
			 * The storageRef is the reference to the file in the storage.
			 *
			 * The file will be stored in the storage in the following path:
			 *
			 * https://storage
			 * 	      	/posts
			 * 	      		/postId
			 * 	      			/files
			 * 	      				/fileId
			 */
			const fileExtension = file.name.slice(file.name.lastIndexOf("."));
			const fileNameWithoutExtension = file.name.slice(
				0,
				file.name.lastIndexOf(".")
			);
			const storageRef = ref(
				clientStorage,
				`posts/${post.id}/files/${fileNameWithoutExtension}-${fileId}${fileExtension}`
			);

			/**
			 * Fetch the file from the url.
			 */
			const response = await fetch(file.url as string);

			/**
			 * Convert the file to a blob.
			 */
			const blob = await response.blob();

			/**
			 * After fetching the file from the url,
			 * then upload the file to the storage.
			 *
			 * The file will be stored in the storage in the following path:
			 *
			 * https://storage
			 * 	      	/posts
			 * 						/postId
			 * 							/files
			 * 								/fileId
			 *
			 * If there is an error, then throw an error.
			 */
			await uploadBytes(storageRef, blob).catch((error: any) => {
				throw new Error("Firebase Storage: File Upload Error: ", error.message);
			});

			/**
			 * After uploading the file to the storage,
			 * then get the download url of the file.
			 *
			 * If there is an error, then throw an error.
			 */
			const downloadURL = await getDownloadURL(storageRef).catch(
				(error: any) => {
					throw new Error(
						"Firebase Storage: file Download URL Error: ",
						error.message
					);
				}
			);

			/**
			 * The date and time of the file upload.
			 */
			const date = new Date();

			/**
			 * This is the file object to be added as an object array item of the post document in the database.
			 */
			const newPostFile: PostFile = {
				id: fileId,
				postId: post.id,
				index: file.index,
				fileTitle: file.fileTitle ? file.fileTitle : file.name,
				fileDescription: file.fileDescription,
				fileName: file.name,
				fileType: file.type,
				filePath: storageRef.fullPath,
				fileUrl: downloadURL,
				fileExtension: file.name.split(".").pop() as string,
				fileSize: file.size,
				updatedAt: date,
				createdAt: date,
			};

			/**
			 * After successfully uploading the file to the storage and creating the file details,
			 * return the file details.
			 */
			return newPostFile;
		} catch (error: any) {
			console.log("MONGO: File Upload Error", error.message);
		}
	};

	/**
	 * *  ██████╗██████╗            ██╗     ██╗██╗  ██╗███████╗
	 * * ██╔════╝██╔══██╗    ██╗    ██║     ██║██║ ██╔╝██╔════╝
	 * * ██║     ██║  ██║    ╚═╝    ██║     ██║█████╔╝ █████╗
	 * ! ██║     ██║  ██║    ██╗    ██║     ██║██╔═██╗ ██╔══╝
	 * ! ╚██████╗██████╔╝    ╚═╝    ███████╗██║██║  ██╗███████╗
	 * !  ╚═════╝╚═════╝            ╚══════╝╚═╝╚═╝  ╚═╝╚══════╝
	 */
	/**
	 * The onPostLike function is used to like or unlike posts.
	 *
	 * This function will do two things depending on the sceneraio:
	 *
	 * @scenario01 - New Like
	 *
	 * If the user likes the post, then this function will create a new like.
	 * A new post-like document will be created in the database and the following will be updated:
	 * - The post document will be updated with the new like.
	 *
	 * Consequently, the recoil state postStateValue will also be updated with the new like.
	 *
	 * @scenario02 - Unlike
	 *
	 * If the user has an existing like, then this function will delete the like.
	 * The post-like document will be deleted from the database and the following will be updated:
	 * - The post document will be updated with the deleted like.
	 *
	 * Consequently, the recoil state postStateValue will also be updated with the deleted like.
	 *
	 * @param {PostData} postData - This is the data of the post being liked.
	 */
	const onPostLike = async (postData: PostData) => {
		/**
		 * Try liking or unliking the post.
		 *
		 * If there is an error, then log the error.
		 */
		try {
			if (authUser) {
				const previousUserLike = postData?.userLike;

				const date = new Date();

				/**
				 * This is the user like data that will be used to create a new post like document.
				 *
				 * This data will be sent to the API to create a new post like document.
				 */
				const userLike: PostLike = {
					userId: authUser.uid,
					postId: postData.post.id,
					createdAt: date,
				};

				/**
				 * If the post is in a group, then add the group id to the user like data.
				 */
				if (postData.post.groupId) {
					userLike.groupId = postData.post.groupId;
				}

				/**
				 * This function resets the user's like on a post and updates the number of likes accordingly.
				 * This function will only be called if there is an error in liking or removing like.
				 */
				const resetUserLike = () => {
					setPostStateValue(
						(prev) =>
							({
								...prev,
								posts: prev.posts.map((post) => {
									if (post.post.id === postData.post.id) {
										return {
											...post,
											post: {
												...post.post,
												numberOfLikes: previousUserLike
													? post.post.numberOfLikes + 1
													: post.post.numberOfLikes - 1,
											},
											userLike: previousUserLike,
										};
									}

									return post;
								}),
								currentPost:
									prev.currentPost?.post.id === postData.post.id
										? {
												...prev.currentPost,
												post: {
													...prev.currentPost?.post,
													numberOfLikes: previousUserLike
														? prev.currentPost.post.numberOfLikes + 1
														: prev.currentPost.post.numberOfLikes - 1,
												},
												userLike: previousUserLike,
										  }
										: prev.currentPost,
							} as PostState)
					);
				};

				/**
				 * This code is updating the state of a post in a React application. It is updating the number
				 * of likes for a post and the user's like status for that post. It does this by mapping over the
				 * previous state's posts array and finding the post with the matching ID. It then updates the
				 * post's number of likes and user like status based on whether the user had previously liked the
				 * post or not. It also updates the current post in the state if it matches the post being updated.
				 *
				 * This code updates the client-side state of the application. It does not update the database.
				 * The database is updated in the API. If the user like or like remove fails, then the state
				 * will be reset to the previous state.
				 */
				setPostStateValue(
					(prev) =>
						({
							...prev,
							posts: prev.posts.map((post) => {
								if (post.post.id === postData.post.id) {
									return {
										...post,
										post: {
											...post.post,
											numberOfLikes: previousUserLike
												? post.post.numberOfLikes - 1
												: post.post.numberOfLikes + 1,
										},
										userLike: previousUserLike ? null : userLike,
									};
								}

								return post;
							}),
							currentPost:
								prev.currentPost?.post.id === postData.post.id
									? {
											...prev.currentPost,
											post: {
												...prev.currentPost?.post,
												numberOfLikes: previousUserLike
													? prev.currentPost.post.numberOfLikes - 1
													: prev.currentPost.post.numberOfLikes + 1,
											},
											userLike: previousUserLike ? null : userLike,
									  }
									: prev.currentPost,
						} as PostState)
				);

				/**
				 * If the user has already liked the post, unlike it.
				 * Else, like the post.
				 */
				if (postData.userLike) {
					/**
					 * API Call to delete the post like.
					 *
					 * This API Call will delete the post like document from the database.
					 * This API Call will also update the post document in the database with the new like.
					 *
					 * Method: DELETE
					 * Endpoint: "/posts/likes/"
					 * Parameters: {
					 * 	apiKey: string,
					 *  postId: string,
					 * 	userId: string,
					 * }
					 *
					 * If there is an error, then throw an error.
					 */
					await axios
						.delete(apiConfig.apiEndpoint + "/posts/likes/", {
							data: {
								apiKey: userStateValue.api?.keys[0].key,
								postId: postData.userLike.postId,
								userId: postData.userLike.userId,
							},
						})
						.catch((error) => {
							const { postDeleted } = error.response.data;

							if (postDeleted && !postData.postDeleted) {
								actionPostDeleted(postDeleted, postData.post.id);
							}

							resetUserLike();

							throw new Error(`=>API: Post Like Error:\n${error.message}`);
						});
				} else {
					/**
					 * If there is no current user like, then like the post.
					 */

					/**
					 * API Call to create a new post like document.
					 *
					 * This API Call will create a new post like document in the database.
					 * As well as update the post document with the new like.
					 *
					 * Method: POST
					 * Endpoint: "/posts/likes/"
					 * Parameters: {
					 * 	apiKey: string,
					 * 	userLikeData: PostLike,
					 * }
					 *
					 * If there is an error, then throw an error.
					 */
					await axios
						.post(apiConfig.apiEndpoint + "/posts/likes/", {
							apiKey: userStateValue.api?.keys[0].key,
							userLikeData: userLike,
						})
						.catch((error) => {
							const { postDeleted } = error.response.data;

							if (postDeleted && !postData.postDeleted) {
								actionPostDeleted(postDeleted, postData.post.id);
							}

							resetUserLike();

							throw new Error(`=>API: Post Like Error:\n${error.message}`);
						});
				}
			} else {
				throw new Error("You must be logged in to like a post");
			}
		} catch (error: any) {
			console.log(`=>Mongo: Post Like Error:\n${error.message}`);
		}
	};

	/**
	 * ^ ██████╗            ██████╗  ██████╗ ███████╗████████╗███████╗
	 * ^ ██╔══██╗    ██╗    ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██╔════╝
	 * ^ ██████╔╝    ╚═╝    ██████╔╝██║   ██║███████╗   ██║   ███████╗
	 * ^ ██╔══██╗    ██╗    ██╔═══╝ ██║   ██║╚════██║   ██║   ╚════██║
	 * ^ ██║  ██║    ╚═╝    ██║     ╚██████╔╝███████║   ██║   ███████║
	 * ^ ╚═╝  ╚═╝           ╚═╝      ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝
	 */

	/**
	 * Fetches posts from the backend API based on the given post type and privacy,
	 * and appends them to the current list of posts in the postStateValue.
	 *
	 * @param {SitePost["postType"]} postType - The type of post to fetch.
	 *
	 * @param {SitePost["privacy"]} privacy - The privacy level of the post to fetch.
	 *
	 * @returns {Promise<number>} - A promise that resolves with the number of posts fetched.
	 */
	const fetchPosts = useCallback(
		async ({
			postType = "feed" as SitePost["postType"],
			privacy = "public" as SitePost["privacy"],
			groupId = undefined as string | undefined,
			creatorId = undefined as string | undefined,
			creator = undefined as string | undefined,
			tags = undefined as string | undefined,
			sortBy = "latest" as QueryPostsSortBy,
		}) => {
			/**
			 * Try to fetch posts from the backend API.
			 *
			 * If there is an error, then throw an error.
			 */
			try {
				if (!authUser) {
					throw new Error("You must be logged in to fetch posts");
				}

				let refPost;
				let refIndex;
				const sortByIndex =
					sortBy +
					(postType ? `-${postType}` : "") +
					(privacy ? `-${privacy}` : "") +
					(groupId ? `-${groupId}` : "") +
					(creatorId
						? `-${postType === "announcement" ? "sorsu" : creatorId}`
						: "") +
					(creator
						? `-${postType === "announcement" ? "sorsu" : creator}`
						: "") +
					(tags ? `-${tags}` : "");

				if (fetchingPostsFor !== sortByIndex) {
					setFetchingPostsFor(sortByIndex);

					switch (sortBy) {
						case "latest": {
							refIndex = postStateValue.posts.reduceRight((acc, post, index) => {
								if (post.index[sortByIndex] && acc === -1) {
									return index;
								}

								return acc;
							}, -1);

							refPost = postStateValue.posts[refIndex] || null;
							break;
						}

						default: {
							refPost = null;
							break;
						}
					}

					/**
					 * Fetch posts from the backend API using axios.
					 *
					 * This API Call will fetch posts from the backend API.
					 * After fetching posts, assign the posts to the temporary posts variable.
					 *
					 * Method: GET
					 * Endpoint: "/posts/posts"
					 * Parameters: {
					 * 	apiKey: string,
					 * 		- The API Key of the user.
					 * 	userId: string,
					 * 		- The user id of the user.
					 * 	postType: SitePost["postType"],
					 * 		- The type of post to fetch.
					 * 	privacy: SitePost["privacy"],
					 * 		- The privacy level of the post to fetch.
					 * 	fromDate: Date,
					 * 		- The date to fetch posts from.
					 * }
					 * Response: {
					 * 	posts: PostData[],
					 * }
					 *
					 * If there is an error, then throw an error.
					 */
					const {
						posts,
					}: {
						posts: PostData[];
					} = await axios
						.get(apiConfig.apiEndpoint + "/posts/posts", {
							params: {
								apiKey: userStateValue.api?.keys[0].key,
								userId: authUser?.uid,
								postType: postType,
								privacy: privacy,
								groupId: groupId,
								tags: tags,
								creatorId: creatorId,
								creator: creator,
								sortBy: sortBy,
								lastIndex: refPost ? refPost.index[sortByIndex] : -1,
								fromLikes: refPost
									? refPost.post.numberOfLikes + 1
									: Number.MAX_SAFE_INTEGER,
								fromComments: refPost
									? refPost?.post.numberOfComments + 1
									: Number.MAX_SAFE_INTEGER,
								fromDate: refPost?.post.createdAt || new Date().toISOString(),
							} as Partial<APIEndpointPostsParams>,
						})
						.then((res) => res.data)
						.catch((err) => {
							throw new Error(
								`API (GET): Getting posts error:\n ${err.message}`
							);
						});

					const fetchedLength = posts.length || 0;

					/**
					 * If there are fetcher posts, append them to the current list of posts in postStateValue.
					 */
					if (fetchedLength) {
						setPostStateValue((prev) => ({
							...prev,
							posts: prev.posts
								.map((post) => {
									const postIndex = posts.findIndex(
										(postData) => postData.post.id === post.post.id
									);

									const existingPost =
										postIndex !== -1 ? posts[postIndex] : null;

									if (existingPost) {
										posts.splice(postIndex, 1);

										const indices = {
											...post.index,
											...existingPost.index,
										};

										return {
											...post,
											...existingPost,
											index: indices,
										};
									} else {
										return post;
									}
								})
								.concat(posts),
						}));

						// setPostStateValue((prev) => ({
						// 	...prev,
						// 	posts: [...prev.posts, ...posts],
						// }));
					} else {
						console.log("Mongo: No posts found!");
					}

					setFetchingPostsFor("");

					/**
					 * Get the number of posts fetched.
					 *
					 * @returns {number} - The number of posts fetched.
					 */
					return fetchedLength;
				} else {
					return null;
				}
			} catch (error: any) {
				console.log("Mongo: Fetching Posts Error", error.message);
				setFetchingPostsFor("");
				return null;
			}
		},
		[
			authUser,
			fetchingPostsFor,
			postStateValue.posts,
			setPostStateValue,
			userStateValue.api?.keys,
		]
	);

	/**
	 * ^ ██████╗            ██╗     ██╗██╗  ██╗███████╗
	 * ^ ██╔══██╗    ██╗    ██║     ██║██║ ██╔╝██╔════╝
	 * ^ ██████╔╝    ╚═╝    ██║     ██║█████╔╝ █████╗
	 * ^ ██╔══██╗    ██╗    ██║     ██║██╔═██╗ ██╔══╝
	 * ^ ██║  ██║    ╚═╝    ███████╗██║██║  ██╗███████╗
	 * ^ ╚═╝  ╚═╝           ╚══════╝╚═╝╚═╝  ╚═╝╚══════╝
	 */
	/**
	 *
	 *
	 * @param {SitePost} post
	 * @return {*}
	 */
	const fetchUserLike = async (post: SitePost) => {
		try {
			if (authUser) {
				const userLikeData = await axios
					.get(apiConfig.apiEndpoint + "/posts/likes/", {
						params: {
							apiKey: userStateValue.api?.keys[0].key,
							postId: post.id,
							userId: authUser.uid,
						},
					})
					.then((response) => response.data.userLike)
					.catch((error: any) => {
						throw new Error(`API (GET): Getting likes error\n ${error.message}`);
					});

				if (userLikeData) {
					return userLikeData;
				} else {
					return null;
				}
			} else {
				throw new Error("User not logged in!");
			}
		} catch (error: any) {
			console.log("Mongo: Fetching Post Vote Error", error.message);
			return null;
		}
	};

	/**
	 * ! ██████╗            ██████╗  ██████╗ ███████╗████████╗
	 * ! ██╔══██╗    ██╗    ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝
	 * ! ██║  ██║    ╚═╝    ██████╔╝██║   ██║███████╗   ██║
	 * ! ██║  ██║    ██╗    ██╔═══╝ ██║   ██║╚════██║   ██║
	 * ! ██████╔╝    ╚═╝    ██║     ╚██████╔╝███████║   ██║
	 * ! ╚═════╝            ╚═╝      ╚═════╝ ╚══════╝   ╚═╝
	 */
	const deletePost = async (postData: PostData) => {
		try {
			if (userStateValue.user.uid !== postData.post.creatorId) {
				if (!userStateValue.user.roles.includes("admin")) {
					throw new Error("You are not authorized to delete this post");
				}
			}

			if (postData.post.postImagesOrVideos.length) {
				postData.post.postImagesOrVideos.forEach(async (imageOrVideo) => {
					const imageOrVideoStorageRef = ref(
						clientStorage,
						imageOrVideo.filePath
					);

					await deleteObject(imageOrVideoStorageRef).catch(() => {
						console.log(
							"Firebase Storage: Image Or Video Deletion Error: ",
							imageOrVideo.id
						);
					});
				});
			}

			if (postData.post.postFiles.length) {
				postData.post.postFiles.forEach(async (file) => {
					const fileStorageRef = ref(clientStorage, file.filePath);

					await deleteObject(fileStorageRef).catch(() => {
						console.log("Firebase Storage: File Deletion Error: ", file.id);
					});
				});
			}

			if (postData.post.postPoll) {
				const { postPoll } = postData.post;

				postPoll.pollItems.forEach(async (pollItem) => {
					const pollItemStorageRef = ref(
						clientStorage,
						pollItem.pollItemLogo?.filePath
					);

					await deleteObject(pollItemStorageRef).catch(() => {
						console.log(
							"Firebase Storage: Poll Item Logo Deletion Error: ",
							pollItem.id
						);
					});
				});
			}

			const { isDeleted } = await axios
				.delete(apiConfig.apiEndpoint + "/posts/", {
					data: {
						apiKey: userStateValue.api?.keys[0].key,
						postData: postData.post,
					},
				})
				.then((response) => response.data)
				.catch((err) => {
					throw new Error("API (DELETE): Deleting post error: ", err.message);
				});

			if (isDeleted) {
				setPostStateValue(
					(prev) =>
						({
							...prev,
							posts: prev.posts.filter(
								(post) => post.post.id !== postData.post.id
							),
							currentPost:
								prev.currentPost?.post.id === postData.post.id
									? null
									: prev.currentPost,
						} as PostState)
				);

				if (postData.post.groupId) {
					setGroupStateValue((prev) => ({
						...prev,
						groups: prev.groups.map((group) => {
							if (group.group.id === postData.post.groupId) {
								return {
									...group,
									group: {
										...group.group,
										numberOfPosts: group.group.numberOfPosts - 1,
									},
								};
							}

							return group;
						}),
						currentGroup:
							prev.currentGroup &&
							prev.currentGroup?.group.id === postData.post.groupId
								? {
										...prev.currentGroup,
										group: {
											...prev.currentGroup.group,
											numberOfPosts: prev.currentGroup.group.numberOfPosts - 1,
										},
								  }
								: prev.currentGroup,
					}));
				}
			}
		} catch (error: any) {
			console.log("MONGO: Post Deletion Error", error.message);
		}
	};

	return {
		/**
		 * ~ Recoil Atoms
		 */
		postStateValue,
		setPostStateValue,

		/**
		 * ~ Recoil Atoms
		 */

		postOptionsStateValue,
		setPostOptionsStateValue,

		/**
		 * & CRUD Post
		 */

		createPost,
		deletePost,

		/**
		 * & CRUD Posts
		 */
		fetchPosts,

		/**
		 * & CRUD User Like
		 */
		fetchUserLike,
		onPostLike,
		/**
		 * Actions for post
		 */
		actionPostDeleted,
	};
};

export default usePost;
