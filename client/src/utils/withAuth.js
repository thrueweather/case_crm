import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { getInternalToken } from 'utils';
import * as Api from 'api/repository';
import * as path from 'constants/routes';
import { fetchSuccessed } from 'store/reducers/user';

export const withAuth = WrappedComponent => props => {
    const history = useHistory();
    const dispatch = useDispatch();
    const token = getInternalToken();

    const clearStorageAndRedirect = useCallback(() => {
        localStorage.clear();
        sessionStorage.clear();
        history.push(path.SIGN_IN);
    }, [history]);

    const checkAutorization = useCallback(async () => {
        if (!token) return clearStorageAndRedirect();
        try {
            const user = await Api.fetchUser();
            dispatch(fetchSuccessed(user));
        } catch (error) {
            clearStorageAndRedirect();
        }
    }, [clearStorageAndRedirect, token, dispatch]);

    useEffect(() => checkAutorization(), [checkAutorization]);

    return <WrappedComponent {...props} />;
};
