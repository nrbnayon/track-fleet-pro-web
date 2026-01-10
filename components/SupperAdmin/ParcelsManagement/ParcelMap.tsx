"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface ParcelMapProps {
    pickupLocation: { lat: number; lng: number };
    deliveryLocation: { lat: number; lng: number };
    currentLocation: { lat: number; lng: number };
    parcelStatus: string;
    driverAssigned: boolean;
}

export default function ParcelMap({
    pickupLocation,
    deliveryLocation,
    currentLocation,
    parcelStatus,
    driverAssigned,
}: ParcelMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
    const [driverMarker, setDriverMarker] = useState<google.maps.Marker | null>(null);

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
                version: "weekly",
                libraries: ["places", "geometry"],
            });

            const { Map } = await loader.importLibrary("maps");
            const { Marker } = await loader.importLibrary("marker");
            const { DirectionsService, DirectionsRenderer } = await loader.importLibrary("routes");

            if (mapRef.current) {
                // Calculate center point between pickup and delivery
                const centerLat = (pickupLocation.lat + deliveryLocation.lat) / 2;
                const centerLng = (pickupLocation.lng + deliveryLocation.lng) / 2;

                const mapInstance = new Map(mapRef.current, {
                    center: { lat: centerLat, lng: centerLng },
                    zoom: 13,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    streetViewControl: false,
                });

                setMap(mapInstance);

                // Create pickup marker (blue)
                new Marker({
                    position: pickupLocation,
                    map: mapInstance,
                    title: "Pickup Location",
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#3B82F6",
                        fillOpacity: 1,
                        strokeColor: "#ffffff",
                        strokeWeight: 3,
                    },
                });

                // Create delivery marker (green for delivered, gray otherwise)
                const deliveryColor = parcelStatus === "delivered" ? "#10B981" : "#9CA3AF";
                new Marker({
                    position: deliveryLocation,
                    map: mapInstance,
                    title: "Delivery Location",
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: deliveryColor,
                        fillOpacity: 1,
                        strokeColor: "#ffffff",
                        strokeWeight: 3,
                    },
                });

                // Create driver marker if assigned and ongoing
                if (driverAssigned && (parcelStatus === "ongoing" || parcelStatus === "pending")) {
                    const marker = new Marker({
                        position: currentLocation,
                        map: mapInstance,
                        title: "Driver Location",
                        icon: {
                            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="white" stroke-width="4"/>
                                    <path d="M20 12L24 17H21V24H19V17H16L20 12Z" fill="white"/>
                                </svg>
                            `),
                            scaledSize: new google.maps.Size(40, 40),
                            anchor: new google.maps.Point(20, 20),
                        },
                    });
                    setDriverMarker(marker);
                }

                // Draw route
                const directionsService = new DirectionsService();
                const renderer = new DirectionsRenderer({
                    map: mapInstance,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: "#3B82F6",
                        strokeWeight: 4,
                        strokeOpacity: 0.8,
                    },
                });

                setDirectionsRenderer(renderer);

                // Calculate route
                directionsService.route(
                    {
                        origin: pickupLocation,
                        destination: deliveryLocation,
                        travelMode: google.maps.TravelMode.DRIVING,
                    },
                    (result, status) => {
                        if (status === google.maps.DirectionsStatus.OK && result) {
                            renderer.setDirections(result);
                        }
                    }
                );
            }
        };

        initMap();

        return () => {
            if (directionsRenderer) {
                directionsRenderer.setMap(null);
            }
            if (driverMarker) {
                driverMarker.setMap(null);
            }
        };
    }, []);

    // Update driver marker position when current location changes
    useEffect(() => {
        if (driverMarker && map) {
            driverMarker.setPosition(currentLocation);

            // Optionally recenter map on driver
            if (parcelStatus === "ongoing") {
                map.panTo(currentLocation);
            }
        }
    }, [currentLocation, driverMarker, map, parcelStatus]);

    return (
        <div className="w-full h-full relative">
            <div ref={mapRef} className="w-full h-full" />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-xs space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                    <span>Pickup</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border-2 border-white ${parcelStatus === "delivered" ? "bg-green-500" : "bg-gray-400"
                        }`}></div>
                    <span>Delivery</span>
                </div>
                {driverAssigned && parcelStatus === "ongoing" && (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white"></div>
                        <span>Driver</span>
                    </div>
                )}
            </div>

            {/* Status Info */}
            {parcelStatus === "ongoing" && driverAssigned && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-gray-200">
                    <p className="text-sm font-medium text-blue-600 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                        Driver is on the way
                    </p>
                </div>
            )}
        </div>
    );
}