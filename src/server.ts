// Copyright (c) Tribufu. All Rights Reserved.

import { TribufuApi } from "./api";
import { TribufuClient } from "./client";

/**
 * **Tribufu Server**
 *
 * To authenticate a server you need to use the server id, client id and client secret obtained from your server subscription.
 *
 * - A server is a special type of client application.
 * - A server is how game servers interact with the Tribufu API.
 * - A server give you read and write access to the Tribufu API.
 */
export class TribufuServer extends TribufuClient {
    private readonly serverId: string;

    constructor(serverId: string, clientId: string, clientSecret: string) {
        super(clientId, clientSecret);
        this.serverId = serverId;
    }

    /**
     * Try to create a TribufuServer from environment variables.
     *
     * - This will only work if the environment variables are set.
     *
     * @param prefix A prefix for the environment variables.
     * @returns TribufuServer | null
     * @example
     * ```ts
     * // process.env.TRIBUFU_SERVER_ID
     * // process.env.TRIBUFU_CLIENT_ID
     * // process.env.TRIBUFU_CLIENT_SECRET
     * const server = TribufuServer.fromEnv("TRIBUFU_");
     * ```
     */
    public static override fromEnv(prefix: string = ""): TribufuServer | null {
        const serverId = process.env[`${prefix}SERVER_ID`];
        const clientId = process.env[`${prefix}CLIENT_ID`];
        const clientSecret = process.env[`${prefix}CLIENT_SECRET`];

        if (serverId && clientId && clientSecret) {
            return TribufuApi.withServer(serverId, clientId, clientSecret);
        }

        return null;
    }

    /**
     * Get a list of connected users.
     * @returns
     */
    public async getConnectedUsers(): Promise<any[]> {
        return [];
    }
}