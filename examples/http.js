// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { HttpClient } from '../build/index.mjs';

async function main() {
    const http = new HttpClient();
    const reponse = await http.get('https://www.tribufu.com');
    console.log(reponse);
}

main();
