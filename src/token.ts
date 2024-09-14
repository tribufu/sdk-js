// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

export type TokenType = "user" | "bot" | "client" | "server";

export interface TokenPayload {
    jti: string;
    type: TokenType;
    iss: string;
    aud: string;
    client_id: string;
    scope: string;
    user_id?: string;
    bot_id?: string;
    private_flags?: string;
    public_flags?: string;
    server_id?: string;
    iat: number;
    exp: number;
}
