// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

export enum JsonCasing {
    CamelCase,
    PascalCase,
    SnakeCase,
};

export class JsonSerializer {
    /**
     * Format json to string.
     *
     * @param json
     * @returns {string}
     */
    public static toString(object: any): string {
        return JSON.stringify(object, null, 0);
    }

    /**
     * Format json to pretty string.
     *
     * @param json
     * @returns {string}
     */
    public static toStringPretty(object: any): string {
        return JSON.stringify(object, null, 4);
    }

    /**
     * Parse json string to object.
     * @param json
     * @returns {any}
     */
    public static fromString(jsonString: string): any {
        return JSON.parse(jsonString);
    }

    /**
     * Convert json object keys to camel case.
     *
     * @param json
     * @returns {any}
     */
    public static toCamelCase(json: any): any {
        return camelcaseKeys(json, { deep: true });
    }

    /**
     * Convert json object keys to pascal case.
     *
     * @param json
     * @returns {any}
     */
    public static toPascalCase(json: any): any {
        return camelcaseKeys(json, { deep: true, pascalCase: true });
    }

    /**
     * Convert json object keys to snake case.
     *
     * @param json
     * @returns {any}
     */
    public static toSnakeCase(json: any): any {
        return snakecaseKeys(json, { deep: true });
    }

    /**
     * Convert json object keys to specified case.
     *
     * @param json
     * @param casing
     * @returns {any}
     */
    public static toCase(json: any, casing?: JsonCasing | null): any {
        switch (casing) {
            case JsonCasing.CamelCase:
                return JsonSerializer.toCamelCase(json);
            case JsonCasing.PascalCase:
                return JsonSerializer.toPascalCase(json);
            case JsonCasing.SnakeCase:
                return JsonSerializer.toSnakeCase(json);
            default:
                return json;
        }
    }
}
