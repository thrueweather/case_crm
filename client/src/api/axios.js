import axios from 'axios';
import { getInternalToken } from 'utils';

export const request = () => {
    const token = getInternalToken();
    const withAuthToken = token && { Authorization: 'Token ' + token };
    const params = {
        baseURL: process.env.REACT_APP_BACKEND_URL,
        headers: { ...withAuthToken },
    };
    return axios.create(params);
};
