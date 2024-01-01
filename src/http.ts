// Copyright (c) Tribufu. All Rights Reserved.

export type HeaderMap = {
    [key: string]: string
};

export type CookieMap = {
    [key: string]: string;
};

export interface ErrorResponse {
    error: string;
};

export interface MessageResponse {
    message: string;
};
