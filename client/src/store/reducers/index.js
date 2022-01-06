import { configureStore } from '@reduxjs/toolkit';
import user from './user';
import leads from './leads';
import deals from './deals';
import notifications from './notifications';
import statistic from './statistic';
import tasks from './tasks';
import reports from './reports';

const store = configureStore({
    reducer: {
        user,
        leads,
        deals,
        notifications,
        statistic,
        tasks,
        reports,
    },
});

export default store;
