import AuthForm from "@/components/Form/AuthForm";
import Head from "next/head";
import React, { useEffect } from "react";
import SorSUcialLogo from "public/assets/logo/sorsucial.svg";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";

type SignInPageProps = {};

const SignInPage: React.FC<SignInPageProps> = () => {
	const { authUser, authLoading } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (authUser && !authLoading) {
			router.push("/");
		}
	}, [authUser, authLoading]);

	if (authLoading) {
		return <div>Loading</div>;
	}

	return (
		<>
			<Head>
				<title>SorSUcial | Sign In</title>
				<meta
					name="description"
					content="SorSUcial is the unofficial social media for the University of Sorsogon State University."
				/>
			</Head>
			<div className="flex-1 relative h-full">
				<div className="w-full h-full flex flex-col items-center">
					<div className="w-full flex-1 limit-width flex flex-col px-8 py-16 items-center justify-center">
						<div className="w-full max-w-2xl h-max sm:h-[486px] bg-white rounded-2xl shadow-around-sm grid grid-rows-2 grid-cols-1 sm:grid-rows-1 sm:grid-cols-2">
							<div className="h-full w-full bg-logo-400 rounded-t-2xl sm:rounded-bl-2xl sm:rounded-tr-none flex flex-col items-center justify-center gap-y-4">
								<div className="h-48 w-48">
									<SorSUcialLogo className="h-full w-full aspect-square [&_path]:fill-white" />
								</div>
							</div>
							<AuthForm />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignInPage;
