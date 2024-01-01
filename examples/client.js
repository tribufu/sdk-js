// Copyright (c) Tribufu. All Rights Reserved.

import dotenv from 'dotenv';
import { TribufuClient } from '../build';

dotenv.config();

const client = TribufuClient.fromEnv();
const clientId = client.getClientId();
