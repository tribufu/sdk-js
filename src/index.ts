// Copyright (c) Tribufu. All Rights Reserved.

import axios, { AxiosInstance } from "axios";
import { OAuth2TokenRequest, OAuth2TokenResponse, OAuth2GrantType } from "./oauth2.ts";

export const TRIBUFU_VERSION = "0.0.0";

export interface User {
    id: string;
    uuid: string;
    name: string;
    displayName: string;
    email?: string;
    emailConfirmed: boolean;
    type: string;
    organizationId?: string;
    privateFlags: string;
    publicFlags: string;
    official: boolean;
    level: number;
    experience: number;
    publicBirthday: boolean;
    birthday?: Date;
    points: number;
    parentalControl: boolean;
    firstName?: string;
    lastName?: string;
    phone?: string;
    phoneConfirmed: boolean;
    location?: string;
    timezone?: string;
    language?: string;
    currency?: string;
    deleted: boolean;
    lastIpAddress?: string;
    registrationIpAddress?: string;
    failedLogins: number;
    twoFactorEnabled: boolean;
    twoFactorKey?: string;
    photoUrl: string;
    bannerUrl: string;
    status: string;
    lastOnline?: Date;
    biography?: string;
    views: number;
    created: Date;
    updated?: Date;
}

export interface SessionInfo {
    user: User;
    token: OAuth2TokenResponse;
};

export interface LoginRequest {
    login: string;
    password: string;
    persistent: boolean | undefined;
    state: string | null | undefined;
};

export type HeaderMap = {
    [key: string]: string
};

export type CookieMap = {
    [key: string]: string;
};

export enum RuntimeEnvironment {
    Browser,
    Node,
    Other,
}

/*
export type NextApiCookieContext = { req: NextApiRequest };
export type NextPageCookieContext = Pick<NextPageContext, "req">;
export type ExpressCookieContext = { req: Request; };
export type CookieContext = NextApiCookieContext | NextPageCookieContext | ExpressCookieContext | null | undefined;
*/

export type ServerContext = any | null | undefined;

export const TRIBUFU_API_URL = "https://api.tribufu.com";

export enum CredentialsType {
    Anonymous,
    ApiKey,
    Client,
}

export enum TokenType {
    ApiKey,
    Basic,
    Bearer,
}

export interface ApiKey {
    kind: CredentialsType.ApiKey;
    apiKey: string;
}

export interface ClientCredentials {
    kind: CredentialsType.Client;
    clientId: string;
    clientSecret: string;
}

export type Credentials = ApiKey | ClientCredentials;

export class TribufuApi {
    private credentials: Credentials | null = null;
    protected accessToken: string | null = null;
    protected refreshToken: string | null = null;
    private tokenType: TokenType | null = null;
    protected readonly http: AxiosInstance;

