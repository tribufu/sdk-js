// Copyright (c) Tribufu. All Rights Reserved.

export type AccountType = "user" | "bot" | "org";

export interface User {
    id: number,
    uuid: string,
    name: string,
    display_name: string,
    kind: AccountType,
    public_flags: number,
    verified: boolean,
    level: number,
    experience: number,
    public_birthday: boolean,
    birthday?: string | null,
    points: number,
    location?: string | null,
    photo_url?: string | null,
    banner_url?: string | null,
    last_online?: string | null,
    biography?: string | null,
    view_count: number,
    created: string,
    updated?: string | null,
}
