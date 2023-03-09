import AuthForm from "@/components/Form/AuthForm";
import Head from "next/head";
import Image from "next/image";
import React from "react";

type LoginPageProps = {};

const LoginPage: React.FC<LoginPageProps> = () => {
	return (
		<>
			<Head>
				<title>SorSUcial | Login</title>
				<meta
					name="description"
					content="SorSUcial is the unofficial social media for the University of Sorsogon State University."
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link
					rel="icon"
					href="/assets/logo/sorsu-xs.png"
				/>
			</Head>
			<div className="flex-1 relative bg-logo-500">
				<div className="w-full h-full flex flex-col items-center">
					<div className="w-full flex-1 limit-width flex flex-col p-8 items-center justify-center">
						<div className="w-full max-w-2xl h-max sm:h-[486px] bg-white rounded-2xl shadow-xl grid grid-rows-2 grid-cols-1 sm:grid-rows-1 sm:grid-cols-2">
							<div className="h-full w-full bg-logo-400 rounded-t-2xl sm:rounded-bl-2xl sm:rounded-tr-none flex flex-col items-center justify-center gap-y-4">
								<Image
									src="/assets/logo/sorsu-lg.png"
									alt="SorSUcial Logo"
									loading="lazy"
									width={256}
									height={256}
									className="h-full w-full object-contain max-h-48 max-w-48"
								/>
							</div>
							<AuthForm />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
