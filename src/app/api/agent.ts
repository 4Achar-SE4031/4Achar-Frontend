import axios, { AxiosResponse } from "axios";
import { ChangePassword, UpdateUser, User, UserForgetFormValues, UserFormValues, UserResponse } from "../models/user";
import { Event } from "../models/event";
import { ConcertsResponse } from "../models/concertResponse";
import CommentData, { CreateCommentDto, UpdateCommentDto } from "../../features/Comment/types";
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
    list: (queryParams?: any): Promise<ConcertsResponse> =>
        requests.get<ConcertsResponse>(
            `/Concert${queryParams ? "?" + queryParams : ""}`
        ),
};

const Comments = {
    fetchComments: (eventId: number): Promise<{ comments: CommentData[] }> =>
      requests.get<{ comments: CommentData[] }>(`/api/comments/event/${eventId}`),
  
    addComment: (comment: CreateCommentDto): Promise<CommentData> =>
      requests.post<CommentData>("/api/comments", comment),
  
    updateComment: (commentId: number, updatedContent: UpdateCommentDto): Promise<CommentData> =>
      requests.put<CommentData>(`/api/comments/${commentId}`, updatedContent),
  
    toggleLike: (commentId: number): Promise<{ hasLiked: boolean; score: number }> =>
      requests.post<{ hasLiked: boolean; score: number }>(`/api/comments/${commentId}/toggle-like`, {}),
  
    addReply: (comment: CreateCommentDto): Promise<CommentData> =>
      requests.post<CommentData>("/api/comments", comment),
  
    deleteComment: (commentId: number): Promise<void> =>
      requests.delete<void>(`/api/comments/${commentId}`),
  };

const agent = {
    Account,
    Events,
    Comments
};

export default agent;


// Name	Description
// Title   string

// StartRange  string

// EndRange    string

// Province    string

// City    string

// Category    string

// TicketPriceRangeStart   string

// TicketPriceRangeEnd string

// Skip    integer($int32)

// Take    integer($int32)
