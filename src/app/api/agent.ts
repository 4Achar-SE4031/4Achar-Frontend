    import axios, { AxiosResponse } from "axios";
    import { User, UserForgetFormValues, UserFormValues, UserResponse } from "../models/user";


    const sleep = (delay: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    };

    axios.defaults.baseURL = "http://localhost:5000";

    const responseBody = <T>(response: AxiosResponse<T>) => response.data;

    const requests = {
        get: <T>(url: string) => axios.get<T>(url).then(responseBody),
        post: <T>(url: string, body: {}) =>
            axios.post<T>(url, body).then(responseBody),
        put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
        delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
    };

    const Account = {
        current: () => requests.get<User>("/account"),
        login: (user: UserFormValues) => requests.post<UserResponse>("/account/jwt/create", user),
        register: (user: UserFormValues) =>
            requests.post<User>("/account/signup", user),
        forget: (user: UserForgetFormValues) => requests.post<User>("/account/forget", user),
        verify: (num: string) => requests.post<number>("/account/verify", num),
        updateUser: (formData: FormData, token: string) =>
            axios.patch('/account/me/', formData, {
              headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }).then(responseBody),
    };

    const agent = {
        Account,
    };
    
    export default agent;