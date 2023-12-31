// Copyright (c) Tribufu. All Rights Reserved.

export type OAuth2ClientType = "web" | "native";
export type OAuth2GrantType = "authorization_code" | "client_credentials" | "device_code" | "password" | "passkey" | "refresh_token";
export type OAuth2ResponseType = "code" | "token";
export type OAuth2TokenHintType = "refresh_token" | "access_token";
export type OAuth2TokenType = "bearer";

export interface OAuth2AuthorizeRequest {
    response_type: OAuth2ResponseType;
    client_id: string;
    client_secret: string;
    scope?: string | null;
    redirect_uri: string;
    state?: string | null;
};

export interface OAuth2CodeResponse {
    code: string;
    state?: string | null;
};

export interface OAuth2TokenRequest {
    grant_type: OAuth2GrantType;
    code?: string | null;
    refresh_token?: string | null;
    username?: string | null;
    password?: string | null;
    passkey?: string | null;
    client_id: string;
    client_secret: string;
    redirect_uri?: string | null;
};

export interface OAuth2TokenResponse {
    token_type: OAuth2TokenType;
    access_token: string;
    refresh_token?: string | null;
    scope?: string | null;
    state?: string | null;
    expires_in: number;
};

export interface OAuth2RevokeRequest {
    token: string;
    token_type_hint: OAuth2TokenHintType;
};

export interface OAuth2IntrospectionResponse {
    active: boolean;
    client_id?: string | null;
    username?: string | null;
    scope?: string | null;
    exp?: number | null;
};
