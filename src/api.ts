// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { HttpHeaders, HttpClient } from "@tribufu/mintaka";
import { JavaScriptRuntime } from "./node";
import { JsonCasing, JwtDecoder } from "@tribufu/mintaka";
import { TokenPayload } from "./token";
import { TRIBUFU_API_URL, TRIBUFU_VERSION } from ".";
import { TribufuApiOptions } from "./options";

/**
 * **Tribufu API**
 *
 * Use this class to interact with the Tribufu API.
 *
 * *There are three ways to use the Tribufu API:*
 * - A api key give you public read only access to the Tribufu API.
 * - A bot give you read and write access to the Tribufu API as a bot account.
 * - A client give you read and write access to the Tribufu API as a client application.
 */
export class TribufuApi {
    protected readonly http: HttpClient;
    protected readonly options: TribufuApiOptions;

    constructor(options?: TribufuApiOptions | null) {
        this.options = options || {};

        this.http = new HttpClient({
            baseUrl: TribufuApi.getBaseUrl(),
            headers: TribufuApi.defaultHeaders(),
            logEnabled: TribufuApi.debugEnabled(),
            jsonRequestCasing: JsonCasing.SnakeCase,
            jsonResponseCasing: JsonCasing.CamelCase,
        });
    }

    /**
     * Create a TribufuApi with the default options.
     * @returns
     */
    public static default(): TribufuApi {
        return new TribufuApi();
    }

    /**
     * Create a TribufuApi with the given api key.
     *
     * - A api key give you public read only access to the Tribufu API.
     *
     * @param apiKey
     * @returns TribufuApi
     */
    public static withApiKey(apiKey: string): TribufuApi {
        return new TribufuApi({ apiKey });
    }

    /**
     * Try to create a TribufuApi from environment variables.
     *
     * - This will only work if the environment variables are set.
     *
     * @param prefix A prefix for the environment variables.
     * @returns TribufuApi | null
     * @example
     * ```ts
     * // process.env.TRIBUFU_API_KEY
     * const api = TribufuApi.fromEnv("TRIBUFU");
     * ```
     */
    public static fromEnv(prefix?: string | null): TribufuApi | null {
        const envPrefix = prefix ? `${prefix}_` : "";
        const apiKey = process.env[`${envPrefix}API_KEY`];

        if (apiKey) {
            return TribufuApi.withApiKey(apiKey);
        }

        return null;
    }

    /**
     * Create a TribufuApi from environment variables or the default api.
     *
     * - This will fallback to the default api if the environment variables are not set.
     *
     * @param prefix A prefix for the environment variables.
     * @returns TribufuApi | null
     * @example
     * ```ts
     * // process.env.TRIBUFU_API_KEY = null
     * const api = TribufuApi.fromEnvOrDefault("TRIBUFU_");
     * ```
     */
    public static fromEnvOrDefault(prefix: string = ""): TribufuApi {
        return TribufuApi.fromEnv(prefix) || TribufuApi.default();
    }

    /**
     * Set the tokens.
     * @param accessToken
     * @param refreshToken
     * @param expiresIn
     */
    protected setApiKey(apiKey: string | null): void {
        this.options.apiKey = apiKey;
    }

    /**
     * Check if debug mode is enabled.
     *
     * - Debug mode is enabled if the environment variable `NODE_ENV` is set to `development`.
     * - Debug mode is disabled by default.
     * - Debug mode is disabled in the browser.
     *
     * @returns boolean
     */
    private static debugEnabled(): boolean {
        return process.env.NODE_ENV ? process.env.NODE_ENV === "development" : false;
    }

    /**
     * Get the base url for the Tribufu API.
     *
     * - The base url can be set using the environment variable `TRIBUFU_API_URL`.
     * - The custom base url is only used if debug mode is enabled.
     * - The default base url is `https://api.tribufu.com`.
     *
     * @returns string
     */
    private static getBaseUrl(): string {
        const baseUrl = process.env[`TRIBUFU_API_URL`] || null;
        return TribufuApi.debugEnabled() && baseUrl ? baseUrl : TRIBUFU_API_URL;
    }

