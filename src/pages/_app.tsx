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
				<link
					rel="icon"
					href="/assets/logo/sorsu-xs.png"
				/>

				{/* Facebook, LinkedIn, Instagram, Reddit, Tumblr OpenGraph */}
				<meta
					property="og:title"
					content="SorSUcial"
				/>
				<meta
					property="og:description"
					content="SorSUcial is the unofficial social media platform for the University of Sorsogon State University."
				/>
				<meta
					property="og:type"
					content="website"
				/>
				<meta
					property="og:url"
					content="https://yoursite.com/"
				/>
				<meta
					property="og:image"
					content="/assets/logo/sorsucial-c-lg.png"
				/>
				<meta
					property="og:image:alt"
					content="SorSUcial logo"
				/>
				<meta
					property="og:site_name"
					content="SorSUcial"
				/>

				{/* Twitter OpenGraph */}
				<meta
					name="twitter:card"
					content="summary_large_image"
				/>
				<meta
					name="twitter:site"
					content="@yourTwitterHandle"
				/>
				<meta
					name="twitter:title"
					content="SorSUcial"
				/>
				<meta
					name="twitter:description"
					content="SorSUcial is the unofficial social media platform for the University of Sorsogon State University."
				/>
				<meta
					name="twitter:image"
					content="/assets/logo/sorsucial-c-lg.png"
				/>
			</Head>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</RecoilRoot>
	);
}
