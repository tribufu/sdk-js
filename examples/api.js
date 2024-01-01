// Copyright (c) Tribufu. All Rights Reserved.

import dotenv from 'dotenv';
import { TribufuApi } from '../build/index.mjs';

dotenv.config();

async function main() {
    const api = TribufuApi.fromEnv("TRIBUFU");
    const games = await api.getGames();
    console.log(games[0]);
}

main();