    constructor(credentials: Credentials | null) {
        if (credentials) {
            switch (credentials.kind) {
                case CredentialsType.ApiKey:
                    this.setApiKey(credentials.apiKey);
                    break;
                case CredentialsType.Client:
                    this.setClient(credentials.clientId, credentials.clientSecret);
                    break;
            }
        }

        let http = axios.create({
            baseURL: TribufuApi.getBaseUrl(),
            headers: TribufuApi.defaultHeaders(),
        });

        if (TribufuApi.debugEnabled()) {
            http.interceptors.request.use((config) => {
                console.log(`(TribufuApi) ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
                return config;
            });
        }

        this.http = http;
    }

    public static default(): TribufuApi {
        return new TribufuApi(null);
    }

    private static debugEnabled(): boolean {
        return process.env.NODE_ENV ? process.env.NODE_ENV === "development" : false;
    }

    private static getBaseUrl(): string {
        const baseUrl = process.env.TRIBUFU_API_URL || null;
        return TribufuApi.debugEnabled() && baseUrl ? baseUrl : TRIBUFU_API_URL;
    }

    private static userAgent(): string {
        const targetTriple = "JavaScript";
        const userAgent = `Tribufu/${TRIBUFU_VERSION} (+https://api.tribufu.com; ${targetTriple}`;
        return userAgent;
    }

    private static defaultHeaders(): HeaderMap {
        const headers = {
            "User-Agent": TribufuApi.userAgent(),
            "X-Tribufu-Language": "javascript",
            "X-Tribufu-Version": TRIBUFU_VERSION,
        };

        return headers;
    }

    private static detectRuntime(): RuntimeEnvironment {
        if (typeof window !== "undefined") {
            return RuntimeEnvironment.Browser;
        }

        if (typeof process !== "undefined" && process?.versions?.node) {
            return RuntimeEnvironment.Node;
        }

        return RuntimeEnvironment.Other;
    }

    public static isBrowser(): boolean {
        return TribufuApi.detectRuntime() === RuntimeEnvironment.Browser;
    }

    public static isNode(): boolean {
        return TribufuApi.detectRuntime() === RuntimeEnvironment.Node;
    }

    public static withApiKey(apiKey: string): TribufuApi {
        return new TribufuApi({
            kind: CredentialsType.ApiKey,
            apiKey,
        });
    }

    public static withClient(clientId: string, clientSecret: string): TribufuApi {
        return new TribufuApi({
            kind: CredentialsType.Client,
            clientId,
            clientSecret,
        });
    }

    public static withApiKeyFromEnv(): TribufuApi {
        const apiKey = process.env.TRIBUFU_API_URL_KEY;

        if (apiKey) {
            return TribufuApi.withApiKey(apiKey);
        }

        return TribufuApi.default();
    }

    public static withClientFromEnv(): TribufuApi {
        const clientId = process.env.TRIBUFU_CLIENT_ID;
        const clientSecret = process.env.TRIBUFU_CLIENT_SECRET;

        if (clientId && clientSecret) {
            return TribufuApi.withClient(clientId, clientSecret);
        }

        return TribufuApi.default();
    }

    /*
    public static fromContext(context: ServerContext): TribufuApi {
        return TribufuApi.fromCookies(nookies.get(context));
    }
    */

    public static fromCookies(cookies: CookieMap): TribufuApi {
        let api = TribufuApi.withClientFromEnv();

        const accessToken = cookies["access_token"];

        if (accessToken) {
            api?.setBearerToken(accessToken);
        }

        return api;
    }

    public setAnonymous() {
        this.credentials = null;
    }

    public setApiKey(apiKey: string) {
        this.credentials = { kind: CredentialsType.ApiKey, apiKey };
    }

    public setClient(clientId: string, clientSecret: string) {
        this.credentials = { kind: CredentialsType.Client, clientId, clientSecret };
        this.setBasicToken(Buffer.from(`${this.credentials.clientId}:${this.credentials.clientSecret}`, "binary").toString("base64"));
    }

    public setBasicToken(basicToken: string) {
        this.tokenType = TokenType.Basic;
        this.accessToken = basicToken;
    }

    public setBearerToken(accessToken: string, refreshToken?: string | null) {
        this.tokenType = TokenType.Bearer;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken || null;
    }

    private getHeaders(): HeaderMap {
        let headers: HeaderMap = {};

        if (this.credentials?.kind === CredentialsType.ApiKey) {
            headers["Authorization"] = `ApiKey ${this.credentials.apiKey}`;
            return headers;
        }

        switch (this.tokenType) {
            case TokenType.Basic:
                headers["Authorization"] = `Basic ${this.accessToken}`;
                break;
            case TokenType.Bearer:
                headers["Authorization"] = `Bearer ${this.accessToken}`;
                break;
        }

        return headers;
    }

    public async getTokenUsingAuthorizationCode(authorizationCode: string): Promise<OAuth2TokenResponse | null> {
        return await this.getToken("authorization_code", authorizationCode, null, null);
    }

    public async getTokenUsingDeviceCode(deviceCode: string): Promise<OAuth2TokenResponse | null> {
        return await this.getToken("device_code", deviceCode, null, null);
    }

    public async getTokenUsingRefreshToken(refreshToken: string): Promise<OAuth2TokenResponse | null> {
        return await this.getToken("refresh_token", refreshToken, null, null);
    }

    public async getTokenUsingPassword(username: string, password: string): Promise<OAuth2TokenResponse | null> {
        return await this.getToken("password", password, null, username);
    }

    public async getTokenUsingPasskey(username: string, passkey: string): Promise<OAuth2TokenResponse | null> {
        return await this.getToken("passkey", passkey, null, username);
    }

    public async getTokenUsingClientCredentials(serverId?: string | null): Promise<OAuth2TokenResponse | null> {
        return await this.getToken("client_credentials", null, serverId ? "server_id" : null, serverId || null);
    }

    private async getToken(grantType: OAuth2GrantType, grantValue: string | null, subjectKey: string | null, subjectValue: string | null): Promise<OAuth2TokenResponse | null> {
        try {
            if (this.credentials?.kind !== CredentialsType.Client) {
                return null;
            }

            const credentials = this.credentials as ClientCredentials;

            const requestBody: OAuth2TokenRequest = {
                grant_type: grantType,
                code: grantType === "authorization_code" ? grantValue : null,
                refresh_token: grantType === "refresh_token" ? grantValue : null,
                username: grantType === "password" || grantType === "passkey" ? subjectValue : null,
                password: grantType === "password" ? grantValue : null,
                passkey: grantType === "passkey" ? grantValue : null,
                client_id: credentials.clientId,
                client_secret: credentials.clientSecret,
            }

            const params = subjectKey && subjectValue ? `?${subjectKey}=${subjectValue}` : "";
            const url = `/v1/oauth2/token${params}`;
            const headers = this.getHeaders();
            headers["Content-Type"] = "application/x-www-form-urlencoded";
            const response = await this.http.post(url, requestBody, { headers });

            if (response.status !== 200) {
                return null;
            }

            const responseBody = response.data as OAuth2TokenResponse;

            return responseBody;
        } catch (error) {
            console.error(error)
            return null;
        }
    }

    public async getUserInfo(): Promise<User | null> {
        try {
            const headers = this.getHeaders();
            const response = await this.http.get(`/v1/oauth2/userinfo`, { headers });

            if (response.status !== 200) {
                return null;
            }

            const user = response.data as User;

            return user;
        } catch (error) {
            console.error(error)
            return null;
        }
    }

    public async getGames(page: number = 1): Promise<any[]> {
        try {
            const headers = this.getHeaders();
            const response = await this.http.get(`/v1/packages?page=${page}`, { headers });

            if (response.status !== 200) {
                return [];
            }

            const servers = response.data as any[];

            return servers;
        } catch (error) {
            console.error(error)
            return [];
        }
    }

    public async getGameyId(id: string): Promise<any> {
        try {
            const headers = this.getHeaders();
            const response = await this.http.get(`/v1/packages/${id}`, { headers });

            if (response.status !== 200) {
                return [];
            }

            const server = response.data as any;

            return server;
        } catch (error) {
            console.error(error)
            return null;
        }
    }

    public async getServers(page: number = 1): Promise<any[]> {
        try {
            const headers = this.getHeaders();
            const response = await this.http.get(`/v1/servers?page=${page}`, { headers });

            if (response.status !== 200) {
                return [];
            }

            const servers = response.data as any[];

            return servers;
        } catch (error) {
            console.error(error)
            return [];
        }
    }

    public async getServer(idOrAddress: string): Promise<any> {
        if (isNaN(idOrAddress as any)) {
            return await this.getServerByAddress(idOrAddress);
        }

        return await this.getServerById(idOrAddress);
    }

    public async getServerById(id: string): Promise<any> {
        try {
            const headers = this.getHeaders();
            const response = await this.http.get(`/v1/servers/${id}`, { headers });

            if (response.status !== 200) {
                return [];
            }

            const server = response.data as any;

            return server;
        } catch (error) {
            console.error(error)
            return null;
        }
    }

    public async getServerByAddress(address: string): Promise<any> {
        try {
            const headers = this.getHeaders();
            const response = await this.http.get(`/v1/servers/address/${address}`, { headers });

            if (response.status !== 200) {
                return [];
            }

            const server = response.data as any;

            return server;
        } catch (error) {
            console.error(error)
            return null;
        }
    }

    public async getUserById(id: string): Promise<any> {
        try {
            const headers = this.getHeaders();
            const response = await this.http.get(`/v1/users/${id}`, { headers });

            if (response.status !== 200) {
                return null;
            }

            const user = response.data as any;

            return user;
        } catch (error) {
            console.error(error)
            return null;
        }
    }

    public async getUserByUuid(uuid: string): Promise<any[]> {
        return await this.getUserByKey("uuid", uuid);
    }

    public async getUserByName(name: string): Promise<any[]> {
        return await this.getUserByKey("name", name);
    }

    public async getUserByEmail(email: string): Promise<any[]> {
        return await this.getUserByKey("email", email);
    }

    private async getUserByKey(key: string, value: string): Promise<any[]> {
        try {
            const headers = this.getHeaders();
            const response = await this.http.get(`/v1/users/?${key}=${value}`, { headers });

            if (response.status !== 200) {
                return [];
            }

            const users = response.data as any[];

            return users;
        } catch (error) {
            console.error(error)
            return [];
        }
    }

    public async getUserServers(userId: string): Promise<any[]> {
        try {
            const headers = this.getHeaders();
            const response = await this.http.get(`/v1/users/${userId}/servers`, { headers });

            if (response.status !== 200) {
                return [];
            }

            const servers = response.data as any[];

            return servers;
        } catch (error) {
            console.error(error)
            return [];
        }
    }
}
