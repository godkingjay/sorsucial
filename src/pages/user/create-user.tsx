import CreateUserForm from "@/components/Form/Auth/CreateUser/CreateUserForm";
import Head from "next/head";
import React from "react";

type CreateUserPageProps = {};

const CreateUserPage: React.FC<CreateUserPageProps> = () => {
	return (
		<>
			<Head>
				<title>SorSUcial | Create User</title>
				<meta
					name="description"
					content="SorSUcial is the unofficial social media for the University of Sorsogon State University."
				/>
			</Head>
			<div className="flex flex-col items-center h-full relative px-8 py-16">
				<CreateUserForm />
			</div>
		</>
	);
};

export default CreateUserPage;
