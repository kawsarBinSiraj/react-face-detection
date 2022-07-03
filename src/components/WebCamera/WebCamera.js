import React, { useRef, useCallback, useState, useEffect } from 'react';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import Webcam from 'react-webcam';
import Select from 'react-select';
import { useDebounce } from '@react-hook/debounce';
import './WebCamera.scss';
import * as faceApi from 'face-api.js';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

const _ = require('lodash');
const axios = require('axios');
const cancelToken = axios.CancelToken;
const axiosCancelSource = cancelToken.source();

const WebCamera = () => {
	const [capturedImgSrc, setCapturedImgSrc] = useState(null);
	const [capturePermission, setCapturePermission] = useState(false);
	const [isDetectMoreFaces, setIsDetectMoreFaces] = useState(null);
	const [isWebcamReady, setIsWebcamReady] = useState(false);
	const [isDetectedFaceCentered, setIsDetectedFaceCentered] = useState(false);
	const [initialScreenSize, setInitialScreenSize] = useState({ label: 'Full Screen', value: { width: window?.innerWidth, height: window?.innerHeight } });
	const [screenSize, setScreenSize] = useDebounce(initialScreenSize);
	const [isCustomScreenSizeAllowed, setIsCustomScreenSizeAllowed] = useState(false);
	const webcamRef = useRef(null);
	const fullScreenHandle = useFullScreenHandle();
	const [isFullScreenModeEnable, setIsFullScreenModeEnable] = useState(false);

	/**
	 * @method  capture
	 * @desc  {}
	 * @type  {}
	 * @param  {}
	 * @return  {} =>{}
	 */
	const capture = useCallback(() => {
		const imgSrcByBase64 = webcamRef.current.getScreenshot();
		if (!_.isNil(imgSrcByBase64)) {
			setCapturedImgSrc(imgSrcByBase64);
			console.log(imgSrcByBase64);
		}
	}, [webcamRef]);

	/**
	 * @method  loadFaceApiModels
	 * @desc  {}
	 * @param  {}
	 * @return  {} =>{}
	 */
	const loadFaceApiModels = () => {
		Promise.all([
			faceApi.nets.tinyFaceDetector.loadFromUri(`${process.env.PUBLIC_URL}/face-api-models`),
			faceApi.nets.faceLandmark68Net.loadFromUri(`${process.env.PUBLIC_URL}/face-api-models`),
		]).then(() => {
			console.log('face-api models loaded !!');
		});
	};

	/**
	 * @method  handleOnUserMedia
	 * @desc  {}
	 * @param  {}
	 * @return  {} =>{}
	 */
	const handleOnUserMedia = async () => {
		loadFaceApiModels();
		const video = webcamRef?.current?.video;
		video.addEventListener('play', function () {
			setIsWebcamReady(true);
			setInterval(async () => {
				const detections = await faceApi.detectAllFaces(video, new faceApi.TinyFaceDetectorOptions());
				setCapturePermission(() => {
					if (_.size(detections) > 1) {
						setIsDetectMoreFaces(true);
						return false;
					} else if (_.size(detections) === 1) {
						setIsDetectMoreFaces(false);
						const { _box } = detections[0];
						const { _x, _y } = _box;
						const x = Math.round(_x);
						const y = Math.round(_y);

						if (x > 40 && x < 180 && y > 50 && y < 225) {
							setIsDetectedFaceCentered(true);
							capture();
						} else {
							setIsDetectedFaceCentered(false);
						}
						return true;
					} else {
						return false;
					}
				});
			}, 500);
		});
	};

	/**
	 * @method { onSelectSizeHandler}
	 * @desc  {}
	 * @param  {}
	 * @return  {} =>{}
	 */
	const onSelectSizeHandler = (val) => {
		setScreenSize(val);
		if (val?.label === 'Custom Size') {
			setIsCustomScreenSizeAllowed(true);
		} else {
			setIsCustomScreenSizeAllowed(false);
		}
	};

	/**
	 * @method { onCustomScreenSizeHandler}
	 * @desc  {}
	 * @type  {}
	 * @param  {}
	 * @return  {} =>{}
	 */
	const onCustomScreenSizeHandler = (e) => {
		e.preventDefault();
		let data = {};
		let formData = new FormData(e.currentTarget);
		for (let [key, value] of formData.entries()) {
			data[key] = value;
		}

		let customWidth = parseInt(data?.width);
		let customHeight = parseInt(data?.height);
		let screenWidth = window?.screen?.width;
		let screenHeight = window?.screen?.height;

		if (customWidth > screenWidth || customHeight > screenHeight) {
			return alert('Custom input not allowed over the screen width or height');
		} else {
			setScreenSize((state) => {
				return {
					...state,
					value: data,
				};
			});
		}
	};

	/**
	 * @method { componentWillUnmount}
	 * @desc  {}
	 * @type  {}
	 * @param  {}
	 * @return  {} =>{}
	 */
	useEffect(() => {
		return () => {
			axiosCancelSource.cancel('Cancel request.');
		};
	}, []);

	return (
		<>
			<FullScreen
				handle={fullScreenHandle}
				onChange={(isFullscreenEnabled) => {
					setIsFullScreenModeEnable(isFullscreenEnabled);
				}}
			>
				<div id="use-webcam" className="text-center position-relative overflow-hidden pt-4 pb-0">
					<div className="container-fluid px-0">
						<div className="webcam-configuration text-start mb-3 m-auto" style={{ minWidth: '300px' }}>
							{isFullScreenModeEnable === false && (
								<div className="wrapper d-flex justify-content-center gap-2 align-items-start">
									<div className="react-select w-100" style={{ maxWidth: '300px' }}>
										<Select
											className="react-select-webcam-config"
											defaultValue={screenSize}
											classNamePrefix="screen-mode"
											isDisabled={false}
											isLoading={false}
											isClearable={false}
											isRtl={false}
											isSearchable={true}
											onChange={(value) => {
												onSelectSizeHandler(value);
											}}
											options={[
												{ label: 'Full Screen', value: { width: window?.innerWidth, height: window?.innerHeight } },
												{
													label: 'Frame',
													options: [
														{ label: 'Landscape', value: { width: window?.innerWidth, height: window?.innerHeight / 1.25 } },
														{ label: 'Portrait', value: { width: '450', height: window?.innerHeight } },
													],
												},
												{ label: 'Custom Size', value: { width: screenSize?.value?.width, height: screenSize?.value?.height } },
											]}
										/>
										{isCustomScreenSizeAllowed === true && (
											<form
												style={{ maxWidth: '300px' }}
												onSubmit={(e) => {
													onCustomScreenSizeHandler(e);
												}}
												className="form-group mt-2 d-flex align-items-center justify-content-center m-auto gap-1"
											>
												<input
													type="number"
													min={200}
													defaultValue={screenSize?.value?.width}
													className="form-control form-control-sm"
													name="width"
													placeholder="Width"
												/>
												<input
													type="number"
													min={200}
													defaultValue={screenSize?.value?.height}
													className="form-control form-control-sm"
													name="height"
													placeholder="Height"
												/>
												<button type="submit" className="btn btn-dark bg-gradient btn-sm">
													Set
												</button>
											</form>
										)}
									</div>
									<button
										type="button"
										onClick={() => {
											fullScreenHandle.enter();
											setIsFullScreenModeEnable(true);
											setScreenSize({ label: 'Full Screen', value: { width: window?.innerWidth, height: window?.innerHeight } });
										}}
										className="btn btn-primary flex-shrink-0 bg-gradient"
									>
										Lock Screen
									</button>
								</div>
							)}
							{isFullScreenModeEnable === true && (
								<button
									type="button"
									onClick={() => {
										fullScreenHandle.exit();
										setIsFullScreenModeEnable(false);
										setScreenSize(initialScreenSize);
									}}
									style={{ zIndex: '100', width: '50px', height: '50px' }}
									className="btn btn-danger text-white position-absolute rounded-circle top-0 end-0 m-4 flex-shrink-0 bg-gradient"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
										<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
									</svg>
								</button>
							)}
						</div>
						<div id="camera-widget" className="position-relative m-auto d-inline-block">
							<div
								className="secondary-camera overflow-hidden m-auto"
								style={{ width: parseInt(screenSize?.value?.width), height: parseInt(screenSize?.value?.height) }}
							>
								<Webcam
									audio={false}
									style={{
										width: parseInt(screenSize?.value?.width),
										height: parseInt(screenSize?.value?.height),
										objectFit: 'cover',
										objectPosition: 'center',
									}}
									videoConstraints={{ facingMode: 'user', width: parseInt(screenSize?.value?.width), height: parseInt(screenSize?.value?.height) }}
								/>
							</div>
							<div
								style={{ width: '325px', height: '325px' }}
								className={`primary-camera ${isWebcamReady ? 'border' : null} rounded-circle position-absolute start-50 top-50 translate-middle ${
									capturePermission ? 'border-success' : 'border-danger'
								} `}
							>
								<Webcam
									style={{ width: '250px', height: '250px' }}
									className="rounded-circle position-absolute start-50 top-50 translate-middle opacity-0"
									audio={false}
									ref={webcamRef}
									videoConstraints={{ facingMode: 'user', width: 325, height: 325 }}
									onUserMedia={handleOnUserMedia}
									screenshotFormat="image/jpeg"
								/>
							</div>
							<div className="water-mark text-end p-4 pt-3  position-absolute text-dark w-100 top-0">
								<p className="mb-0 text-uppercase">ADVANCE PROJECT INTEGRATION</p>
							</div>
							{isWebcamReady && (
								<div className="detection-msg fs-5 fw-normal position-absolute text-white w-100 bottom-0 text-center pb-4 mt-1">
									<p className={`mb-0 ${isDetectMoreFaces && 'text-danger'}`}>
										<small>
											{isDetectMoreFaces === true
												? 'Only one face is allowed'
												: capturePermission === true
												? 'Successfully detected you'
												: 'Place your face within the frame to take photo'}
										</small>
									</p>
									<p className={`mb-0 text-danger ${capturePermission === true && isDetectedFaceCentered === false ? 'd-block' : 'd-none'}`}>
										<BsFillInfoCircleFill /> &nbsp;
										<small>Please stand on the center</small>
									</p>
								</div>
							)}
						</div>
						{/* {!_.isNil(capturedImgSrc) && <img src={capturedImgSrc} alt="img-fluid" className="d-block mt-2 w-25" />} */}
					</div>
				</div>
			</FullScreen>
		</>
	);
};

export default WebCamera;
