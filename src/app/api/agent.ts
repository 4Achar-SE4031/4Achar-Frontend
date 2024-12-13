import axios, { AxiosResponse } from "axios";
import { ChangePassword, UpdateUser, User, UserForgetFormValues, UserFormValues, UserResponse } from "../models/user";
import { Event } from "../models/event";
import { useAuth } from "../../features/user/login/authProvider";
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

axios.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('token');
        console.log(token);
        if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
        console.log("error token");
    }

    return config;
});

axios.defaults.baseURL = "https://api-concertify.darkube.app";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) =>
        axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Account = {
    current: () => requests.get<User>("/account/me"),
    login: (user: UserFormValues) => requests.post<UserResponse>("/account/jwt/create", user),
    register: (user: UserFormValues) =>
        requests.post<User>("/account/signup", user),
    forget: (user: UserForgetFormValues) => requests.post<User>("/account/forget", user),
    verify: (num: string) => requests.post<number>("/account/verify", num),
    updateUser: (formData: UpdateUser,) =>
        requests.put<any>('/account/me/update', formData).then(responseBody),
    updatePassword: (passwords: ChangePassword) => requests.put<any>("/account/me/change_password", passwords).then(responseBody),
};

const Events = {
    list: (): Promise<Event[]> => requests.get<Event[]>('/events'),
};

const agent = {
    Account,
    Events
};

export default agent;