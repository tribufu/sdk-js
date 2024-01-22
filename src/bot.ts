// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { TribufuApi } from "./api";

/**
 * **Tribufu Bot**
 *
 * To authenticate a bot you need to use the bot token obtained from the Tribufu Developer Portal.
 *
 * - A bot is a special type of user account.
 * - A bot give you read and write access to the Tribufu API.
 */
export class TribufuBot extends TribufuApi {
    private readonly botId: string;

    constructor(token: string) {
        const payload = TribufuApi.parseToken(token);

        if (!payload) {
            throw new Error("Invalid token");
        }

        if (payload.type !== "bot") {
            throw new Error("Invalid token type");
        }

        if (!payload.bot_id) {
            throw new Error("Invalid token payload");
        }

        super({ accessToken: token });

        this.botId = payload.bot_id;
    }

    /**
     * Try to create a TribufuBot from environment variables.
     *
     * - This will only work if the environment variables are set.
     *
     * @param prefix A prefix for the environment variables.
     * @returns TribufuBot | null
     * @example
     * ```ts
     * // process.env.TRIBUFU_BOT_TOKEN
     * const bot = TribufuBot.fromEnv("TRIBUFU");
     * ```
     */
    public static override fromEnv(prefix?: string | null): TribufuBot | null {
        const envPrefix = prefix ? `${prefix}_` : "";
        const token = process.env[`${envPrefix}BOT_TOKEN`];

        if (token) {
            return new TribufuBot(token);
        }

        return null;
    }

    /**
     * Get the bot id.
     * @returns string
     */
    public getBotId(): string {
        return this.botId;
    }
}
