import React from 'react';
import { Routes as PathWays, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
// pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';


const Routes = () => {
	return (
		<>
			<PathWays>
				<Route path="/" element={<ProtectedRoute />}>
					<Route path="" element={<Home />} />
				</Route>
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<NotFound />} />
			</PathWays>
		</>
	);
};
export default Routes;
