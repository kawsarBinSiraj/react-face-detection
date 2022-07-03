import React from 'react';
import ApplicationHelmet from './../components/ApplicationHelmet/ApplicationHelmet';
import WebCamera from '../components/WebCamera/WebCamera';

const Home = () => {
	return (
		<>
			<ApplicationHelmet title="Home" description="" />
			<WebCamera />
		</>
	);
};

export default Home;
