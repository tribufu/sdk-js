// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import toml from "toml";

export class TomlSerializer {
    /**
     * Parse toml string to object.
     * @param toml
     * @returns {any}
     */
    public static fromString(tomlString: string): any {
        return toml.parse(tomlString);
    }
}
