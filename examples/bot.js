// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import dotenv from 'dotenv';
import { TribufuBot } from '../build/index.mjs';

dotenv.config();

const bot = TribufuBot.fromEnv("TRIBUFU");
const botId = bot.getBotId();
