// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { TribufuApi } from "./";

/**
 * **Tribufu API**
 *
 * Helper class to get a singleton instance of the Tribufu API.
 */
export class TribufuApiSingleton {
    private static instance: TribufuApi | null = null;

    private constructor() {}

    /**
     * Get the singleton instance of {@link TribufuApi}.
     *
     * @return Singleton instance
     */
    public static getInstance(): TribufuApi {
        if (!this.instance) {
            this.instance = TribufuApi.fromEnvOrDefault();
        }

        return this.instance;
    }

    /**
     * Reset the singleton instance of {@link TribufuApi}.
     */
    public static resetInstance() {
        this.instance = null;
    }
}
