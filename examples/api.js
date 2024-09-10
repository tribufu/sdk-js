// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT AND Apache-2.0

import dotenv from 'dotenv';
import { TribufuApi } from '../build/index.mjs';

dotenv.config();

async function main() {
    const api = TribufuApi.fromEnv("TRIBUFU");
    const games = await api.getGames();
    console.log(games[0]);
}

main();
