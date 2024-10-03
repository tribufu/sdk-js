// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT AND Apache-2.0

import dotenv from "dotenv";
import { TribufuApi } from "../build/index.mjs";

dotenv.config();

async function main() {
    const api = TribufuApi.fromEnv("TRIBUFU");
    console.log(await api.authGetUserInfo());
}

main();
