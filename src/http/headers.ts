// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { RawStringMap, StringMap } from "../collections/string_map";

/**
 * Http Header Map
 *
 * Helper type to represent HTTP headers.
 */
export type HttpHeaderMap = RawStringMap<string>;

/**
 * Http Headers
 *
 * Helper class to manage HTTP headers.
 */
export class HttpHeaders extends StringMap<string> {
    public static parseAuthorizationHeader(value: string): { scheme: string, token: string } {
        const parts = value.split(" ");

        if (parts.length !== 2) {
            throw new Error("Invalid authorization header");
        }

        return { scheme: parts[0], token: parts[1] };
    }
}
