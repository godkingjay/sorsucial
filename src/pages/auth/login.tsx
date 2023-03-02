import Head from "next/head";
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
			<div>LoginPage</div>
		</>
	);
};

export default LoginPage;
