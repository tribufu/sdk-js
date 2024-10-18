// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { TribufuApi } from "./index";

/**
 * **Tribufu API**
 *
 * Helper class to get a singleton instance of the Tribufu API.
 */
export class TribufuApiSingleton {
    private static INSTANCE: TribufuApi | null = null;

    private constructor() {}

    public static getInstance(): TribufuApi {
        if (!TribufuApiSingleton.INSTANCE) {
            TribufuApiSingleton.INSTANCE = TribufuApi.fromEnvOrDefault();
        }

        return TribufuApiSingleton.INSTANCE;
    }
}
