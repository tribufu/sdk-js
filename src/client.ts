// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { TribufuApi } from "./api.generated";

export class TribufuClient extends TribufuApi {
    constructor() {
        super("http://localhost:5000", { fetch });
    }
}
