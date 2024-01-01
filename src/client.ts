// Copyright (c) Tribufu. All Rights Reserved.

import { CookieMap, HeaderMap } from "./http";
import { OAuth2GrantType, OAuth2IntrospectionRequest, OAuth2IntrospectionResponse, OAuth2TokenRequest, OAuth2TokenResponse } from "./oauth2";
import { TribufuApi } from "./api";
import { User } from "./models/user";

/**
 * **Tribufu Client**
 *
 * To authenticate a client you need to use the client id and client secret obtained from the Tribufu Developer Portal
 *
 * - A client is how external applications interact with the Tribufu API.
 * - A client give you read and write access to the Tribufu API.
 * - A client can be used to login users.
 */
export class TribufuClient extends TribufuApi {
    private readonly clientId: string;
    private readonly clientSecret: string;

    constructor(clientId: string, clientSecret: string) {
        super({});

        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    /**
     * Try to create a TribufuClient from environment variables.
     *
     * - This will only work if the environment variables are set.
     *
     * @param prefix A prefix for the environment variables.
     * @returns TribufuClient | null
     * @example
     * ```ts
     * // process.env.TRIBUFU_CLIENT_ID
     * // process.env.TRIBUFU_CLIENT_SECRET
     * const client = TribufuClient.fromEnv("TRIBUFU_");
     * ```
     */
    public static override fromEnv(prefix: string = ""): TribufuClient | null {
        const clientId = process.env[`${prefix}CLIENT_ID`];
        const clientSecret = process.env[`${prefix}CLIENT_SECRET`];

        if (clientId && clientSecret) {
            return TribufuApi.withClient(clientId, clientSecret);
        }

        return null;
    }

    /**
     * Try to create a TribufuClient from environment variables and cookies.
     *
     * - This will only work if the environment variables are set.
     * - The cookies are used to get the access token and refresh token.
     *
     * @param cookies Cookies from the request.
     * @param prefix A prefix for the environment variables.
     * @returns TribufuClient | null
     * @example
     * ```ts
     * // process.env.TRIBUFU_CLIENT_ID
     * // process.env.TRIBUFU_CLIENT_SECRET
     * const cookies = { "access_token": "...", "refresh_token": "..." };
     * const client = TribufuClient.fromEnvAndCookies(cookies, "TRIBUFU_");
     * ```
     */
    public static fromEnvAndCookies(cookies: CookieMap, prefix: string = ""): TribufuClient | null {
        const client = TribufuClient.fromEnv(prefix);
        const accessToken = cookies["access_token"] || null;
        const refreshToken = cookies["refresh_token"] || null;

        if (client) {
            client.setTokens(accessToken, refreshToken);
        }

        return client;
    }

    private setTokens(accessToken: string | null, refreshToken?: string | null, expiresIn?: number | null): void {
        this.options.accessToken = accessToken;
        this.options.refreshToken = refreshToken || null;
        this.options.expiresIn = expiresIn || null;
    }

    private clearTokens(): void {
        this.setTokens(null, null, null);
    }

    private setTokensFromResponse(tokens: OAuth2TokenResponse): void {
        this.setTokens(tokens.access_token, tokens.refresh_token || null, tokens.expires_in || null);
    }

    private getOAuthHeaders(): HeaderMap {
        let headers = this.getHeaders();
        headers["Authorization"] = `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`, "binary").toString("base64")}`;
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        return headers;
    }

    /**
     * Login using an authorization code.
     * @param authorizationCode
     * @returns
     */
    public async authorizationLogin(authorizationCode: string): Promise<boolean> {
        const response = await this.getToken("authorization_code", authorizationCode, null, null);

        if (!response) {
            return false;
        }

        this.setTokensFromResponse(response);

        return true;
    }

    /**
     * Login using a device code.
     * @param deviceCode
     * @returns
     */
    public async deviceLogin(deviceCode: string): Promise<boolean> {
        const response = await this.getToken("device_code", deviceCode, null, null);

        if (!response) {
            return false;
        }

        this.setTokensFromResponse(response);

        return true;
    }

    /**
     * Login using a username and password.
     * @param username
     * @param password
     * @returns
     */
    public async passwordLogin(username: string, password: string): Promise<boolean> {
        const response = await this.getToken("password", password, null, username);

        if (!response) {
            return false;
        }

        this.setTokensFromResponse(response);

        return true;
    }

    /**
     * Login using a passkey.
     * @param username
     * @param passkey
     * @returns
     */
    public async passkeyLogin(username: string, passkey: string): Promise<boolean> {
        const response = await this.getToken("passkey", passkey, null, username);

        if (!response) {
            return false;
        }

        this.setTokensFromResponse(response);

        return true;
    }

    /**
     * Get a token for a client application.
     * @param subjectKey
     * @param subjectValue
     * @returns
     */
    public async clientLogin(subjectKey: string | null, subjectValue: string | null): Promise<boolean> {
        const response = await this.getToken("client_credentials", null, subjectKey, subjectValue);

        if (!response) {
            return false;
        }

        this.setTokensFromResponse(response);

        return true;
    }

    /**
     * Get a new access token using a refresh token.
     * @param refreshToken
     * @returns
     */
    public async refreshToken(): Promise<boolean> {
        if (!this.options.refreshToken) {
            return false;
        }

        const response = await this.getToken("refresh_token", this.options.refreshToken, null, null);

        if (!response) {
            return false;
        }

        this.setTokensFromResponse(response);

        return true;
    }

    /**
     * Get information about a access token.
     * @returns
     */
    public async instrospectToken(): Promise<OAuth2IntrospectionResponse | null> {
        if (!this.options.accessToken) {
            return null;
        }

        const requestBody: OAuth2IntrospectionRequest = {
            token: this.options.accessToken,
            token_type_hint: "access_token",
        }

        const url = `/v1/oauth2/introspect`;
        const headers = this.getOAuthHeaders();
        const responseBody = await this.post<OAuth2IntrospectionRequest, OAuth2IntrospectionResponse>(url, requestBody, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }

    /**
     * Revoke a refresh token.
     * @returns
     */
    public async revokeToken(): Promise<boolean> {
        if (!this.options.refreshToken) {
            return false;
        }

        const requestBody: OAuth2IntrospectionRequest = {
            token: this.options.refreshToken,
            token_type_hint: "refresh_token",
        }

        const url = `/v1/oauth2/revoke`;
        const headers = this.getOAuthHeaders();
        const responseBody = await this.post<OAuth2IntrospectionRequest, OAuth2IntrospectionResponse>(url, requestBody, headers);

        if (!responseBody) {
            return false;
        }

        this.clearTokens();

        return true;
    }

    public async isTokenValid(): Promise<boolean> {
        const response = await this.instrospectToken();

        if (!response) {
            return false;
        }

        return response.active;
    }

    /**
     * Get a oauth2 token with the given grant type.
     * @param grantType
     * @param grantValue
     * @param subjectKey
     * @param subjectValue
     * @returns
     */
    protected async getToken(grantType: OAuth2GrantType, grantValue: string | null, subjectKey: string | null, subjectValue: string | null): Promise<OAuth2TokenResponse | null> {
        const requestBody: OAuth2TokenRequest = {
            grant_type: grantType,
            code: grantType === "authorization_code" ? grantValue : null,
            refresh_token: grantType === "refresh_token" ? grantValue : null,
            username: grantType === "password" || grantType === "passkey" ? subjectValue : null,
            password: grantType === "password" ? grantValue : null,
            passkey: grantType === "passkey" ? grantValue : null,
            client_id: this.clientId,
            client_secret: this.clientSecret,
        }

        const params = subjectKey && subjectValue ? `?${subjectKey}=${subjectValue}` : "";
        const url = `/v1/oauth2/token${params}`;
        const headers = this.getOAuthHeaders();
        const responseBody = await this.post<OAuth2TokenRequest, OAuth2TokenResponse>(url, requestBody, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }

    /**
     * Get information about the current user.
     * @returns
     */
    public async getUserInfo(): Promise<User | null> {
        if (!this.options.refreshToken) {
            return null;
        }

        const headers = this.getHeaders();
        const response = await this.http.get(`/v1/oauth2/userinfo`, { headers });

        if (response.status !== 200) {
            return null;
        }

        const user = response.data as User;

        return user;
    }
}