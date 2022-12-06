import React, { useCallback, useState, useEffect, useRef } from "react";

export const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const activeHttpRequests = useRef([]);

	const sendRequest = useCallback(
		async (url, method = "GET", body = null, headers = {}) => {
			setIsLoading(true);
			const HttpAbortCtrl = new AbortController();
			activeHttpRequests.current.push(HttpAbortCtrl);
			try {
				const response = await fetch(url, {
					method,
					body,
					headers,
					signal: HttpAbortCtrl.signal,
				});

				const responseData = await response.json();

				activeHttpRequests.current = activeHttpRequests.current.filter(
					(reqCtrl) => reqCtrl !== HttpAbortCtrl
				);

				if (!response.ok) {
					throw new Error(responseData.message);
				}
				setIsLoading(false);

				return responseData;
			} catch (error) {
				setError(error.message);
				setIsLoading(false);
				console.log(error);
				throw error;
			}
		},
		[]
	);
	const clearError = () => {
		setError(null);
	};

	useEffect(() => {
		return () => {
			activeHttpRequests.current.forEach((abortCtrl) =>
				abortCtrl.abort()
			);
		};
	}, []);
	return { isLoading, error, sendRequest, clearError };
};
