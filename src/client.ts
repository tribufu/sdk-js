// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { HttpCookieMap, HttpHeaders } from "@tribufu/mintaka";
import { OAuth2GrantType, OAuth2IntrospectionRequest, OAuth2IntrospectionResponse, OAuth2TokenRequest, OAuth2TokenResponse } from "@tribufu/mintaka";
import { TribufuApi } from "./api";

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
        super();
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
     * const client = TribufuClient.fromEnv("TRIBUFU");
     * ```
     */
    public static override fromEnv(prefix?: string | null): TribufuClient | null {
        const envPrefix = prefix ? `${prefix}_` : "";
        //const apiKey = process.env[`${envPrefix}API_KEY`];
        const clientId = process.env[`${envPrefix}CLIENT_ID`];
        const clientSecret = process.env[`${envPrefix}CLIENT_SECRET`];

        if (!clientId || !clientSecret) {
            return null;
        }

        const client = new TribufuClient(clientId, clientSecret);

        /*
        if (apiKey) {
            client.setApiKey(apiKey);
        }
        */

        return client;
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
     * const client = TribufuClient.fromCookies(cookies, "TRIBUFU_");
     * ```
     */
    public static fromCookies(cookies: HttpCookieMap, prefix: string = ""): TribufuClient | null {
        const client = TribufuClient.fromEnv(prefix);
        const accessToken = cookies["access_token"] || null;
        const refreshToken = cookies["refresh_token"] || null;

        if (client && accessToken && refreshToken) {
            client.setTokens(accessToken, refreshToken);
        }

        return client;
    }

    /**
     * Set the tokens.
     * @param accessToken
     * @param refreshToken
     * @param expiresIn
     */
    protected setTokens(accessToken: string | null, refreshToken?: string | null, expiresIn?: number | null): void {
        this.options.accessToken = accessToken;
        this.options.refreshToken = refreshToken || null;
        this.options.expiresIn = expiresIn || null;
    }

    /**
     * Clear the tokens.
     */
    protected clearTokens(): void {
        this.setTokens(null, null, null);
    }

    /**
     * Set the tokens from a oauth2 response.
     * @param tokens
     */
    private setTokensFromResponse(tokens: OAuth2TokenResponse): void {
        this.setTokens(tokens.access_token, tokens.refresh_token || null, tokens.expires_in || null);
    }

    /**
     * Get the headers for a oauth2 request.
     * @returns HttpHeaders
     */
    private getOAuthHeaders(): HttpHeaders {
        let headers = this.getHeaders();
        headers["Authorization"] = `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`, "binary").toString("base64")}`;
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        return headers;
    }

    /**
     * Get the client id.
     * @returns string
     */
    public getClientId(): string {
        return this.clientId;
    }

    /**
     * Login using an authorization code.
     * @param authorizationCode
     * @returns boolean
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
     * @returns boolean
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
     * @returns boolean
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
     * @returns boolean
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
     * @returns boolean
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
     * @returns boolean
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
     * @returns boolean
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
        const responseBody = await this.http.post<OAuth2IntrospectionRequest, OAuth2IntrospectionResponse>(url, requestBody, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }

    /**
     * Revoke a refresh token.
     * @returns boolean
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
        const responseBody = await this.http.post<OAuth2IntrospectionRequest, OAuth2IntrospectionResponse>(url, requestBody, headers);

        if (!responseBody) {
            return false;
        }

        this.clearTokens();

        return true;
    }

    /**
     * Check if the current access token is valid.
     * @returns boolean
     */
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
     * @returns OAuth2TokenResponse | null
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
        const responseBody = await this.http.post<OAuth2TokenRequest, OAuth2TokenResponse>(url, requestBody, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }

    /**
     * Get information about the current client.
     * @returns Client | null
     */
    public async getClientInfo(): Promise<any | null> {
        return this.getClientById(this.clientId);
    }

    /**
     * Get information about the current user.
     * @returns User | null
     */
    public async getUserInfo(): Promise<any | null> {
        if (!this.options.accessToken) {
            return null;
        }

        const headers = this.getHeaders();
        const responseBody = await this.http.get<any>(`/v1/oauth2/userinfo`, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }
}
