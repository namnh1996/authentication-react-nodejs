import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModel from "../../shared/components/UIElements/ErrorModel";
import { useHttpClient } from "../../shared/hooks/http-hook";
const Users = () => {
	const [loadedUsers, setLoadedUsers] = useState();
	const { isLoading, error, clearError, sendRequest } = useHttpClient();
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const resposeData = await sendRequest(
					"http://localhost:5000/api/users"
				);
				setLoadedUsers(resposeData.users);
			} catch (error) {}
		};
		fetchUsers();
	}, [sendRequest]);
	return (
		<React.Fragment>
			<ErrorModel error={error} onClear={clearError} />
			{!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
		</React.Fragment>
	);
};

export default Users;
