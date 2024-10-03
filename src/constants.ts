// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import packageJson from "../package.json";

/**
 * The version of the Tribufu SDK.
 */
export const TRIBUFU_VERSION: string = packageJson.version;

/**
 * The default Tribufu WEB URL.
 */
export const TRIBUFU_WEB_URL: string = "https://www.tribufu.com";

/**
 * The default Tribufu API URL.
 */
export const TRIBUFU_API_URL: string = "https://api.tribufu.com";

/**
 * The default Tribufu CDN URL.
 */
export const TRIBUFU_CDN_URL: string = "https://cdn.tribufu.com";

/**
 * Tribufu copyright notice.
 */
export const TRIBUFU_COPYRIGHT = `© ${new Date().getFullYear()} Tribufu.`;
