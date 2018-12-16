import {GET_ERRORS, SET_CURRENT_USER} from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

// register
export const registerUser = (userData, history) => dispatch => {
    // return{
    //     type: TEST_DISPATCH,
    //     payload: userData
    // }
     axios.post('/api/users/register', userData)
            .then(res => history.push('/login'))
            .catch(e => 
                dispatch({
                    type: GET_ERRORS,
                    payload: e.response.data
                })
            )

}

// login
export const loginUser = userData => dispatch => {
    axios.post('/api/users/login', userData)
        .then(res=> {
            const {token} = res.data;
            localStorage.setItem('jwtToken', token);
            // set token to auth header
            setAuthToken(token);
            // decode token to get data
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));
        })
        .catch(e => 
            dispatch({
                type: GET_ERRORS,
                payload: e.response.data
            })
        )
}

export const setCurrentUser = (decoded) => {
    return{
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

// logout
export const logoutUser = () = deispatch => {
    localStorage.removeItem('jwtToken');
    // remove auth header
    setAuthToken(false);
    // set current user to empty, isAuthenticated = false
    dispatch(setCurrentUser({}));
}