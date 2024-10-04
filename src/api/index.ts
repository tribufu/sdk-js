// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { TRIBUFU_API_URL } from "..";
import { TribufuApiBase } from "./api.base";
import { TribufuApiGenerated } from "./api.generated";
import { TribufuApiOptions } from "../options";

/**
 * **Tribufu API**
 *
 * Use this class to interact with the Tribufu API.
 */
export class TribufuApi extends TribufuApiGenerated {
    constructor(options?: TribufuApiOptions | null) {
        const baseUrl = options?.baseUrl || TribufuApi.getBaseUrl();
        const http = options?.fetch ? { fetch: options.fetch } : { fetch };
        super(baseUrl, http);
        this.apiKey = options?.apiKey || null;
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
     * @param prefix A prefix for the environment variables. Default is `TRIBUFU`.
     * @returns TribufuApi | null
     * @example
     * ```ts
     * // process.env.TRIBUFU_API_KEY
     * const api = TribufuApi.fromEnv();
     * ```
     */
    public static fromEnv(prefix?: string | null): TribufuApi | null {
        if (!process) {
            return null;
        }

        const apiKey = process.env[`${prefix || "TRIBUFU"}_API_KEY`];

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
     * @param prefix A prefix for the environment variables. Default is `TRIBUFU`.
     * @returns TribufuApi | null
     * @example
     * ```ts
     * // process.env.TRIBUFU_API_KEY = null
     * const api = TribufuApi.fromEnvOrDefault();
     * ```
     */
    public static fromEnvOrDefault(prefix: string = ""): TribufuApi {
        return TribufuApi.fromEnv(prefix) || TribufuApi.default();
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
    protected static getBaseUrl(): string {
        if (!process) {
            return TRIBUFU_API_URL;
        }

        const baseUrl = process.env[`TRIBUFU_API_URL`] || null;
        return TribufuApiBase.debugEnabled() && baseUrl
            ? baseUrl
            : TRIBUFU_API_URL;
    }
}
