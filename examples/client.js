// Copyright (c) Tribufu. All Rights Reserved.

import dotenv from 'dotenv';
import { TribufuClient } from '../build/index.mjs';

dotenv.config();

async function main() {
    const client = TribufuClient.fromEnv("TRIBUFU");
    const clientInfo = await client.getClientInfo();
    console.log(clientInfo);
}

main();
