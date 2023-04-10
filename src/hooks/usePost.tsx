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

const usePost = () => {
	const [postStateValue, setPostStateValue] = useRecoilState(postState);
	const [postOptionsStateValue, setPostOptionsStateValue] =
		useRecoilState(postOptionsState);
	const { authUser, userStateValue } = useUser();

	const createPost = async (postForm: CreatePostType, creator: SiteUser) => {
		try {
			const postDate = new Date();

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

			if (postForm.groupId) {
				newPost.groupId = postForm.groupId;
			}

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

			if (newPostData) {
				if (postForm.imagesOrVideos) {
					await Promise.all(
						postForm.imagesOrVideos.map(async (imageOrVideo) => {
							const postImageOrVideoRef = doc(
								collection(clientDb, `posts/${newPostData.id}/imagesOrVideos`)
							);

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

							if (postImageOrVideo) {
								newPostData.postImagesOrVideos.push(postImageOrVideo);
							}
						})
					).then(async () => {
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

				if (postForm.files) {
					await Promise.all(
						postForm.files.map(async (file) => {
							const postFileRef = doc(
								collection(clientDb, `posts/${newPostData.id}/files`)
							);

							const postFile = await uploadPostFile(
								newPostData,
								file,
								postFileRef.id
							).catch((error: any) => {
								console.log("Hook: Upload File Error: ", error.message);
							});

							if (postFile) {
								newPostData.postFiles.push(postFile);
							}
						})
					).then(async () => {
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

				if (postForm.links) {
					postForm.links.map((link) => {
						const postLinkId = doc(
							collection(clientDb, `posts/${newPostData.id}/links`)
						);

						const date = new Date();

						const newPostLink: PostLink = {
							id: postLinkId.id,
							postId: newPostData.id,
							index: link.index,
							url: link.url,
							blocked: false,
							updatedAt: date,
							createdAt: date,
						};

						newPostData.postLinks.push(newPostLink);
					});

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

	const uploadPostImageOrVideo = async (
		post: SitePost,
		imageOrVideo: CreatePostImageOrVideoType,
		imageOrVideoId: string
	) => {
		try {
			const storageRef = ref(
				clientStorage,
				`posts/${post.id}/imagesOrVideos/${imageOrVideoId}`
			);

			const response = await fetch(imageOrVideo.url as string);
			const blob = await response.blob();

			await uploadBytes(storageRef, blob).catch((error: any) => {
				console.log(
					"Firebase Storage: Image Or Video Upload Error: ",
					error.message
				);
				throw error;
			});

			const downloadURL = await getDownloadURL(storageRef).catch(
				(error: any) => {
					console.log(
						"Firebase Storage: Image Or Video Download URL Error: ",
						error.message
					);
					throw error;
				}
			);

			const date = new Date();

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

			return newPostImageOrVideo;
		} catch (error: any) {
			console.log("MONGO: Image Or Video Upload Error", error.message);
		}
	};

	const uploadPostFile = async (
		post: SitePost,
		file: CreatePostFileType,
		fileId: string
	) => {
		try {
			const storageRef = ref(clientStorage, `posts/${post.id}/files/${fileId}`);

			const response = await fetch(file.url as string);
			const blob = await response.blob();

			await uploadBytes(storageRef, blob).catch((error: any) => {
				console.log("Firebase Storage: File Upload Error: ", error.message);
				throw error;
			});

			const downloadURL = await getDownloadURL(storageRef).catch(
				(error: any) => {
					console.log(
						"Firebase Storage: file Download URL Error: ",
						error.message
					);
					throw error;
				}
			);

			const date = new Date();

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

			return newPostFile;
		} catch (error: any) {
			console.log("MONGO: File Upload Error", error.message);
		}
	};

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

	return {
		postStateValue,
		setPostStateValue,
		postOptionsStateValue,
		setPostOptionsStateValue,
		createPost,
		deletePost,
		fetchPosts,
		onPostLike,
		fetchUserLike,
	};
};

export default usePost;
