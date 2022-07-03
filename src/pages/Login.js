import React from 'react';
import face from '../assets/img/facial-recognition.png';
import { Link } from 'react-router-dom';

const Login = () => {
	return (
		<div className="login">
			<div className="container-fluid p-0">
				<div className="row vh-100 gx-0">
					<div className="col-lg-7 d-none d-lg-block h-100">
						<div className="login-right-block bg-primary d-flex align-items-center justify-content-center bg-gradient h-100 p-5">
							<img src={face} alt="face" style={{ maxWidth: '500px', filter: 'invert(1)' }} className="img-fluid d-inline-block mb-3" />
						</div>
					</div>
					<div className="col-lg-5 h-100 d-flex align-items-center justify-content-center">
						<form action="#" className="p-5 text-center m-auto w-100" style={{ maxWidth: '450px' }}>
							<h2 className="fs-4 fw-normal text-center mb-5">Verify With License</h2>
							<div className="form-floating">
								<input type="email" className="form-control rounded-0 rounded-top" id="email" placeholder="name@example.com" />
								<label htmlFor="email">License Email</label>
							</div>
							<div className="form-floating">
								<input
									type="password"
									className="form-control rounded-0 rounded-bottom"
									id="license"
									placeholder="License Code"
									style={{ marginTop: '-1px' }}
								/>
								<label htmlFor="license">License Code</label>
							</div>
							<div className="form-group text-center mt-4">
								<button className="w-100 btn btn-lg btn-primary bg-gradient mb-2" type="submit">
									Verify
								</button>
								<p className="mb-0">
									Don't have a license code?{' '}
									<Link to={'/login'} className="text-decoration-none">
										Subscribe
									</Link>
								</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
