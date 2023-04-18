import Layout from "@/components/Layout/Layout";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<RecoilRoot>
			<Head>
				<title>SorSUcial</title>
				<meta
					name="description"
					property="og:description"
					content="SorSUcial is the unofficial social media platform for the University of Sorsogon State University."
				/>
				<meta
					name="site_name"
					property="og:site_name"
					content="SorSUcial"
				/>
				<link
					rel="icon"
					href="/assets/logo/sorsu-xs.png"
				/>
			</Head>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</RecoilRoot>
	);
}
