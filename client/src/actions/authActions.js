import {GET_ERRORS} from './types';
import axios from 'axios';

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

        })
        .catch(e => 
            dispatch({
                type: GET_ERRORS,
                payload: e.response.data
            })
        )
}