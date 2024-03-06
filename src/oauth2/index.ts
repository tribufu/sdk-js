// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

/**
 * Helper type to represent OAuth2 client type.
 */
export type OAuth2ClientType = "web" | "native";

/**
 * Helper type to represent OAuth2 grant type.
 */
export type OAuth2GrantType = "authorization_code" | "client_credentials" | "device_code" | "password" | "passkey" | "refresh_token";

/**
 * Helper type to represent OAuth2 response type.
 */
export type OAuth2ResponseType = "code" | "token";

/**
 * Helper type to represent OAuth2 token hint type.
 */
export type OAuth2TokenHintType = "refresh_token" | "access_token";

/**
 * Helper type to represent OAuth2 token type.
 */
export type OAuth2TokenType = "bearer";

/**
 * Helper type to represent OAuth2 authorize request body.
 */
export interface OAuth2AuthorizeRequest {
    response_type: OAuth2ResponseType;
    client_id: string;
    client_secret: string;
    scope?: string | null;
    redirect_uri: string;
    state?: string | null;
};

/**
 * Helper type to represent OAuth2 authorize response body.
 */
export interface OAuth2CodeResponse {
    code: string;
    state?: string | null;
};

/**
 * Helper type to represent OAuth2 token request body.
 */
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

/**
 * Helper type to represent OAuth2 revoke request body.
 */
export interface OAuth2RevokeRequest {
    token: string;
    token_type_hint: OAuth2TokenHintType;
};

/**
 * Helper type to represent OAuth2 token response body.
 */
export interface OAuth2TokenResponse {
    token_type: OAuth2TokenType;
    access_token: string;
    refresh_token?: string | null;
    scope?: string | null;
    state?: string | null;
    expires_in: number;
};

/**
 * Helper type to represent OAuth2 introspection request body.
 */
export interface OAuth2IntrospectionRequest {
    token: string;
    token_type_hint: OAuth2TokenHintType;
};

/**
 * Helper type to represent OAuth2 introspection response body.
 */
export interface OAuth2IntrospectionResponse {
    active: boolean;
    client_id?: string | null;
    username?: string | null;
    scope?: string | null;
    exp?: number | null;
};
