// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { build } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

const baseConfig = {
    entryPoints: ["src/index.ts"],
    platform: "neutral",
    target: "node18",
    bundle: true,
    minify: false,
    sourcemap: false,
    legalComments: "linked",
    plugins: [nodeExternalsPlugin()],
};

const moduleConfig = {
    ...baseConfig,
    outfile: "build/index.mjs",
    format: "esm",
};

const legacyConfig = {
    ...baseConfig,
    outfile: "build/index.cjs",
    format: "cjs",
};

build(moduleConfig).catch(() => process.exit(1));
build(legacyConfig).catch(() => process.exit(1));
