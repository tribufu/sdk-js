// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import dotenv from 'dotenv';
import { TribufuClient } from '../build/index.mjs';

async function main() {
    const client = new TribufuClient();
    const config = await client.openidConfiguration();
    console.log(config);
}

main();
