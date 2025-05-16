// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { TribufuApi } from ".";
import { GrantType, TokenHintType } from "./generated";

/**
 * **Tribufu Client**
 *
 * Use this class to interact with Tribufu OAuth service.
 */
export class TribufuClient extends TribufuApi {
    private clientId: string | null = null;
    private clientSecret: string | null = null;

    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private expiresIn: number = 0;

    constructor(clientId: string, clientSecret: string) {
        if (!clientId || !clientSecret) {
            throw new Error("ClientId and ClientSecret are required");
        }

        super({ credentials: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}` });

        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    /**
     * Try to create a TribufuClient from environment variables.
     *
     * - This will only work if the environment variables are set.
     *
     * @param prefix A prefix for the environment variables. Default is `TRIBUFU`.
     * @returns TribufuClient | null
     * @example
     * ```ts
     * // process.env.TRIBUFU_CLIENT_ID
     * // process.env.TRIBUFU_CLIENT_SECRET
     * const client = TribufuClient.fromEnv();
     * ```
     */
    public static fromEnv(prefix?: string | null): TribufuApi | null {
        if (typeof process === "undefined") {
            return null;
        }

        const clientId = process.env[`${prefix || "TRIBUFU"}_CLIENT_ID`];
        const clientSecret = process.env[`${prefix || "TRIBUFU"}_CLIENT_SECRET`];
        if (clientId && clientSecret) {
            return new TribufuClient(clientId, clientSecret);
        }

        return null;
    }

    private useClientCredentials(): void {
        if (this.clientId && this.clientSecret) {
            this.credentials = `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`;
        }
    }

    private useBearerCredentials(): void {
        if (this.accessToken) {
            this.credentials = `Bearer ${this.accessToken}`;
        }
    }

    public async login(username: string, password: string): Promise<boolean> {
        this.useClientCredentials();

        const response = await this.createToken({
            grant_type: GrantType.Password,
            code: null,
            username,
            password,
            refresh_token: null,
            client_id: this.clientId,
            redirect_uri: null,
            code_verifier: null,
        });

        if (response) {
            this.accessToken = response.access_token;
            this.refreshToken = response.refresh_token;
            this.expiresIn = response.expires_in;
            this.useBearerCredentials();
        }

        return !!response;
    }

    public async refresh(): Promise<boolean> {
        this.useClientCredentials();

        const response = await this.createToken({
            grant_type: GrantType.Refresh_token,
            code: null,
            username: null,
            password: null,
            refresh_token: this.refreshToken,
            client_id: this.clientId,
            redirect_uri: null,
            code_verifier: null,
        });

        if (response) {
            this.accessToken = response.access_token;
            this.refreshToken = response.refresh_token;
            this.expiresIn = response.expires_in;
            this.useBearerCredentials();
        }

        return !!response;
    }

    public logout(): Promise<any> {
        this.useClientCredentials();

        const response = this.revokeToken({
            token: this.refreshToken,
            token_type_hint: TokenHintType.Refresh_token,
        });

        this.accessToken = null;
        this.refreshToken = null;
        this.expiresIn = 0;

        return response;
    }
}
