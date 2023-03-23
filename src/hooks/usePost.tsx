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

const usePost = () => {
	const [postStateValue, setPostStateValue] = useRecoilState(postState);
	const [postOptionsStateValue, setPostOptionsStateValue] =
		useRecoilState(postOptionsState);
	const { authUser } = useUser();

	const createPost = async (postForm: CreatePostType, creator: SiteUser) => {
		try {
			const batch = writeBatch(db);

			const postRef = doc(collection(db, "posts"));

			const newPost: SitePost = {
				id: postRef.id,
				creatorId: creator.uid,
				privacy: postForm.privacy,
				postTitle: postForm.postTitle.trim(),
				postBody: postForm.postBody?.trim(),
				postType: postForm.postType,
				postTags: postForm.postTags,
				hasImageOrVideo: postForm.imageOrVideo ? true : false,
				hasFile: postForm.file ? true : false,
				hasLink: postForm.link ? true : false,
				hasPoll: postForm.poll ? true : false,
				numberOfLikes: 0,
				numberOfComments: 0,
				isHidden: false,
				isCommentable: postForm.isCommentable,
				createdAt: serverTimestamp() as Timestamp,
			};

			if (postForm.groupId) {
				newPost.groupId = postForm.groupId;
			}

			// check if post has image or video
			if (postForm.imageOrVideo) {
			}

			// check if post has file
			if (postForm.file) {
			}

			// check if post has link
			if (postForm.link) {
			}

			// check if post has poll
			if (postForm.poll) {
			}

			batch.set(postRef, newPost);

			await batch.commit().then(() => {
				setPostStateValue((prev) => ({
					...prev,
					posts: [
						{
							post: {
								...newPost,
								createdAt: {
									seconds: new Date().getTime() / 1000,
								} as Timestamp,
							},
							creator,
							userLike: null,
						},
						...prev.posts,
					],
				}));
			});
		} catch (error: any) {
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

			if (postData.postImagesOrVideos?.length) {
				postData.postImagesOrVideos.forEach((imageOrVideo) => {
					const imageOrVideoRef = doc(
						collection(db, `posts/${postData.post.id}/imagesOrVideos`),
						imageOrVideo.id
					);

					const imageOrVideoStorageRef = ref(storage, imageOrVideo.filePath);

					deleteObject(imageOrVideoStorageRef).catch(() => {
						console.log(
							"Storage: Image or Video Deletion Error: ",
							imageOrVideo.id
						);
					});

					batch.delete(imageOrVideoRef);
				});
			}

			if (postData.postFiles?.length) {
				postData.postFiles.forEach((file) => {
					const fileRef = doc(
						collection(db, `posts/${postData.post.id}/files`),
						file.id
					);

					const fileStorageRef = ref(storage, file.filePath);

					deleteObject(fileStorageRef).catch(() => {
						console.log("Storage: File Deletion Error: ", file.id);
					});

					batch.delete(fileRef);
				});
			}

			if (postData.postLinks?.length) {
				postData.postLinks.forEach((link) => {
					const linkRef = doc(
						collection(db, `posts/${postData.post.id}/links`),
						link.id
					);

					batch.delete(linkRef);
				});
			}

			if (postData.postPoll) {
				const pollRef = doc(
					collection(db, `posts/${postData.post.id}/poll`),
					postData.postPoll.poll.id
				);

				postData.postPoll.pollItems.forEach((pollItem) => {
					const pollItemRef = doc(
						collection(
							db,
							`posts/${postData.post.id}/poll/${postData.postPoll?.poll.id}/pollItems`
						),
						pollItem.pollItem.id
					);

					if (pollItem.pollItemLogo) {
						const pollItemLogoRef = doc(
							collection(
								db,
								`posts/${postData.post.id}/poll/${postData.postPoll?.poll.id}/pollItems/${pollItem.pollItem.id}/logo`
							),
							pollItem.pollItemLogo.id
						);

						const pollItemLogoStorageRef = ref(
							storage,
							pollItem.pollItemLogo.filePath
						);

						deleteObject(pollItemLogoStorageRef).catch(() => {
							console.log(
								"Storage: Poll Item Logo Deletion Error: ",
								pollItem.pollItem.id
							);
						});

						batch.delete(pollItemLogoRef);
					}

					batch.delete(pollItemRef);
				});

				batch.delete(pollRef);
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
