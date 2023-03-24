import {
	PostData,
	PostState,
	postOptionsState,
	postState,
} from "@/atoms/postAtom";
import { CreatePostType } from "@/components/Modal/PostCreationModal";
import { clientDb as db, clientStorage as storage } from "@/firebase/clientApp";
import { apiConfig } from "@/lib/api/apiConfig";
import { PostLike, SitePost } from "@/lib/interfaces/post";
import { SiteUser } from "@/lib/interfaces/user";
import axios from "axios";
import {
	Timestamp,
	collection,
	doc,
	getDoc,
	getDocs,
	increment,
	query,
	serverTimestamp,
	writeBatch,
} from "firebase/firestore";
import { useRecoilState } from "recoil";
import useUser from "./useUser";
import { deleteObject, ref } from "firebase/storage";

const usePost = () => {
	const [postStateValue, setPostStateValue] = useRecoilState(postState);
	const [postOptionsStateValue, setPostOptionsStateValue] =
		useRecoilState(postOptionsState);
	const { authUser } = useUser();

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
				isHidden: false,
				isCommentable: postForm.isCommentable,
				updatedAt: postDate,
				createdAt: postDate,
			};

			if (postForm.groupId) {
				newPost.groupId = postForm.groupId;
			}

			if (postForm.imageOrVideo) {
			}

			if (postForm.file) {
			}

			if (postForm.link) {
			}

			if (postForm.poll) {
			}

			const newPostData: SitePost = await axios
				.post(apiConfig.apiEndpoint + "post/create-post", {
					newPost,
					creator,
				})
				.then((res) => res.data.newPost)
				.catch((error) => {
					console.log("API: Post Creation Error: ", error.message);
					throw error;
				});

			if (newPostData) {
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

	const deletePost = async (postData: PostData) => {
		try {
			if (authUser?.uid !== postData.post.creatorId) {
				throw new Error("You are not authorized to delete this post");
			}

			if (postData.post.postImagesOrVideos.length) {
				postData.post.postImagesOrVideos.forEach((imageOrVideo) => {
					const imageOrVideoStorageRef = ref(storage, imageOrVideo.filePath);

					deleteObject(imageOrVideoStorageRef).catch(() => {
						console.log(
							"Storage: Image Or Video Deletion Error: ",
							imageOrVideo.id
						);
					});
				});
			}

			if (postData.post.postFiles.length) {
				postData.post.postFiles.forEach((file) => {
					const fileStorageRef = ref(storage, file.filePath);

					deleteObject(fileStorageRef).catch(() => {
						console.log("Storage: File Deletion Error: ", file.id);
					});
				});
			}

			if (postData.post.postPoll) {
				const { postPoll } = postData.post;

				postPoll.pollItems.forEach((pollItem) => {
					const pollItemStorageRef = ref(
						storage,
						pollItem.pollItemLogo?.filePath
					);

					deleteObject(pollItemStorageRef).catch(() => {
						console.log(
							"Storage: Poll Item Logo Deletion Error: ",
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
			console.log("Firestore: Post Deletion Error", error.message);
		}
	};

	const onPostLike = (postData: PostData) => {
		try {
			if (authUser) {
				/**
				 * If the user has already liked the post, unlike it.
				 * Else, like the post.
				 */
				if (postData.userLike) {
					axios
						.delete(apiConfig.apiEndpoint + "post/like/like", {
							data: {
								post: postData.post,
								userLike: postData.userLike,
							},
						})
						.catch((error) => {
							console.log("API: Post Like Error: ", error.message);
						});

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

					axios.post(apiConfig.apiEndpoint + "post/like/like", {
						post: postData.post,
						userLike,
					});

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

	const fetchPosts = async (postType: SitePost["postType"]) => {
		try {
			const lastPost =
				postStateValue.posts.length > 0
					? postStateValue.posts
							.filter((post) => post.post.postType === postType)
							.pop()
					: null;

			const posts = await axios
				.post(apiConfig.apiEndpoint + "post/get-posts", {
					postType,
					lastPost,
				})
				.then((res) => res.data.posts)
				.catch((err) => {
					console.log("API: get-posts error: ", err.message);
				});

			if (posts.length > 0) {
				setPostStateValue((prev) => ({
					...prev,
					posts: [...prev.posts, ...posts],
				}));

				posts.forEach(async (post: PostData) => {
					await fetchUserLike(post.post);
				});
			} else {
				console.log("No posts found");
			}
		} catch (error: any) {
			console.log("Firestore: Fetching Announcements Error", error.message);
		}
	};

	const fetchUserLike = async (post: SitePost) => {
		try {
			if (authUser) {
				const userLikeData = await axios
					.get(apiConfig.apiEndpoint + "post/like/like", {
						params: {
							postId: post.id,
							userId: authUser.uid,
						},
					})
					.then((res) => res.data.userLike)
					.catch((err) => {
						console.log("API (GET): Getting likes error: ", err.message);
					});

				if (userLikeData) {
					setPostStateValue((prev) => ({
						...prev,
						posts: prev.posts.map((post) => {
							if (post.post.id === userLikeData.postId) {
								return {
									...post,
									userLike: userLikeData,
								};
							}

							return post;
						}),
					}));
				} else {
					setPostStateValue((prev) => ({
						...prev,
						posts: prev.posts.map((postData) => {
							if (postData.post.id === post.id) {
								return {
									...postData,
									userLike: null,
								};
							}

							return postData;
						}),
					}));
				}
			}
		} catch (error: any) {
			console.log("Firestore: Fetching Post Vote Error", error.message);
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
	};
};

export default usePost;
