// initialState
const initialState = {
	users: [],
};

// Use the initialState as a default value
function userReducer(state = initialState, action) {
	// The reducer normally looks at the action type field to decide what happens
	switch (action.type) {
		case 'ADD_USER':
			let u = state.users;
			u.push(action.payload);
			return {
				...state,
				users: u,
			};

		default:
			// If this reducer doesn't recognize the action type, or doesn't
			// care about this specific action, return the existing state unchanged
			return state;
	}
}

export default userReducer;
