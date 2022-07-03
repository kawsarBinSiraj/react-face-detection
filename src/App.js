import "./App.scss"
import "react-toastify/dist/ReactToastify.css"
import { BrowserRouter } from "react-router-dom"
import Routes from "./routes/Routes"
import { ToastContainer } from "react-toastify"
import { Provider } from 'react-redux'
import { store, persistor } from './redux-store/Store'
import { PersistGate } from 'redux-persist/integration/react'
const axios = require('axios');



/**
 * Axios Global Config
 *
 * @type {string}
 */

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL



function App() {
	return (
		<>
			<Provider store={store}>
				<BrowserRouter basename="/api-access-control">
					<PersistGate loading={null} persistor={persistor}>
						<Routes />
					</PersistGate>
					<ToastContainer />
				</BrowserRouter>
			</Provider>
		</>
	)
}

export default App


