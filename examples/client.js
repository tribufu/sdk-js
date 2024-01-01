// Copyright (c) Tribufu. All Rights Reserved.

import dotenv from 'dotenv';
import { TribufuClient } from '../build/index.mjs';

dotenv.config();

const client = TribufuClient.fromEnv("TRIBUFU");
const clientId = client.getClientId();
