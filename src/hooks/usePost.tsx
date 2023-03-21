import { postState } from "@/atoms/postAtom";
import { CreatePostType } from "@/components/Modal/PostCreationModal";
import { db } from "@/firebase/clientApp";
import { apiConfig } from "@/lib/api/apiConfig";
import { SitePost } from "@/lib/interfaces/post";
import { SiteUser } from "@/lib/interfaces/user";
import axios from "axios";
import {
	Timestamp,
	collection,
	doc,
	serverTimestamp,
	writeBatch,
} from "firebase/firestore";
import { useRecoilState } from "recoil";

const usePost = () => {
	const [postStateValue, setPostStateValue] = useRecoilState(postState);

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
				numberOfComments: 0,
				numberOfLikes: 0,
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
						},
						...prev.posts,
					],
				}));
			});
		} catch (error: any) {
			console.log("Firestore: Post Creation Error", error.message);
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
			await axios
				.post(apiConfig.apiEndpoint + "post/get-posts", {
					postType,
					lastPost,
				})
				.then((res) => {
					const { posts } = res.data;

					if (posts.length > 0) {
						setPostStateValue((prev) => ({
							...prev,
							posts: [...prev.posts, ...posts],
						}));
					} else {
						console.log("No posts found");
					}
				})
				.catch((err) => {
					console.log("API: get-posts error: ", err.message);
				});
		} catch (error: any) {
			console.log("Firestore: Fetching Announcements Error", error.message);
		}
	};

	return {
		postStateValue,
		setPostStateValue,
		createPost,
		fetchPosts,
	};
};

export default usePost;
