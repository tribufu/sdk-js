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
/**
 * 
 * @export
 * @interface RefreshRequest
 */
export interface RefreshRequest {
    /**
     * 
     * @type {string}
     * @memberof RefreshRequest
     */
    refreshToken?: string | null;
}

/**
 * Check if a given object implements the RefreshRequest interface.
 */
export function instanceOfRefreshRequest(value: object): value is RefreshRequest {
    return true;
}

export function RefreshRequestFromJSON(json: any): RefreshRequest {
    return RefreshRequestFromJSONTyped(json, false);
}

export function RefreshRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): RefreshRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'refreshToken': json['refresh_token'] == null ? undefined : json['refresh_token'],
    };
}

export function RefreshRequestToJSON(json: any): RefreshRequest {
    return RefreshRequestToJSONTyped(json, false);
}

export function RefreshRequestToJSONTyped(value?: RefreshRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'refresh_token': value['refreshToken'],
    };
}

