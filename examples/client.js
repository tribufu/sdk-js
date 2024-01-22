// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import dotenv from 'dotenv';
import { TribufuClient } from '../build/index.mjs';

dotenv.config();

async function main() {
    const client = TribufuClient.fromEnv("TRIBUFU");

    if (await client.passwordLogin("", "")) {
        const userInfo = await client.getUserInfo();
        console.log(userInfo);
    }
}

main();
