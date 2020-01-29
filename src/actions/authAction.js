import {
  AUTH_SET_USER,
  AUTH_SET_STATUS,
  AUTH_SET_ERROR_MSG,
} from "./types";
import { stringify } from 'qs';

import { STATUS } from '../utils/enums';

export const setStatus = (status) => dispatch => {
    dispatch({
        type: AUTH_SET_STATUS,
        payload: status,
    });
    return Promise.resolve();
};

export const setUser = (user, token) => dispatch => {
    dispatch({
        type: AUTH_SET_USER,
        payload: { user, token },
    });
    return Promise.resolve();
};

export const setErrorMsg = (error) => dispatch => {
    dispatch({
        type: AUTH_SET_ERROR_MSG,
        payload: error,
    })
};

export const login = ({ username, password }) => dispatch => {
    dispatch(setStatus(STATUS.LOADING));
    return window.api.post('auth/login', { username, password })
        .then((result) => {
            const { admin: user, token } = result;
            dispatch(setStatus(STATUS.SUCCESS));
            dispatch(setUser({ username: user.username }, token));
            localStorage.setItem("jwtToken", token);
        })
        .catch((error) => {
            dispatch(setStatus(STATUS.ERROR));
            if (error.status === 401) {
                dispatch(setErrorMsg({ message: 'Unauthorized' }));
            } else {
                dispatch(setErrorMsg(error.response));
            }
            return Promise.reject();
        });
};

export const logout = () => dispatch => {
    localStorage.removeItem("jwtToken");
    return dispatch(setUser(null, null));
};

