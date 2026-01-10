// app/api/drivers/[driverId]/location/route.ts

import { NextRequest, NextResponse } from "next/server";
import { allDriversData } from "@/data/allDriversData";

export async function GET(
    request: NextRequest,
    { params }: { params: { driverId: string } }
) {
    try {
        const { driverId } = params;

        // Find driver by ID
        const driver = allDriversData.find(
            (d) => d.driver_id === driverId || d.id === driverId
        );

        if (!driver) {
            return NextResponse.json(
                { error: "Driver not found" },
                { status: 404 }
            );
        }

        // Check if driver has location sharing enabled
        if (!driver.isLocationShared || !driver.current_location) {
            return NextResponse.json(
                { error: "Location not available" },
                { status: 403 }
            );
        }

        // In production, this would fetch from a real-time database
        // For demo, we return the current location
        return NextResponse.json({
            driverId: driver.driver_id,
            latitude: driver.current_location.latitude,
            longitude: driver.current_location.longitude,
            address: driver.current_location.address,
            lastUpdated: driver.current_location.lastUpdated || new Date().toISOString(),
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error fetching driver location:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}