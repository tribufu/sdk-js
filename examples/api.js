// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT AND Apache-2.0

import dotenv from "dotenv";
import { TribufuApi } from "../build/index.mjs";

dotenv.config();

async function main() {
    const tribufu = TribufuApi.fromEnv();
    console.log(await tribufu.getUserInfo());
}

main();
