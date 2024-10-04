// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { TribufuApi } from "../api";
import { TribufuApiOptions } from "../options";

let fetchFn: typeof fetch | undefined;

if (window && (window as any).__TAURI__) {
    fetchFn = (await import("@tauri-apps/plugin-http")).fetch;
}

export type TribufuTauriApiOptions = Omit<TribufuApiOptions, "fetch">;

/**
 * **Tribufu Tauri API**
 *
 * Use this class to interact with the Tribufu API in a Tauri application.
 */
export class TribufuTauriApi extends TribufuApi {
    constructor(options?: TribufuTauriApiOptions | null) {
        super({ ...options, fetch: fetchFn });
    }
}
