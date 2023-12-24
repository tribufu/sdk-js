// Copyright (c) Tribufu. All Rights Reserved.

export type OAuth2ResponseType = "code" | "token";

export type OAuth2TokenType = "bearer";

export type OAuth2GrantType = "authorization_code" | "refresh_token" | "password";

export type OAuth2TokenHintType = "refresh_token" | "access_token";

export class OAuth2AuthorizeRequest {
    response_type: OAuth2ResponseType;
    client_id: string;
    scope: string | null;
    redirect_uri: string;
    state: string | null;

    constructor(client_id: string, redirect_uri: string, response_type: OAuth2ResponseType, scope: string, state: string) {
        this.client_id = client_id;
        this.redirect_uri = redirect_uri;
        this.response_type = response_type;
        this.scope = scope;
        this.state = state;
    }
};

export class OAuth2CodeResponse {
    code: string;
    state: string | null;

    constructor(code: string, state: string) {
        this.code = code;
        this.state = state;
    }
};

export class OAuth2TokenRequest {
    grant_type: OAuth2GrantType;
    code: string | null;
    refresh_token: string | null;
    username: string | null;
    password: string | null;
    client_id: string;
    client_secret: string;
    redirect_uri: string | null;

    constructor(grant_type: OAuth2GrantType, code: string, refresh_token: string, username: string, password: string, client_id: string, client_secret: string, redirect_uri: string) {
        this.grant_type = grant_type;
        this.code = code;
        this.refresh_token = refresh_token;
        this.username = username;
        this.password = password;
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.redirect_uri = redirect_uri;
    }
};

export class OAuth2TokenResponse {
    token_type: OAuth2TokenType;
    access_token: string;
    refresh_token: string;
    scope: string | null;
    expires_in: number;

    constructor(token_type: OAuth2TokenType, access_token: string, refresh_token: string, scope: string, expires_in: number) {
        this.token_type = token_type;
        this.access_token = access_token;
        this.refresh_token = refresh_token;
        this.scope = scope;
        this.expires_in = expires_in;
    }
};

export class OAuth2RevokeRequest {
    token: string;
    token_type_hint: OAuth2TokenHintType;

    constructor(token: string, token_type_hint: OAuth2TokenHintType) {
        this.token = token;
        this.token_type_hint = token_type_hint;
    }
};
