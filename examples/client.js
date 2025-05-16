// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT AND Apache-2.0

import dotenv from "dotenv";
import { TribufuClient } from "../build/index.mjs";

dotenv.config();

async function main() {
    const tribufu = TribufuClient.fromEnv();
    console.log(await tribufu.getClientInfo());
}

main();
