// Copyright (c) Tribufu. All Rights Reserved.

import axios, { AxiosInstance } from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

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

export interface TribufuHttpOptions {
    baseUrl?: string | null;
    headers?: HeaderMap;
    logEnabled?: boolean;
    logTarget?: string;
};

/**
 * Tribufu Http
 *
 * Helper class to make HTTP requests to the Tribufu API.
 */
export class TribufuHttp {
    private readonly inner: AxiosInstance;
    protected readonly options: TribufuHttpOptions;

    constructor(options?: TribufuHttpOptions | null) {
        const defaultOptions = TribufuHttp.defaultOptions();

        this.options = {
            baseUrl: options?.baseUrl || defaultOptions.baseUrl,
            headers: options?.headers || defaultOptions.headers,
            logEnabled: options?.logEnabled || defaultOptions.logEnabled,
            logTarget: options?.logTarget || defaultOptions.logTarget,
        };

        const inner = axios.create({
            baseURL: this.options?.baseUrl || undefined,
            headers: this.options?.headers || undefined,
        });

        inner.interceptors.request.use((req) => {
            if (this.options.logEnabled ?? false) {
                console.log(`(${this.options.logTarget}) ${req.method?.toUpperCase()} ${req.baseURL}${req.url}`);
            }

            const contentType = req.headers["Content-Type"];
            if (req.data && (contentType === "application/json" || contentType === "application/x-www-form-urlencoded")) {
                req.data = snakecaseKeys(req.data);
            }

            return req;
        });

        inner.interceptors.response.use((res) => {
            if (res.data) {
                res.data = camelcaseKeys(res.data);
            }

            return res;
        });

        this.inner = inner;
    }

    private static defaultOptions(): TribufuHttpOptions {
        return {
            baseUrl: null,
            headers: {},
            logEnabled: false,
            logTarget: "TribufuHttp",
        };
    };

    /**
     * Get a resource from the Tribufu API.
     * @returns T | null
     */
    public async get<T>(path: string, headers?: HeaderMap | null): Promise<T | null> {
        try {
            const requestHeaders = headers || this.options.headers;
            const response = await this.inner.get(path, { headers: requestHeaders });

            if (response.status !== 200) {
                return null;
            }

            return response.data as T;
        } catch (error) {
            return null;
        }
    }

    /**
     * Create a resource to the Tribufu API.
     * @param path
     * @param body
     * @param headers
     * @returns T | null
     */
    public async post<S, T>(path: string, body: S, headers?: HeaderMap | null): Promise<T | null> {
        try {
            const requestHeaders = headers || this.options.headers;
            const response = await this.inner.post(path, body, { headers: requestHeaders });

            if (response.status !== 200) {
                return null;
            }

            return response.data as T;
        } catch (error) {
            return null;
        }
    }

    /**
     * Update a resource on the Tribufu API.
     * @param path
     * @param body
     * @param headers
     * @returns T | null
     */
    public async put<S, T>(path: string, body: S, headers?: HeaderMap | null): Promise<T | null> {
        try {
            const requestHeaders = headers || this.options.headers;
            const response = await this.inner.put(path, body, { headers: requestHeaders });

            if (response.status !== 200) {
                return null;
            }

            return response.data as T;
        } catch (error) {
            return null;
        }
    }

    /**
     * Patch a resource on the Tribufu API.
     * @param path
     * @param body
     * @param headers
     * @returns T | null
     */
    public async patch<S, T>(path: string, body: S, headers?: HeaderMap | null): Promise<T | null> {
        try {
            const requestHeaders = headers || this.options.headers;
            const response = await this.inner.patch(path, body, { headers: requestHeaders });

            if (response.status !== 200) {
                return null;
            }

            return response.data as T;
        } catch (error) {
            return null;
        }
    }

    /**
     * Delete a resource from the Tribufu API.
     * @param path
     * @param headers
     * @returns T | null
     */
    public async delete<T>(path: string, headers?: HeaderMap | null): Promise<T | null> {
        try {
            const requestHeaders = headers || this.options.headers;
            const response = await this.inner.delete(path, { headers: requestHeaders });

            if (response.status !== 200) {
                return null;
            }

            return response.data as T;
        } catch (error) {
            return null;
        }
    }
}
