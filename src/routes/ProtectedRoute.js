import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
	const isAuth = true;
	if (!isAuth) return <Navigate to={'/login'} />;
	return <Outlet />;
};

export default ProtectedRoute;
