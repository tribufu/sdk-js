// Copyright (c) Tribufu. All Rights Reserved.

import axios, { AxiosInstance } from 'axios';

export const VERSION = "0.0.4";

export class TribufuClient {
    private id: BigInt;
    private secret: string;
    private http: AxiosInstance;

    constructor(id: BigInt, secret: string) {
        this.id = id;
        this.secret = secret;

        const targetTriple = "JavaScript";
        const userAgent = `Tribufu/${VERSION} (+https://api.tribufu.com; ${targetTriple}`;
        const headers = {
            "User-Agent": userAgent,
            "X-Tribufu-Language": "javascript",
            "X-Tribufu-Version": VERSION,
        };

        this.http = axios.create({
            baseURL: 'https://api.tribufu.com',
            headers,
        });
    }

    public getId(): BigInt {
        return this.id;
    }
}