    /**
     * Get the default headers for the Tribufu API.
     * @returns HeaderMap
     */
    private static defaultHeaders(): HttpHeaders {
        const headers = new HttpHeaders();
        headers.set("X-Tribufu-Language", "javascript");
        headers.set("X-Tribufu-Version", TRIBUFU_VERSION);
        return headers;
    }

    /**
     * Detect the current JavaScript runtime.
     *
     * - This is used to determine if the code is running in a browser or in Node.js.
     *
     * @returns JavaScriptRuntime
     */
    private static detectRuntime(): JavaScriptRuntime {
        if (typeof window !== "undefined") {
            return JavaScriptRuntime.Browser;
        }

        if (typeof process !== "undefined" && process?.versions?.node) {
            return JavaScriptRuntime.Node;
        }

        return JavaScriptRuntime.Other;
    }

    /**
     * Check if the current JavaScript runtime is a browser.
     * @returns boolean
     */
    public static isBrowser(): boolean {
        return TribufuApi.detectRuntime() === JavaScriptRuntime.Browser;
    }

    /**
     * Check if the current JavaScript runtime is Node.js.
     * @returns boolean
     */
    public static isNode(): boolean {
        return TribufuApi.detectRuntime() === JavaScriptRuntime.Node;
    }

    /**
     * Extract the payload from a Tribufu token.
     * @param token
     * @returns TokenPayload | null
     */
    protected static parseToken(token: string): TokenPayload | null {
        try {
            const payload = JwtDecoder.decode(token);

            if (!payload) {
                return null;
            }

            return payload as TokenPayload;
        }
        catch (error) {
            return null;
        }
    }

    /**
     * Get current headers with the api key or access token.
     * @returns HeaderMap
     */
    protected getHeaders(): HttpHeaders {
        let headers = TribufuApi.defaultHeaders();

        if (this.options.apiKey) {
            headers.set("Authorization", `ApiKey ${this.options.apiKey}`);
            return headers;
        }

        if (this.options.accessToken) {
            headers.set("Authorization", `Bearer ${this.options.accessToken}`);
            return headers;
        }

        return headers;
    }

    /**
     * Get games from the Tribufu API.
     * @param page
     * @returns Game[]
     */
    public async getGames(page: number = 1): Promise<any[]> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get<any[]>(`/v1/games?page=${page}`, headers);

        if (!responseBody) {
            return [];
        }

