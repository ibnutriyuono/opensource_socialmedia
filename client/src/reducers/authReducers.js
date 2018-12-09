const initialState = {
    isAuthenticated: false,
    user: {},
    hello: "World"
}

export default (state = initialState, action) => {
    switch(action.type){
        default:
            return state;
    }
}