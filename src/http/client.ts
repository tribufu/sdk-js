// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import axios, { AxiosInstance } from "axios";
import { JsonCasing, JsonSerializer } from "../json";
import { HttpHeaders } from "./headers";

export interface ErrorResponse {
    error: string;
};

export interface MessageResponse {
    message: string;
};

export interface HttpClientOptions {
    baseUrl?: string | null;
    headers?: HttpHeaders;
    logEnabled?: boolean;
    logTarget?: string;
    jsonRequestCasing?: JsonCasing | null;
    jsonResponseCasing?: JsonCasing | null;
};

/**
 * Http Client
 *
 * Helper class to make HTTP requests.
 */
export class HttpClient {
    private readonly inner: AxiosInstance;
    protected readonly options: HttpClientOptions;

    constructor(options?: HttpClientOptions | null) {
        const defaultOptions = HttpClient.defaultOptions();

        this.options = {
            baseUrl: options?.baseUrl ?? defaultOptions.baseUrl,
            headers: options?.headers ?? defaultOptions.headers,
            logEnabled: options?.logEnabled ?? defaultOptions.logEnabled,
            logTarget: options?.logTarget ?? defaultOptions.logTarget,
            jsonRequestCasing: options?.jsonRequestCasing ?? defaultOptions.jsonRequestCasing,
            jsonResponseCasing: options?.jsonResponseCasing ?? defaultOptions.jsonResponseCasing,
        };

        const inner = axios.create({
            baseURL: this.options?.baseUrl ?? undefined,
            headers: this.options?.headers?.getRaw(),
        });

        inner.interceptors.request.use((req) => {
            if (this.options.logEnabled ?? false) {
                console.log(`(${this.options.logTarget}) ${req.method?.toUpperCase()} ${req.baseURL}${req.url}`);
            }

            if (req.url && req.url.includes("oauth2") && !req.url.includes("userinfo")) {
                return req;
            }

            const contentType = req.headers["Content-Type"];
            if (req.data && (contentType === "application/json" || contentType === "application/x-www-form-urlencoded")) {
                req.data = JsonSerializer.toCase(req.data, this.options.jsonRequestCasing);
            }

            return req;
        });

        inner.interceptors.response.use((res) => {
            if (res.config.url && res.config.url.includes("oauth2") && !res.config.url.includes("userinfo")) {
                return res;
            }

            if (res.data) {
                res.data = JsonSerializer.toCase(res.data, this.options.jsonResponseCasing);
            }

            return res;
        });

        this.inner = inner;
    }

    private static defaultOptions(): HttpClientOptions {
        return {
            baseUrl: null,
            headers: new HttpHeaders(),
            logEnabled: false,
            logTarget: "HttpClient",
            jsonRequestCasing: null,
            jsonResponseCasing: null,
        };
    };

    /**
     * Get a resource from the http server.
     * @returns {T | null}
     */
    public async get<T>(path: string, headers?: HttpHeaders | null): Promise<T | null> {
        try {
            const requestHeaders = headers ?? this.options.headers;
            const response = await this.inner.get(path, { headers: requestHeaders?.getRaw() });

            if (response.status !== 200) {
                return null;
            }

            return response.data as T;
        } catch (error) {
            return null;
        }
    }

    /**
     * Create a resource on the http server.
     * @param path
     * @param body
     * @param headers
     * @returns {T | null}
     */
    public async post<S, T>(path: string, body: S, headers?: HttpHeaders | null): Promise<T | null> {
        try {
            const requestHeaders = headers ?? this.options.headers;
            const response = await this.inner.post(path, body, { headers: requestHeaders?.getRaw() });

            if (response.status !== 200) {
                return null;
            }

            return response.data as T;
        } catch (error) {
            return null;
        }
    }

    /**
     * Update a resource on the http server.
     * @param path
     * @param body
     * @param headers
     * @returns {T | null}
     */
    public async put<S, T>(path: string, body: S, headers?: HttpHeaders | null): Promise<T | null> {
        try {
            const requestHeaders = headers ?? this.options.headers;
            const response = await this.inner.put(path, body, { headers: requestHeaders?.getRaw() });

            if (response.status !== 200) {
                return null;
            }

            return response.data as T;
        } catch (error) {
            return null;
        }
    }

    /**
     * Patch a resource on the http server.
     * @param path
     * @param body
     * @param headers
     * @returns {T | null}
     */
    public async patch<S, T>(path: string, body: S, headers?: HttpHeaders | null): Promise<T | null> {
        try {
            const requestHeaders = headers ?? this.options.headers;
            const response = await this.inner.patch(path, body, { headers: requestHeaders?.getRaw() });

            if (response.status !== 200) {
                return null;
            }

            return response.data as T;
        } catch (error) {
            return null;
        }
    }

    /**
     * Delete a resource from the http server.
     * @param path
     * @param headers
     * @returns {T | null}
     */
    public async delete<T>(path: string, headers?: HttpHeaders | null): Promise<T | null> {
        try {
            const requestHeaders = headers ?? this.options.headers;
            const response = await this.inner.delete(path, { headers: requestHeaders?.getRaw() });

            if (response.status !== 200) {
                return null;
            }

            return response.data as T;
        } catch (error) {
            return null;
        }
    }
}
