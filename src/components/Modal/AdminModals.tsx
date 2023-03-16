import useAdmin from "@/hooks/useAdmin";
import React from "react";

type AdminModalsProps = {};

const AdminModals: React.FC<AdminModalsProps> = () => {
	const { adminModalStateValue, setAdminModalStateValue } = useAdmin();

	return <></>;
};

export default AdminModals;
