// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import jwt from "jsonwebtoken";

export class JwtDecoder {
    /**
     * Decode JWT token.
     *
     * @param token
     * @returns {any}
     */
    public static decode(token: string): any {
        return jwt.decode(token);
    }

    /**
     * Encode JWT token.
     *
     * @param token
     * @returns {any}
     */
    public static encode(payload: any, secret: string, options?: any): string {
        return jwt.sign(payload, secret, options);
    }

    /**
     * Verify JWT token.
     *
     * @param token
     * @returns {any}
     */
    public static verify(token: string, secret: string): any {
        return jwt.verify(token, secret);
    }
}
