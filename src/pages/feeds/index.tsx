import LimitedBodyLayout from "@/components/Layout/LimitedBodyLayout";
import PostCreationListener from "@/components/Post/PostCreationListener";
import useUser from "@/hooks/useUser";
import Head from "next/head";
import React from "react";

type FeedsPageProps = {};

const FeedsPage: React.FC<FeedsPageProps> = () => {
	const { userStateValue } = useUser();

	return (
		<>
			<Head>
				<title>Feeds | SorSUcial</title>
			</Head>
			<main className="flex flex-col w-full py-4 px-2">
				<LimitedBodyLayout>
					<section className="flex flex-col gap-y-4">
						{userStateValue.user.roles.includes("user") && (
							<PostCreationListener
								useStateValue={userStateValue}
								postType="feed"
							/>
						)}
					</section>
				</LimitedBodyLayout>
			</main>
		</>
	);
};

export default FeedsPage;
