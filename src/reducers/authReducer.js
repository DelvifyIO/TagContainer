import {
  AUTH_SET_USER,
  AUTH_SET_STATUS,
  AUTH_SET_ERROR_MSG,
} from "../actions/types";

import { STATUS } from "../utils/enums";

const initialState = {
  status: STATUS.IDLE,
  user: null,
  token: null,
  errorMsg: null,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case AUTH_SET_STATUS:
      return {
        ...state,
        status: payload,
      };
    case AUTH_SET_USER:
      return {
        ...state,
        user: payload.user,
        token: payload.token,
      };
    case AUTH_SET_ERROR_MSG:
      return {
        ...state,
        errorMsg: payload,
      };
    default:
      return state;
  }
}
