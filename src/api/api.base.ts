// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: UNLICENSED

import { HttpHeaders } from "../http/headers";
import { JavaScriptRuntime } from "../node";
import { TRIBUFU_VERSION } from "..";

export abstract class TribufuApiBase {
    protected apiKey: string | null = null;

    /**
     * Check if debug mode is enabled.
     *
     * - Debug mode is enabled if the environment variable `NODE_ENV` is set to `development`.
     * - Debug mode is disabled by default.
     * - Debug mode is disabled in the browser.
     *
     * @returns boolean
     */
    public static debugEnabled(): boolean {
        if (typeof process !== "undefined") {
            return process.env.NODE_ENV === "development";
        }

        return false;
    }

    /**
     * Detect the current JavaScript runtime.
     *
     * - This is used to determine if the code is running in a browser or in Node.js.
     *
     * @returns JavaScriptRuntime
     */
    public static detectRuntime(): JavaScriptRuntime {
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
        return TribufuApiBase.detectRuntime() === JavaScriptRuntime.Browser;
    }

    /**
     * Check if the current JavaScript runtime is Node.js.
     * @returns boolean
     */
    public static isNode(): boolean {
        return TribufuApiBase.detectRuntime() === JavaScriptRuntime.Node;
    }

    /**
     * Get the default headers for the Tribufu API.
     * @returns HeaderMap
     */
    protected static defaultHeaders(): HttpHeaders {
        const headers = {};
        headers["X-Tribufu-Library"] = "javascript";
        headers["X-Tribufu-Version"] = TRIBUFU_VERSION;
        return headers;
    }

    /**
     * Get current headers with the api key or access token.
     * @returns HeaderMap
     */
    protected getHeaders(): HttpHeaders {
        let headers = TribufuApiBase.defaultHeaders();

        if (this.apiKey) {
            headers["Authorization"] = `ApiKey ${this.apiKey}`;
            return headers;
        }

        return headers;
    }

    /**
     * Transform the options before sending the request.
     * @param options
     * @returns
     */
    protected transformOptions(options: RequestInit) {
        if (this.apiKey) {
            options.headers = {
                ...options.headers,
                ...this.getHeaders(),
            };
        }

        return Promise.resolve(options);
    }
}
