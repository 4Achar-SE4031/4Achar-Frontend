export interface User {
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    gender?: string;
    birthDate?: string;
    province?: string;
    city?: string;
    profilePictureUrl?: string;
}

export interface UserFormValues {
    username: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

export interface UserForgetFormValues {
    email: string;
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}

export interface UserResponse {
    token?: string;
    expires?: string;
    message?: string;
}

export interface ChangePassword {
    oldPassword: string;
    newPassword: string;
}

export interface UpdateUser {
    firstName?: string;
    lastName?: string;
    userName?: string;
    email?: string;
}