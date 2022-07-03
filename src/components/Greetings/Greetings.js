import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ADD_USER } from '../../redux-store/actions/userActions';
import { AiOutlinePlus } from 'react-icons/ai';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import rectLogo from '../../assets/img/react.svg';
import reduxLogo from '../../assets/img/redux.svg';
import pwaLogo from '../../assets/img/pwa.png';

/**
 * @validation schema
 * @return  {}
 */
const schema = yup.object({
	userId: yup
		.number('ID should be a number')
		.positive('Only positive number is allowed!')
		.integer('Only integer allowed!')
		.required('The field is required!'),
	userName: yup.string('Only string allowed').required('The field is required!'),
});

const Greetings = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	/**
	 * @method {useSelector}
	 * @param  {} => reduxStore
	 * To get the global redux store
	 */
	const reduxStore = useSelector((reduxStore) => reduxStore);

	/**
	 * @method {useDispatch}
	 * To change the global redux store
	 */
	const dispatch = useDispatch();

	/**
	 * @method onSubmit
	 * @param  {values} => event
	 */
	const onSubmit = (values) => {
		dispatch({
			type: ADD_USER,
			payload: values,
		});
		reset();
	};

	return (
		<div id="greetings">
			<div className="container text-center mt-5">
				<div className="author-img mb-2">
					<a href="https://kawsarbinsiraj.github.io/" target="_blank" className="d-inline-block">
						<img
							src="https://avatars.githubusercontent.com/u/38612699?v=4"
							style={{ width: '125px', height: '125px' }}
							alt="img"
							className="rounded-circle"
						/>
					</a>
				</div>
				<div className="logo d-inline-flex align-items-center">
					<a href="https://reactjs.org/" className="d-inline-block" target="_blank" rel="noreferrer">
						<img src={rectLogo} alt="React Logo" className="d-inline-block" height={100} />
					</a>
					<AiOutlinePlus size="2rem" className="me-3" />
					<a href="https://react-redux.js.org/" className="d-inline-block" target="_blank" rel="noreferrer">
						<img src={reduxLogo} alt="Redux Logo" className="d-inline-block" height={100} />
					</a>
					<AiOutlinePlus size="2rem" className="me-3" />
					<a href="hhttps://web.dev/progressive-web-apps" className="d-inline-block" target="_blank" rel="noreferrer">
						<img src={pwaLogo} alt="Pwa Logo" className="d-inline-block" height={100} />
					</a>
				</div>
				<h2 className="mt-3">welcome to react-redux-pwa-boilerplate</h2>
				<h5 className="my-1">edit me from 'src/pages/Home.js' </h5>
				<form onSubmit={handleSubmit(onSubmit)} className="mt-4">
					<small className="d-block text-primary mb-3">I'm form redux store , to change me you can dispatch via below the input tag </small>

					<label className="d-block col-md-6 col-lg-4 mx-auto mb-2" htmlFor="#">
						<input {...register('userId')} type="text" className="ps-2 mb-1 form-control" name="userId" placeholder="Enter User Id" />
						<p className="text-danger text-start mb-0">{errors.userId?.message}</p>
					</label>

					<label className="d-block col-md-6 col-lg-4 mx-auto mb-2" htmlFor="#">
						<input {...register('userName')} type="text" className="ps-2 form-control" name="userName" placeholder="Enter User Name" />
						<p className="text-danger text-start mb-0">{errors.userName?.message}</p>
					</label>
					<div className="d-block col-md-6 col-lg-4 mx-auto text-start mb-4" htmlFor="#">
						<button type="submit" className="btn btn-primary">
							Add User
						</button>
					</div>
					<pre id="json">{JSON.stringify(reduxStore, undefined, 2)}</pre>
				</form>
			</div>
		</div>
	);
};

export default Greetings;
