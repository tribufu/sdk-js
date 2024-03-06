// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { v1 as uuidv1, v4 as uuidv4 } from "uuid";
import { uuidv7 } from "uuidv7";

export class UuidGenerator {
    /**
     * Generate a version 1 (time-based) UUID.
     * @returns {string}
     */
    public static v1(): string {
        return uuidv1();
    }

    /**
     * Generate a version 4 (random) UUID.
     * @returns {string}
     */
    public static v4(): string {
        return uuidv4();
    }

    /**
     * Generate a version 7 (time-based) UUID.
     * @returns {string}
     */
    public static v7(): string {
        return uuidv7();
    }
}
