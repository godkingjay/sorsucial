import useAdmin from "@/hooks/useAdmin";
import React from "react";
import AddUserModal from "./AdminModals/AddUserModal";

type AdminModalsProps = {};

const AdminModals: React.FC<AdminModalsProps> = () => {
	const { adminModalStateValue, setAdminModalStateValue } = useAdmin();

	return (
		<>
			{adminModalStateValue.addUser.open && (
				<AddUserModal
					adminModalStateValue={adminModalStateValue}
					setAdminModalStateValue={setAdminModalStateValue}
				/>
			)}
		</>
	);
};

export default AdminModals;
