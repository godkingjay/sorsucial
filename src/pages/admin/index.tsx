import AdminPageLayout from "@/components/Layout/AdminPageLayout";
import React from "react";

type AdminPageProps = {};

const AdminPage: React.FC<AdminPageProps> = () => {
	return (
		<AdminPageLayout>
			<main>
				<p>AdminPage</p>
			</main>
		</AdminPageLayout>
	);
};

export default AdminPage;
