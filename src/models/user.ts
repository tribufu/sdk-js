// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

export type AccountType = "user" | "bot" | "org";

export interface User {
    id: number,
    uuid: string,
    name: string,
    displayName: string,
    kind: AccountType,
    publicFlags: number,
    verified: boolean,
    level: number,
    experience: number,
    publicBirthday: boolean,
    birthday?: string | null,
    points: number,
    location?: string | null,
    photoUrl?: string | null,
    bannerUrl?: string | null,
    lastOnline?: string | null,
    biography?: string | null,
    viewCount: number,
    created: string,
    updated?: string | null,
}
