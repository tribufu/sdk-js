// Copyright (c) Tribufu. All Rights Reserved.
// SPDX-License-Identifier: MIT

import { MiniProfile } from "./profile";

export interface Cluster {
    id: string,
    name: string,
    description: string | null,
    packageId: string,
    websiteUrl: string | null,
    bannerUrl: string | null,
    ownerId: string | null,
    owner: MiniProfile | null,
    discordServerId: string | null,
    youtubeVideoUrl: string | null,
    tags: string | null,
    commentCount: number,
    serverCount: number,
    created: string,
    updated: string | null
}
