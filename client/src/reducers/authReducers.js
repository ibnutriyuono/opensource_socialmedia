const initialState = {
    isAuthenticated: false,
    user: {},
    hello: "World"
}

export default (state = initialState, action) => {
    switch(action.type){
        // case TEST_DISPATCH:
        //     return {
        //         ...state,
        //         user: action.payload
        //     }
        default:
            return state;
    }
}