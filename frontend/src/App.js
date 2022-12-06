import React, { useState, useCallback } from "react";
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from "react-router-dom";

import Users from "./user/pages/Users";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";

const App = () => {
	const [token, setToken] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userId, setUserId] = useState(null);

	const login = useCallback((uid, token) => {
		setToken(token);
		setIsLoggedIn(true);
		setUserId(uid);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setIsLoggedIn(false);
		setUserId(null);
	}, []);

	let routes;

	if (token) {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Users />
				</Route>
				<Redirect to="/" />
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Users />
				</Route>
				<Route path="/auth">
					<Auth />
				</Route>
				<Redirect to="/auth" />
			</Switch>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				userId: userId,
				login: login,
				logout: logout,
			}}
		>
			<Router>
				<MainNavigation />
				<main>{routes}</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;
