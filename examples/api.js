// Copyright (c) Tribufu. All Rights Reserved.

import dotenv from 'dotenv';
import { TribufuApi } from '../src';

dotenv.config();

const api = TribufuApi.fromEnv();
