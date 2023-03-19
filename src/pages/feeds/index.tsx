import PostCreationListener from "@/components/Post/PostCreationListener";
import useUser from "@/hooks/useUser";
import React from "react";

type FeedsPageProps = {};

const FeedsPage: React.FC<FeedsPageProps> = () => {
	const { userStateValue } = useUser();

	return (
		<main className="flex flex-col w-full py-4 px-2">
			<section className="flex flex-col gap-y-4">
				{userStateValue.user.roles.includes("user") && (
					<PostCreationListener
						useStateValue={userStateValue}
						postType="feed"
					/>
				)}
			</section>
		</main>
	);
};

export default FeedsPage;
