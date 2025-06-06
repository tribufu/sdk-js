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
import type { TokenHintType } from './TokenHintType';
import {
    TokenHintTypeFromJSON,
    TokenHintTypeFromJSONTyped,
    TokenHintTypeToJSON,
    TokenHintTypeToJSONTyped,
} from './TokenHintType';

/**
 * 
 * @export
 * @interface RevokeRequest
 */
export interface RevokeRequest {
    /**
     * 
     * @type {string}
     * @memberof RevokeRequest
     */
    token?: string | null;
    /**
     * 
     * @type {TokenHintType}
     * @memberof RevokeRequest
     */
    tokenTypeHint?: TokenHintType;
}



/**
 * Check if a given object implements the RevokeRequest interface.
 */
export function instanceOfRevokeRequest(value: object): value is RevokeRequest {
    return true;
}

export function RevokeRequestFromJSON(json: any): RevokeRequest {
    return RevokeRequestFromJSONTyped(json, false);
}

export function RevokeRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): RevokeRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'token': json['token'] == null ? undefined : json['token'],
        'tokenTypeHint': json['token_type_hint'] == null ? undefined : TokenHintTypeFromJSON(json['token_type_hint']),
    };
}

export function RevokeRequestToJSON(json: any): RevokeRequest {
    return RevokeRequestToJSONTyped(json, false);
}

export function RevokeRequestToJSONTyped(value?: RevokeRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'token': value['token'],
        'token_type_hint': TokenHintTypeToJSON(value['tokenTypeHint']),
    };
}

