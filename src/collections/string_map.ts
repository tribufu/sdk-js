// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

/**
 * Map Inner
 *
 * Helper type to represent raw map.
 */
export type RawStringMap<T> = {
    [key: string]: T
};

/**
 * Generic Map
 *
 * Helper class to manage generic maps.
 */
export class StringMap<T> extends Map<string, T> {
    constructor(inner?: RawStringMap<T> | null) {
        super();

        if (inner) {
            Object.entries(inner).forEach(([key, value]) => {
                this.set(key, value);
            });
        }
    }

    /**
     * Get all values as raw map.
     * @returns {RawStringMap<T>}
     */
    public getRaw(): RawStringMap<T> {
        const result: RawStringMap<T> = {};

        this.forEach((value, key) => {
            result[key] = value;
        });

        return result;
    }
}
