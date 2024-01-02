// Copyright (c) Tribufu. All Rights Reserved.

import { HeaderMap, TribufuHttp } from "./http";
import { JavaScriptRuntime } from "./node";
import { TribufuApiOptions } from "./options";
import { TribufuBot } from "./bot";
import { TribufuClient } from "./client";
import { TribufuServer } from "./server";
import axios, { AxiosInstance } from "axios";
import jwt from "jsonwebtoken";
import { TokenPayload } from "./token";
import { TRIBUFU_API_URL, TRIBUFU_VERSION } from ".";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

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
    protected readonly http: TribufuHttp;
    protected readonly options: TribufuApiOptions;

    constructor(options?: TribufuApiOptions | null) {
        this.options = options || {};

        this.http = new TribufuHttp({
            baseUrl: TribufuApi.getBaseUrl(),
            headers: TribufuApi.defaultHeaders(),
            logEnabled: TribufuApi.debugEnabled(),
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
    private static defaultHeaders(): HeaderMap {
        const headers = {
            "X-Tribufu-Language": "javascript",
            "X-Tribufu-Version": TRIBUFU_VERSION,
        };

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
            const payload = jwt.decode(token);

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
    protected getHeaders(): HeaderMap {
        let headers: HeaderMap = {};

        if (this.options.apiKey) {
            headers["Authorization"] = `ApiKey ${this.options.apiKey}`;
            return headers;
        }

        if (this.options.accessToken) {
            headers["Authorization"] = `Bearer ${this.options.accessToken}`;
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
        const responseBody = await this.http.get<any[]>(`/v1/packages?page=${page}`, headers);

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
    public async getGameyId(id: string): Promise<any | null> {
        const headers = this.getHeaders();
        const responseBody = await this.http.get<any>(`/v1/packages/${id}`, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }

    /**
     * Get a game from the Tribufu API.
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
        if (isNaN(idOrAddress as any)) {
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
        const headers = this.getHeaders();
        const responseBody = await this.http.get(`/v1/servers/address/${address}`, headers);

        if (!responseBody) {
            return null;
        }

        return responseBody;
    }
}
