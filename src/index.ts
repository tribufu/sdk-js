// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import "./api/api.base";
import "./api/api.generated";
import "./api/api.include";
import "./api/index";
import "./api/singletion";
import "./http/headers";
import "./node";

import {
    TRIBUFU_API_URL,
    TRIBUFU_CDN_URL,
    TRIBUFU_VERSION,
    TRIBUFU_WEB_URL,
} from "./constants";

import { TribufuApi } from "./api";
import { TribufuApiOptions } from "./options";
import { TribufuApiSingleton } from "./api/singletion";

export {
    TRIBUFU_API_URL,
    TRIBUFU_CDN_URL,
    TRIBUFU_VERSION,
    TRIBUFU_WEB_URL,
    TribufuApi,
    TribufuApiOptions,
    TribufuApiSingleton,
};
