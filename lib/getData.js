//export async function getData(endpoint){
//    try {
//        const baseUrl ="http://localhost:3000"
//        const response = await fetch(`${baseUrl}/api/${endpoint}`, {cache:"no-store"})
//        const data = await response.json()
//        return data
//    } catch (error) {
//        console.log(error)
//    }
//}


// lib/getData.js

import { cookies } from 'next/headers';


export async function getData(endpoint) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        // Make request with cookies to pass authentication
        const response = await fetch(`${baseUrl}/api/${endpoint}`, {
            cache: "no-store",
            headers: {
                'Cookie': cookieHeader, // Pass cookies to API route
            },
        });

        // Check if response is ok
        if (!response.ok) {
            console.error(`Error fetching ${endpoint}:`, response.status, response.statusText);
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error in getData(${endpoint}):`, error);
        return [];
    }
}

