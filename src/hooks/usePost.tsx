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
import { SiteUser } from "@/lib/interfaces/user";
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
	const createPost = async (postForm: CreatePostType, creator: SiteUser) => {
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
				creatorId: creator.uid,
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
				.post(apiConfig.apiEndpoint + "post/post", {
					newPost,
					creator,
				})
				.then((res) => res.data.newPost)
				.catch((error) => {
					console.log("API: Post Creation Error: ", error.message);
					throw error;
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
				if (postForm.imagesOrVideos) {
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
								console.log(
									"Hook: Upload Image Or Video Error: ",
									error.message
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
							.put(apiConfig.apiEndpoint + "post/post", {
								updatedPost: {
									...newPostData,
									updatedAt: new Date(),
								},
							})
							.catch((error) => {
								console.log(
									"API: Post Update Images Or Videos Error: ",
									error.message
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
				if (postForm.files) {
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
								console.log("Hook: Upload File Error: ", error.message);
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
							.put(apiConfig.apiEndpoint + "post/post", {
								updatedPost: {
									...newPostData,
									updatedAt: new Date(),
								},
							})
							.catch((error) => {
								console.log("API: Post Files Error: ", error.message);
							});
					});
				}

				/**
				 * If the post has links, then add them to the post document.
				 *
				 * The postLinks is the array of links to be added.
				 */
				if (postForm.links) {
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
						.put(apiConfig.apiEndpoint + "post/post", {
							updatedPost: {
								...newPostData,
								updatedAt: new Date(),
							},
						})
						.catch((error) => {
							console.log("API: Post Links Error: ", error.message);
						});
				}

				if (postForm.poll) {
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
									post: newPostData,
									creator,
								},
								...prev.posts,
							],
						} as PostState)
				);
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
					"Firebase Storage: Image Or Video Upload Error: ",
					error.message
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
						"Firebase Storage: Image Or Video Download URL Error: ",
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
			console.log("Firebase: Image Or Video Upload Error", error.message);
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
			const storageRef = ref(clientStorage, `posts/${post.id}/files/${fileId}`);

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
	const onPostLike = async (postData: PostData) => {
		try {
			if (authUser) {
				/**
				 * If the user has already liked the post, unlike it.
				 * Else, like the post.
				 */
				if (postData.userLike) {
					await axios
						.delete(apiConfig.apiEndpoint + "post/like/like", {
							data: {
								deleteUserLikePostId: postData.userLike.postId,
								deleteUserLikeUserId: postData.userLike.userId,
							},
						})
						.catch((error) => {
							console.log("API: Post Like Error: ", error.message);
						});

					if (postStateValue.currentPost?.post) {
						if (postData.post.id === postStateValue.currentPost.post.id) {
							setPostStateValue(
								(prev) =>
									({
										...prev,
										currentPost: {
											...prev.currentPost,
											post: {
												...prev.currentPost?.post,
												numberOfLikes:
													prev.currentPost?.post.numberOfLikes! - 1,
											},
											userLike: null,
										},
									} as PostState)
							);
						}
					}

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
												numberOfLikes: post.post.numberOfLikes - 1,
											},
											userLike: null,
										};
									}

									return post;
								}),
							} as PostState)
					);
				} else {
					const userLike: PostLike = {
						userId: authUser.uid,
						postId: postData.post.id,
						createdAt: new Date(),
					};

					if (postData.post.groupId) {
						userLike.groupId = postData.post.groupId;
					}

					await axios.post(apiConfig.apiEndpoint + "post/like/like", {
						newUserLike: userLike,
					});

					if (postStateValue.currentPost?.post) {
						if (postData.post.id === postStateValue.currentPost.post.id) {
							setPostStateValue(
								(prev) =>
									({
										...prev,
										currentPost: {
											...prev.currentPost,
											post: {
												...prev.currentPost?.post,
												numberOfLikes:
													prev.currentPost?.post.numberOfLikes! + 1,
											},
											userLike,
										},
									} as PostState)
							);
						}
					}

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
												numberOfLikes: post.post.numberOfLikes + 1,
											},
											userLike,
										};
									}

									return post;
								}),
							} as PostState)
					);
				}
			} else {
				throw new Error("You must be logged in to like a post");
			}
		} catch (error: any) {
			console.log("Firestore: Post Like Error", error.message);
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
	const fetchPosts = async (postType: SitePost["postType"]) => {
		try {
			const lastIndex = postStateValue.posts.reduceRight((acc, post, index) => {
				if (post.post.postType === postType && acc === -1) {
					return index;
				}

				return acc;
			}, -1);

			const oldestPost = postStateValue.posts[lastIndex];

			const posts = await axios
				.get(apiConfig.apiEndpoint + "post/posts", {
					params: {
						getUserId: authUser?.uid,
						getPostType: postType,
						getFromDate: oldestPost?.post.createdAt,
					},
				})
				.then((res) => res.data.posts)
				.catch((err) => {
					console.log("API (GET): Getting posts  error: ", err.message);
				});

			if (posts.length) {
				setPostStateValue(
					(prev) =>
						({
							...prev,
							posts: [...prev.posts, ...posts],
						} as PostState)
				);
			} else {
				console.log("Mongo: No posts found!");
			}
		} catch (error: any) {
			console.log("Mongo: Fetching Posts Error", error.message);
		}
	};

	/**
	 * ^ ██████╗            ██╗     ██╗██╗  ██╗███████╗
	 * ^ ██╔══██╗    ██╗    ██║     ██║██║ ██╔╝██╔════╝
	 * ^ ██████╔╝    ╚═╝    ██║     ██║█████╔╝ █████╗
	 * ^ ██╔══██╗    ██╗    ██║     ██║██╔═██╗ ██╔══╝
	 * ^ ██║  ██║    ╚═╝    ███████╗██║██║  ██╗███████╗
	 * ^ ╚═╝  ╚═╝           ╚══════╝╚═╝╚═╝  ╚═╝╚══════╝
	 */
	const fetchUserLike = async (post: SitePost) => {
		try {
			if (authUser) {
				const userLikeData = await axios
					.get(apiConfig.apiEndpoint + "post/like/like", {
						params: {
							getPostId: post.id,
							getUserId: authUser.uid,
						},
					})
					.then((res) => res.data.userLike)
					.catch((err) => {
						throw new Error("API (GET): Getting likes error: ", err.message);
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
			if (
				userStateValue.user.uid !== postData.post.creatorId ||
				!userStateValue.user.roles.includes("admin")
			) {
				throw new Error("You are not authorized to delete this post");
			}

			if (postData.post.postImagesOrVideos.length) {
				postData.post.postImagesOrVideos.forEach((imageOrVideo) => {
					const imageOrVideoStorageRef = ref(
						clientStorage,
						imageOrVideo.filePath
					);

					deleteObject(imageOrVideoStorageRef).catch(() => {
						console.log(
							"Firebase Storage: Image Or Video Deletion Error: ",
							imageOrVideo.id
						);
					});
				});
			}

			if (postData.post.postFiles.length) {
				postData.post.postFiles.forEach((file) => {
					const fileStorageRef = ref(clientStorage, file.filePath);

					deleteObject(fileStorageRef).catch(() => {
						console.log("Firebase Storage: File Deletion Error: ", file.id);
					});
				});
			}

			if (postData.post.postPoll) {
				const { postPoll } = postData.post;

				postPoll.pollItems.forEach((pollItem) => {
					const pollItemStorageRef = ref(
						clientStorage,
						pollItem.pollItemLogo?.filePath
					);

					deleteObject(pollItemStorageRef).catch(() => {
						console.log(
							"Firebase Storage: Poll Item Logo Deletion Error: ",
							pollItem.id
						);
					});
				});
			}

			await axios.delete(apiConfig.apiEndpoint + "post/post", {
				data: {
					deletedPost: postData.post,
				},
			});

			if (postStateValue.currentPost?.post.id === postData.post.id) {
				setPostStateValue(
					(prev) =>
						({
							...prev,
							currentPost: null,
						} as PostState)
				);
			}

			setPostStateValue(
				(prev) =>
					({
						...prev,
						posts: prev.posts.filter(
							(post) => post.post.id !== postData.post.id
						),
					} as PostState)
			);
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
	};
};

export default usePost;
