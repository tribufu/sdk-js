// Copyright (c) Tribufu. All Rights Reserved.

import dotenv from 'dotenv';
import { TribufuBot } from '../build';

dotenv.config();

const bot = TribufuBot.fromEnv();
const botId = bot.getBotId();
