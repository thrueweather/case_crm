import { genders } from 'utils';
import { request } from './axios';

export const signIn = async variables => {
    try {
        const response = await request().post('/auth/login/', { ...variables });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const changePassword = async variables => {
    try {
        const response = await request().post('/auth/password/change/', { ...variables });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const fetchUser = async () => {
    try {
        const response = await request().get('/api/users/me/');
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const fetchStatistic = async () => {
    try {
        const response = await request().get('/api/users/me/statistic/');
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const fetchLeads = async () => {
    try {
        const response = await request().get('api/leads/');
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const buyLead = async id => {
    try {
        const response = await request().post(`api/leads/${id}/buy/`);
        return Promise.resolve(response);
    } catch (error) {
        return Promise.resolve(error);
    }
};

export const fetchDeals = async params => {
    try {
        const response = await request().get(`api/deals/${params || ''}`);
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const fetchDeal = async id => {
    try {
        const response = await request().get(`api/deals/${id}/`);
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const createDeal = async variables => {
    try {
        const response = await request().post('api/deals/', {
            ...variables,
            mobile_phone: variables.mobile_phone || '',
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const editDeal = async (id, variables) => {
    try {
        const response = await request().put(`api/deals/${id}/`, {
            ...variables,
            mobile_phone: variables.mobile_phone || '',
            gender: genders[variables.gender],
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getStatuses = async () => {
    try {
        const response = await request().get('api/status/');
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const setStatus = async (id, variables) => {
    try {
        const response = await request().post(`api/deals/${id}/status/`, { ...variables });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getProductForm = async () => {
    try {
        const response = await request().get('api/product-form/');
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const addProduct = async (id, variables) => {
    try {
        const response = await request().post(`/api/deals/${id}/product/`, {
            ...variables,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const addTask = async (id, variables) => {
    try {
        const response = await request().post(`/api/deals/${id}/tasks/`, {
            ...variables,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const addNotes = async (id, variables) => {
    try {
        const response = await request().post(`/api/deals/${id}/notes/`, variables);
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateNotes = async (id, variables) => {
    try {
        const response = await request().put(`/api/deals/${id}/notes/`, {
            ...variables,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deactivateLead = async id => {
    try {
        await request().post(`/api/leads/${id}/deactivate/`);
        return Promise.resolve({ success: true, status: 200 });
    } catch (error) {
        return Promise.reject(error);
    }
};

export const fetchNotifications = async params => {
    try {
        const response = await request().get(`/api/notification/${params || ''}`);
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const markNotifications = async ids => {
    try {
        const response = await request().post(`/api/notification/mark/`, { notification_ids: ids });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const unmarkNotifications = async ids => {
    try {
        const response = await request().post(`/api/notification/unmark/`, {
            notification_ids: ids,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteNotifications = async ids => {
    try {
        const response = await request().post(`/api/notification/delete/`, {
            notification_ids: ids,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteCase = async id => {
    try {
        const response = await request().delete(`/api/deals/${id}/ `);
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const removeHistoryRecord = async (caseId, recordId) => {
    try {
        const response = await request().delete(`/api/deals/${caseId}/history/${recordId}/`);
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const fetchTasks = async params => {
    try {
        const response = await request().get(`api/tasks/${params || ''}`);
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const removeTask = async taskId => {
    try {
        await request().delete(`api/tasks/${taskId}/ `);
        return Promise.resolve(true);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const fetchReports = async params => {
    try {
        const response = await request().get(`/api/users/me/report/${params || ''}`);
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateTasks = async (id, variables) => {
    try {
        const response = await request().put(`/api/tasks/${id}/`, {
            ...variables,
        });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const exportReports = async params => {
    try {
        const response = await request().get(`/api/users/me/report/export/?form=${params}`, {
            responseType: 'blob',
          });
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};