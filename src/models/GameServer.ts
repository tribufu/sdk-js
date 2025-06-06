/* tslint:disable */
/* eslint-disable */
/**
 * Tribufu API
 * REST API to access Tribufu services.
 *
 * The version of the OpenAPI document: 1.1.0
 * Contact: contact@tribufu.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { ServerStatus } from './ServerStatus';
import {
    ServerStatusFromJSON,
    ServerStatusFromJSONTyped,
    ServerStatusToJSON,
    ServerStatusToJSONTyped,
} from './ServerStatus';

/**
 * 
 * @export
 * @interface GameServer
 */
export interface GameServer {
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    name?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    description?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    address?: string | null;
    /**
     * 
     * @type {number}
     * @memberof GameServer
     */
    gamePort?: number | null;
    /**
     * 
     * @type {number}
     * @memberof GameServer
     */
    queryPort?: number;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    gameId?: string;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    gameIconUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    version?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof GameServer
     */
    featured?: boolean;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    clusterId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    websiteUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    bannerUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    ownerId?: string | null;
    /**
     * 
     * @type {number}
     * @memberof GameServer
     */
    uptime?: number;
    /**
     * 
     * @type {ServerStatus}
     * @memberof GameServer
     */
    status?: ServerStatus;
    /**
     * 
     * @type {number}
     * @memberof GameServer
     */
    ping?: number | null;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    map?: string | null;
    /**
     * 
     * @type {number}
     * @memberof GameServer
     */
    usedSlots?: number | null;
    /**
     * 
     * @type {number}
     * @memberof GameServer
     */
    maxSlots?: number | null;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    motd?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    players?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof GameServer
     */
    lastOnline?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    country?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof GameServer
     */
    steam?: boolean;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    discordServerId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    youtubeVideoUrl?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GameServer
     */
    tags?: string | null;
    /**
     * 
     * @type {number}
     * @memberof GameServer
     */
    commentCount?: number;
    /**
     * 
     * @type {Date}
     * @memberof GameServer
     */
    created?: Date;
    /**
     * 
     * @type {Date}
     * @memberof GameServer
     */
    updated?: Date | null;
}



/**
 * Check if a given object implements the GameServer interface.
 */
export function instanceOfGameServer(value: object): value is GameServer {
    return true;
}

export function GameServerFromJSON(json: any): GameServer {
    return GameServerFromJSONTyped(json, false);
}

export function GameServerFromJSONTyped(json: any, ignoreDiscriminator: boolean): GameServer {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'name': json['name'] == null ? undefined : json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'address': json['address'] == null ? undefined : json['address'],
        'gamePort': json['game_port'] == null ? undefined : json['game_port'],
        'queryPort': json['query_port'] == null ? undefined : json['query_port'],
        'gameId': json['game_id'] == null ? undefined : json['game_id'],
        'gameIconUrl': json['game_icon_url'] == null ? undefined : json['game_icon_url'],
        'version': json['version'] == null ? undefined : json['version'],
        'featured': json['featured'] == null ? undefined : json['featured'],
        'clusterId': json['cluster_id'] == null ? undefined : json['cluster_id'],
        'websiteUrl': json['website_url'] == null ? undefined : json['website_url'],
        'bannerUrl': json['banner_url'] == null ? undefined : json['banner_url'],
        'ownerId': json['owner_id'] == null ? undefined : json['owner_id'],
        'uptime': json['uptime'] == null ? undefined : json['uptime'],
        'status': json['status'] == null ? undefined : ServerStatusFromJSON(json['status']),
        'ping': json['ping'] == null ? undefined : json['ping'],
        'map': json['map'] == null ? undefined : json['map'],
        'usedSlots': json['used_slots'] == null ? undefined : json['used_slots'],
        'maxSlots': json['max_slots'] == null ? undefined : json['max_slots'],
        'motd': json['motd'] == null ? undefined : json['motd'],
        'players': json['players'] == null ? undefined : json['players'],
        'lastOnline': json['last_online'] == null ? undefined : (new Date(json['last_online'])),
        'country': json['country'] == null ? undefined : json['country'],
        'steam': json['steam'] == null ? undefined : json['steam'],
        'discordServerId': json['discord_server_id'] == null ? undefined : json['discord_server_id'],
        'youtubeVideoUrl': json['youtube_video_url'] == null ? undefined : json['youtube_video_url'],
        'tags': json['tags'] == null ? undefined : json['tags'],
        'commentCount': json['comment_count'] == null ? undefined : json['comment_count'],
        'created': json['created'] == null ? undefined : (new Date(json['created'])),
        'updated': json['updated'] == null ? undefined : (new Date(json['updated'])),
    };
}

export function GameServerToJSON(json: any): GameServer {
    return GameServerToJSONTyped(json, false);
}

export function GameServerToJSONTyped(value?: GameServer | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'name': value['name'],
        'description': value['description'],
        'address': value['address'],
        'game_port': value['gamePort'],
        'query_port': value['queryPort'],
        'game_id': value['gameId'],
        'game_icon_url': value['gameIconUrl'],
        'version': value['version'],
        'featured': value['featured'],
        'cluster_id': value['clusterId'],
        'website_url': value['websiteUrl'],
        'banner_url': value['bannerUrl'],
        'owner_id': value['ownerId'],
        'uptime': value['uptime'],
        'status': ServerStatusToJSON(value['status']),
        'ping': value['ping'],
        'map': value['map'],
        'used_slots': value['usedSlots'],
        'max_slots': value['maxSlots'],
        'motd': value['motd'],
        'players': value['players'],
        'last_online': value['lastOnline'] == null ? undefined : ((value['lastOnline'] as any).toISOString()),
        'country': value['country'],
        'steam': value['steam'],
        'discord_server_id': value['discordServerId'],
        'youtube_video_url': value['youtubeVideoUrl'],
        'tags': value['tags'],
        'comment_count': value['commentCount'],
        'created': value['created'] == null ? undefined : ((value['created']).toISOString()),
        'updated': value['updated'] == null ? undefined : ((value['updated'] as any).toISOString()),
    };
}

