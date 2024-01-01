// Copyright (c) Tribufu. All Rights Reserved.

import dotenv from 'dotenv';
import { TribufuBot } from '../build/index.mjs';

dotenv.config();

const bot = TribufuBot.fromEnv("TRIBUFU");
const botId = bot.getBotId();
