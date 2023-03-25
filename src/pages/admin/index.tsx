import Head from "next/head";
import React from "react";

type AdminPageProps = {};

const AdminPage: React.FC<AdminPageProps> = () => {
	return (
		<>
			<Head>
				<title>Dashboard | SorSUcial</title>
			</Head>
			<main>
				<p>AdminPage</p>
			</main>
		</>
	);
};

export default AdminPage;
