// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { build } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import * as fs from "fs/promises";

const baseConfig = {
    entryPoints: ["src/index.ts"],
    platform: "neutral",
    target: "node18",
    bundle: true,
    minify: false,
    sourcemap: false,
    legalComments: "none",
    plugins: [nodeExternalsPlugin()],
};

const moduleConfig = {
    ...baseConfig,
    outfile: "build/index.mjs",
    format: "esm",
};

const moduleMinConfig = {
    ...moduleConfig,
    outfile: "build/index.min.mjs",
    minify: true,
    sourcemap: true,
};

const legacyConfig = {
    ...baseConfig,
    outfile: "build/index.cjs",
    format: "cjs",
};

const legacyMinConfig = {
    ...legacyConfig,
    outfile: "build/index.min.cjs",
    minify: true,
    sourcemap: true,
};

async function addCopyrightHeader(filename) {
    const header = `// Copyright (c) Tribufu. All Rights Reserved.\n// SPDX-License-Identifier: MIT\n\n`;
    const content = await fs.readFile(filename, 'utf-8');
    await fs.writeFile(filename, header + content);
};

async function buildAndAddHeader(config) {
    try {
        await build(config);
        await addCopyrightHeader(config.outfile);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

await buildAndAddHeader(legacyConfig);
await buildAndAddHeader(moduleConfig);

//await buildAndAddHeader(legacyMinConfig);
//await buildAndAddHeader(moduleMinConfig);
