// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

export interface TribufuApiOptions {
    baseUrl?: string;
    apiKey?: string;
    fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
}