        return responseBody;
    }

    /**
     * Get a game from the Tribufu API.
     * @param id
     * @returns Game | null
     */
    public async getGameById(id: string): Promise<any | null> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get<any>(`/v1/games/${id}`, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }

    /**
     * Get servers from the Tribufu API.
     * @param page
     * @returns Server[]
     */
    public async getServers(page: number = 1): Promise<any[]> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get<any[]>(`/v1/servers?page=${page}`, headers);

        if (!responseBody) {
            return [];
        }

        return responseBody;
    }

    /**
     * Get a server by id or address from the Tribufu API.
     * @param idOrAddress
     * @returns Server | null
     */
    public async getServer(idOrAddress: string): Promise<any> {
        if (/[.:]/.test(idOrAddress)) {
            return await this.getServerByAddress(idOrAddress);
        }

        return await this.getServerById(idOrAddress);
    }

    /**
     * Get a server by id from the Tribufu API.
     * @param id
     * @returns Server | null
     */
    public async getServerById(id: string): Promise<any> {
        const headers = this.getHeaders()
        const responseBody = await this.http.get<any>(`/v1/servers/${id}`, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }

    /**
     * Get a server by address from the Tribufu API.
     * @param address
     * @returns Server | null
     */
    public async getServerByAddress(address: string): Promise<any> {
        const parts = address.split(":");
        const hostOrAddress = parts[0];
        const queryPort = parts[1];

        const headers = this.getHeaders();
        const responseBody = await this.http.get(`/v1/servers/?address=${hostOrAddress}&query_port=${queryPort}`, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }

    /**
     * Get a user by id from the Tribufu API.
     * @param id
     * @returns User | null
     */
    public async getUserById(id: string): Promise<any> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get(`/v1/users/${id}`, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }

    /**
     * Get a user by uuid from the Tribufu API.
     * @param uuid
     * @returns User[]
     */
    public async getUserByUuid(uuid: string): Promise<any[]> {
        return await this.getUserByKey("uuid", uuid);
    }

    /**
     * Get a user by name from the Tribufu API.
     * @param uuid
     * @returns User[]
     */
    public async getUserByName(name: string): Promise<any[]> {
        return await this.getUserByKey("name", name);
    }

    /**
     * Get a user by custom key from the Tribufu API.
     * @param key
     * @param value
     * @returns User[]
     */
    private async getUserByKey(key: string, value: string): Promise<any[]> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get<any[]>(`/v1/users?${key}=${value}`, headers);

        if (!responseBody) {
            return [];
        }

        return responseBody;
    }

    /**
     * Get all groups for a user from the Tribufu API.
     * @param userId
     * @returns Group[]
     */
    public async getUserGroups(userId: string): Promise<any[]> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get<any[]>(`/v1/users/${userId}/groups`, headers);

        if (!responseBody) {
            return [];
        }

        return responseBody;
    }

    /**
     * Get all games for a user from the Tribufu API.
     * @param userId
     * @returns Game[]
     */
    public async getUserGames(userId: string): Promise<any[]> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get<any[]>(`/v1/users/${userId}/games`, headers);

        if (!responseBody) {
            return [];
        }

        return responseBody;
    }

    /**
     * Get all punishments for a user from the Tribufu API.
     * @param userId
     * @returns Punishment[]
     */
    public async getUserPunishments(userId: string): Promise<any[]> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get<any[]>(`/v1/users/${userId}/punishments`, headers);

        if (!responseBody) {
            return [];
        }

        return responseBody;
    }

    /**
     * Get all servers for a user from the Tribufu API.
     * @param userId
     * @returns Server[]
     */
    public async getUserServers(userId: string): Promise<any[]> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get<any[]>(`/v1/users/${userId}/servers`, headers);

        if (!responseBody) {
            return [];
        }

        return responseBody;
    }

    /**
     * Get a oauth2 client by id from the Tribufu API.
     * @param id
     * @returns Client | null
     */
    protected async getClientById(id: string): Promise<any> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get(`/v1/oauth2/clients/${id}`, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }

    /**
     * Get packages from the Tribufu API.
     * @param page
     * @returns Package[]
     */
    public async getPackages(page: number = 1): Promise<any[]> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get<any[]>(`/v1/packages?page=${page}`, headers);

        if (!responseBody) {
            return [];
        }

        return responseBody;
    }

    /**
     * Get a package by id from the Tribufu API.
     * @param id
     * @returns Package | null
     */
    public async getPackageById(id: string): Promise<any> {
        const headers = this.getHeaders()
        const responseBody = await this.http.get<any>(`/v1/packages/${id}`, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }

    /**
     * Get clusters from the Tribufu API.
     * @param page
     * @returns Cluster[]
     */
    public async getClusters(page: number = 1): Promise<any[]> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get<any[]>(`/v1/clusters?page=${page}`, headers);

        if (!responseBody) {
            return [];
        }

        return responseBody;
    }

    /**
     * Get a cluster by id from the Tribufu API.
     * @param id
     * @returns Cluster | null
     */
    public async getClusterById(id: string): Promise<any> {
        const headers = this.getHeaders()
        const responseBody = await this.http.get<any>(`/v1/clusters/${id}`, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }

    /**
     * Get subscriptions from the Tribufu API.
     * @param page
     * @returns Subscription[]
     */
    public async getSubscriptions(page: number = 1): Promise<any[]> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get<any[]>(`/v1/subscriptions?page=${page}`, headers);

        if (!responseBody) {
            return [];
        }

        return responseBody;
    }

    /**
     * Get a subscription by id from the Tribufu API.
     * @param id
     * @returns Subscription | null
     */
    public async getSubscriptionById(id: string): Promise<any> {
        const headers = this.getHeaders()
        const responseBody = await this.http.get<any>(`/v1/subscriptions/${id}`, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }
}
