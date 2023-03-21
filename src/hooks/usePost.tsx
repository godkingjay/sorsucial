import { postState } from "@/atoms/postAtom";
import { CreatePostType } from "@/components/Modal/PostCreationModal";
import { db } from "@/firebase/clientApp";
import { SitePost } from "@/lib/interfaces/post";
import axios from "axios";
import {
	Timestamp,
	collection,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	serverTimestamp,
	where,
	writeBatch,
} from "firebase/firestore";
import { useRecoilState } from "recoil";

const usePost = () => {
	const [postStateValue, setPostStateValue] = useRecoilState(postState);

	const createPost = async (postForm: CreatePostType) => {
		try {
			const batch = writeBatch(db);

			const postRef = doc(collection(db, "posts"));

			const newPost: SitePost = {
				id: postRef.id,
				creatorId: postForm.creatorId!,
				privacy: postForm.privacy,
				postTitle: postForm.postTitle,
				postBody: postForm.postBody,
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
					posts: [newPost, ...prev.posts],
				}));
			});
		} catch (error: any) {
			console.log("Firestore: Post Creation Error", error.message);
		}
	};

	const fetchPosts = async (postType: SitePost["postType"]) => {
		try {
			await axios
				.post("/api/post/get-posts", {
					postType,
				})
				.then((res) => {
					if (res.data.success) {
						const { posts } = res.data;

						if (posts.length > 0) {
							setPostStateValue((prev) => ({
								...prev,
								posts: [...prev.posts, ...posts],
							}));
						} else {
							console.log("No posts found");
						}
					} else {
						console.log("API: get-posts error: ", res.data.message);
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
