// Copyright (c) Tribufu. All Rights Reserved.

import dotenv from 'dotenv';
import { TribufuServer } from '../build';

dotenv.config();

const server = TribufuServer.fromEnv();
const serverId = server.getServerId();
const clientId = server.getClientId();
