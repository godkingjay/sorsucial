import useAdmin from "@/hooks/useAdmin";
import React from "react";
import AddUserModal from "./AdminModals/AddUserModal";

type AdminModalsProps = {};

const AdminModals: React.FC<AdminModalsProps> = () => {
	const {
		adminModalStateValue,
		setAdminModalStateValue,
		checkUserEmailExists,
	} = useAdmin();

	return (
		<>
			{adminModalStateValue.addUser.open && (
				<AddUserModal
					adminModalStateValue={adminModalStateValue}
					setAdminModalStateValue={setAdminModalStateValue}
					checkUserEmailExists={checkUserEmailExists}
				/>
			)}
		</>
	);
};

export default AdminModals;
