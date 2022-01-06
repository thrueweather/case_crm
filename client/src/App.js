import { Switch, Route } from 'react-router-dom';

import SignIn from 'pages/SignIn/sign-in';
import Homepage from 'pages/Homepage';
import Leads from 'pages/Leads';
import Cases from 'pages/Deals';
import Profile from 'pages/Profile';
import Deal from 'pages/Deals/Deal';
import Reports from 'pages/Reports';
import Notifications from 'pages/Notifications';
import Tasks from 'pages/Tasks';

import MainWrapper from 'components/MainWrapper';

import * as path from 'constants/routes';

import './App.scss';

function App() {
    const APP_ROUTES = {
        STATIC_ROUTES: [{ path: path.SIGN_IN, component: SignIn }],
        DYNAMIC_ROUTES: [
            { path: path.DASHBOARD, component: Homepage },
            { path: path.LEADS, component: Leads },
            { path: path.CASES, component: Cases },
            { path: path.PROFILE, component: Profile },
            { path: path.DEAL, component: Deal },
            { path: path.REPORTS, component: Reports },
            { path: path.NOTIFICATIONS, component: Notifications },
            { path: path.TASKS, component: Tasks },
        ],
    };
    return (
        <Switch>
            {APP_ROUTES.STATIC_ROUTES.map((route, index) => (
                <Route exact key={index} {...route} />
            ))}
            <MainWrapper>
                {APP_ROUTES.DYNAMIC_ROUTES.map((route, index) => (
                    <Route exact key={index} {...route} />
                ))}
            </MainWrapper>
        </Switch>
    );
}

export default App;
