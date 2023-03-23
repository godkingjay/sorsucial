import { PostData, postOptionsState, postState } from "@/atoms/postAtom";
import { CreatePostType } from "@/components/Modal/PostCreationModal";
import { db, storage } from "@/firebase/clientApp";
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

/**
 * usePost hook to handle all post related operations like create, delete, update, etc.
 */
const usePost = () => {
	const [postStateValue, setPostStateValue] = useRecoilState(postState);
	const [postOptionsStateValue, setPostOptionsStateValue] =
		useRecoilState(postOptionsState);
	const { authUser } = useUser();

	/**
	 * Create a new post in firestore database and storage
	 * if post has image or video then upload it to storage
	 * and save the url in firestore database and update
	 * the post state in recoil atom to show the new post.
	 *
	 * If post has file then upload it to storage and save
	 * the url in firestore database and update the post state
	 * in recoil atom to show the new post.
	 *
	 * If post has link then save the link in firestore database
	 * and update the post state in recoil atom to show the new post.
	 *
	 * If post has poll then save the poll in firestore database and
	 * update the post state in recoil atom to show the new post. If
	 * poll item has image then upload it to storage and save the url
	 * in firestore database.
	 *
	 * If post has group then save the group id in firestore database
	 * and update the post state in recoil atom to show the new post.
	 *
	 * @param {CreatePostType} postForm - this is the post form
	 * data that user has entered in the post creation modal.
	 * @param {SiteUser} creator - this is the user who is creating the post.
	 *
	 * @returns {Promise<void>}
	 *
	 * @example
	 * const { createPost } = usePost();
	 * const { userStateValue } = useUser();
	 *
	 * const handlePostCreation = async (postForm: CreatePostType) => {
	 * 	try {
	 * 		await createPost(postForm, userStateValue.user);
	 * 	} catch (error) {
	 * 		console.log(error);
	 * 	}
	 * };
	 *
	 * @see {@link createPost}
	 */
	const createPost = async (postForm: CreatePostType, creator: SiteUser) => {
		/**
		 * Create a new post in firestore database.
		 */
		try {
			/**
			 * Create a batch to update multiple documents in
			 * firestore database.
			 *
			 * @see {@link https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes}
			 */
			const batch = writeBatch(db);

			/**
			 * Get the post reference to create a new post.
			 */
			const postRef = doc(collection(db, "posts"));

			/**
			 * Get the current date and time.
			 *
			 * @see {@link https://firebase.google.com/docs/firestore/manage-data/add-data#server_timestamp}
			 */
			const postDate = serverTimestamp() as Timestamp;

			/**
			 * Create a new post object.
			 *
			 * @see {@link SitePost}
			 */
			const newPost: SitePost = {
				id: postRef.id,
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

			/**
			 * Check if post has group.
			 *
			 * If post has group then add the group id
			 * to the new post object.
			 */
			if (postForm.groupId) {
				newPost.groupId = postForm.groupId;
			}

			/**
			 * Check if post has image or video.
			 *
			 * If post has image or video then upload it to
			 * storage and save the url in firestore database.
			 *
			 * If post has image or video then add the url to
			 * the new post object.
			 *
			 * If post has image or video then update the post
			 * state in recoil atom to show the new post.
			 *
			 * @see {@link https://firebase.google.com/docs/storage/web/upload-files}
			 */
			if (postForm.imageOrVideo) {
			}

			/**
			 * Check if post has file.
			 *
			 * If post has file then upload it to storage and
			 * save the url in firestore database.
			 *
			 * If post has file then add the url to the new
			 * post object.
			 *
			 * If post has file then update the post state in
			 * recoil atom to show the new post.
			 *
			 * @see {@link https://firebase.google.com/docs/storage/web/upload-files}
			 */
			if (postForm.file) {
			}

			/**
			 * Check if post has link.
			 *
			 * If post has link then add the link to the new
			 * post object.
			 *
			 * If post has link then update the post state in
			 * recoil atom to show the new post.
			 */
			if (postForm.link) {
			}

			/**
			 * Check if post has poll.
			 *
			 * If post has poll then add the poll to the new
			 * post object.
			 *
			 * If post has poll then update the post state in
			 * recoil atom to show the new post.
			 *
			 * If poll item has image then upload it to storage
			 * and save the url in firestore database.
			 *
			 * If poll item has image then add the url to the
			 * new post object.
			 *
			 * If poll item has image then update the post state
			 * in recoil atom to show the new post.
			 *
			 * @see {@link https://firebase.google.com/docs/storage/web/upload-files}
			 */
			if (postForm.poll) {
			}

			/**
			 * Update the post state in recoil atom to show the new post.
			 *
			 * @see {@link https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document}
			 */
			batch.set(postRef, newPost);

			/**
			 * Commit the batch to update multiple documents in
			 * firestore database.
			 *
			 * @see {@link https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes}
			 */
			await batch
				.commit()
				.then(() => {
					/**
					 * Update the post state in recoil atom to show the new post.
					 *
					 * @see {@link https://recoiljs.org/docs/api-reference/utils/useRecoilState}
					 */
					setPostStateValue((prev) => ({
						...prev,
						posts: [
							{
								post: {
									...newPost,
									/**
									 * Create a new date object. This date is a copy
									 * of the date object created in the server.
									 *
									 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date}
									 */
									createdAt: {
										seconds: new Date().getTime() / 1000,
									} as Timestamp,
								},
								creator,

								/**
								 * Set the user like and vote to null.
								 */
								userLike: null,

								/**
								 * Set the user like and vote to null.
								 */
								userVote: null,
							},
							...prev.posts,
						],
					}));
				})
				.catch((error) => {
					/**
					 * Log the error message if there is an error
					 * while committing the batch.
					 *
					 * @see {@link https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes}
					 */
					console.log(
						"Firestore (BatchWrite): Post Creation Error",
						error.message
					);
				});
		} catch (error: any) {
			/**
			 * Log the error message if there is an error
			 * while creating the post.
			 *
			 * @see {@link https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document}
			 */
			console.log("Firestore: Post Creation Error", error.message);
		}
	};

	const deletePost = async (postData: PostData) => {
		try {
			if (authUser?.uid !== postData.post.creatorId) {
				throw new Error("You are not authorized to delete this post");
			}

			const batch = writeBatch(db);

			const postRef = doc(collection(db, "posts"), postData.post.id);

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

			if (postData.post.numberOfLikes > 0) {
				const likesRef = collection(db, `posts/${postData.post.id}/likes`);

				const likesQuery = query(likesRef);

				const likesSnapshot = await getDocs(likesQuery);

				likesSnapshot.forEach((like) => {
					batch.delete(like.ref);
				});
			}

			batch.delete(postRef);

			await batch
				.commit()
				.then(() => {
					setPostStateValue((prev) => ({
						...prev,
						posts: prev.posts.filter(
							(post) => post.post.id !== postData.post.id
						),
					}));
				})
				.catch((err) => {
					console.log(
						"Firestore (BatchWrite): Post Deletion Error",
						err.message
					);
				});
		} catch (error: any) {
			console.log("Firestore: Post Deletion Error", error.message);
		}
	};

	const onPostLike = (postData: PostData) => {
		try {
			if (authUser) {
				const batch = writeBatch(db);

				const postRef = doc(collection(db, "posts"), postData.post.id);
				const postLikeRef = doc(
					collection(db, `posts/${postData.post.id}/likes`),
					authUser.uid
				);

				if (postData.userLike) {
					batch.delete(postLikeRef);
					batch.update(postRef, {
						numberOfLikes: increment(-1),
						updatedAt: serverTimestamp() as Timestamp,
					});

					setPostStateValue((prev) => ({
						...prev,
						posts: prev.posts.map((post) => {
							if (post.post.id === postData.post.id) {
								return {
									...post,
									post: {
										...post.post,
										numberOfLikes: post.post.numberOfLikes - 1,
										updatedAt: {
											seconds: new Date().getTime() / 1000,
										} as Timestamp,
									},
									userLike: null,
								};
							}

							return post;
						}),
					}));
				} else {
					const newPostLike: PostLike = {
						userId: authUser.uid,
						postId: postData.post.id,
					};

					if (postData.post.groupId) {
						newPostLike.groupId = postData.post.groupId;
					}

					batch.set(postLikeRef, newPostLike);
					batch.update(postRef, {
						numberOfLikes: increment(1),
					});

					setPostStateValue((prev) => ({
						...prev,
						posts: prev.posts.map((post) => {
							if (post.post.id === postData.post.id) {
								return {
									...post,
									post: {
										...post.post,
										numberOfLikes: post.post.numberOfLikes + 1,
									},
									userLike: newPostLike,
								};
							}

							return post;
						}),
					}));
				}

				batch.commit().catch((err) => {
					console.log("Firestore (BatchWrite): Post Like Error", err.message);
				});
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

				posts.forEach((post: PostData) => {
					fetchUserLike(post.post);
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
				const userLikeRef = doc(
					collection(db, `posts/${post.id}/likes`),
					authUser.uid
				);

				const userLike = await getDoc(userLikeRef).then((doc) => {
					if (doc.exists()) {
						return doc.data() as PostLike;
					} else {
						return null;
					}
				});

				setPostStateValue((prev) => ({
					...prev,
					posts: prev.posts.map((prevPost) => {
						if (prevPost.post.id === post.id) {
							return {
								...prevPost,
								userLike,
							};
						}

						return prevPost;
					}),
				}));
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
