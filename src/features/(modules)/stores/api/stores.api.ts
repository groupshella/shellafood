// src/features/(modules)/stores/api/stores.api.ts

import { DEFAULT_LANG } from "@/features/(actors)/auth/constants/auth.constants";
import { Store, Stores } from "../types/stores.type";
export async function getAllStores(
    limit: number = 12,
    offset: number = 1,
    lang: string = DEFAULT_LANG,
    moduleId: number,
    zoneId: number,
    longitude: string,
    latitude: string,
): Promise<Stores> {
    const url = `https://shellafood.com/api/v1/stores/get-stores?limit=${limit}&offset=${offset}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-localization': lang,
                'moduleId': moduleId.toString(),
                'zoneId': "[2]",
                'longitude': longitude,
                'latitude': latitude,
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            },
        });
        if (!response.ok) {

            return {
                total_size: 0,
                limit: 0,
                offset: 0,
                stores: [],
            };
        }
        const data = await response.json();
        return data as Stores;

    } catch (error: any) {
        return {
            total_size: 0,
            limit: 0,
            offset: 0,
            stores: [],
        }
    }
}




