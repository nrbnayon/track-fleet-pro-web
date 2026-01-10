"use client";

import { useEffect, useRef, useState } from "react";

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
    const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initMap = async () => {
            try {
                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
                if (!apiKey) {
                    throw new Error("Google Maps API Key is missing. Please check your .env file.");
                }

                // Check if already loaded
                if (typeof google !== 'undefined' && google.maps) {
                    renderMap();
                    return;
                }

                // Load the Google Maps script
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
                script.async = true;
                script.defer = true;

                script.onload = () => {
                    renderMap();
                };

                script.onerror = () => {
                    setError('Failed to load Google Maps script');
                };

                // Only append if not already loaded
                if (!document.querySelector(`script[src^="https://maps.googleapis.com/maps/api/js"]`)) {
                    document.head.appendChild(script);
                }
            } catch (err: any) {
                console.error("Error loading map:", err);
                setError(err.message || "Failed to load map");
            }
        };

        const renderMap = () => {
            try {
                if (mapRef.current && typeof google !== 'undefined' && google.maps) {
                    // Calculate center point between pickup and delivery
                    const centerLat = (pickupLocation.lat + deliveryLocation.lat) / 2;
                    const centerLng = (pickupLocation.lng + deliveryLocation.lng) / 2;

                    const mapInstance = new google.maps.Map(mapRef.current, {
                        center: { lat: centerLat, lng: centerLng },
                        zoom: 13,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        streetViewControl: false,
                    });

                    setMap(mapInstance);

                    // Create pickup marker (blue) with info window
                    const pickupMarker = new google.maps.Marker({
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

                    const pickupInfo = new google.maps.InfoWindow({
                        content: '<div style="padding: 8px;"><strong>Pickup Location</strong></div>',
                    });

                    pickupMarker.addListener('mouseover', () => {
                        pickupInfo.open(mapInstance, pickupMarker);
                    });

                    pickupMarker.addListener('mouseout', () => {
                        pickupInfo.close();
                    });

                    // Create delivery marker (green for delivered, gray otherwise) with info window
                    const deliveryColor = parcelStatus === "delivered" ? "#10B981" : "#9CA3AF";
                    const deliveryMarker = new google.maps.Marker({
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

                    const deliveryInfo = new google.maps.InfoWindow({
                        content: `<div style="padding: 8px;"><strong>${parcelStatus === "delivered" ? "Delivered" : "Delivery Location"}</strong></div>`,
                    });

                    deliveryMarker.addListener('mouseover', () => {
                        deliveryInfo.open(mapInstance, deliveryMarker);
                    });

                    deliveryMarker.addListener('mouseout', () => {
                        deliveryInfo.close();
                    });

                    // Create driver marker with car icon if assigned and ongoing
                    if (driverAssigned && (parcelStatus === "ongoing" || parcelStatus === "pending")) {
                        const marker = new google.maps.Marker({
                            position: currentLocation,
                            map: mapInstance,
                            title: "Driver Location",
                            icon: {
                                url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="24" r="18" fill="#EF4444" stroke="white" stroke-width="4"/>
                                        <g transform="translate(12, 14)">
                                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z" fill="white"/>
                                        </g>
                                    </svg>
                                `),
                                scaledSize: new google.maps.Size(48, 48),
                                anchor: new google.maps.Point(24, 24),
                            },
                        });

                        const driverInfo = new google.maps.InfoWindow({
                            content: '<div style="padding: 8px;"><strong>Driver Location</strong><br/><span style="font-size: 12px;">On the way to delivery</span></div>',
                        });

                        marker.addListener('mouseover', () => {
                            driverInfo.open(mapInstance, marker);
                        });

                        marker.addListener('mouseout', () => {
                            driverInfo.close();
                        });

                        setDriverMarker(marker);
                    }

                    // Draw route
                    const directionsService = new google.maps.DirectionsService();
                    const renderer = new google.maps.DirectionsRenderer({
                        map: mapInstance,
                        suppressMarkers: true,
                        polylineOptions: {
                            strokeColor: "#3B82F6",
                            strokeWeight: 5,
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
                        (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
                            if (status === google.maps.DirectionsStatus.OK && result) {
                                renderer.setDirections(result);

                                // Extract distance and duration
                                const route = result.routes[0];
                                if (route && route.legs && route.legs[0]) {
                                    const leg = route.legs[0];
                                    setRouteInfo({
                                        distance: leg.distance?.text || "N/A",
                                        duration: leg.duration?.text || "N/A",
                                    });
                                }
                            } else {
                                console.error('Directions request failed:', status);
                            }
                        }
                    );
                }
            } catch (err: any) {
                console.error("Error rendering map:", err);
                setError(err.message || "Failed to render map");
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

    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
                <p className="text-red-500 font-medium mb-2">Failed to load map</p>
                <p className="text-xs text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            <div ref={mapRef} className="w-full h-full" />

            {/* Route Info Card */}
            {routeInfo && (
                <div className="hidden md:flex absolute top-4 left-1 bg-white/95 backdrop-blur p-2 rounded-lg shadow-lg border border-gray-200 min-w-[120px]">
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">Route Information</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Distance:</span>
                            <span className="text-sm font-medium text-foreground">{routeInfo.distance}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Duration:</span>
                            <span className="text-sm font-medium text-foreground">{routeInfo.duration}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur p-3 rounded-lg shadow-lg border border-gray-200 text-xs space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                    <span className="text-gray-700">Pickup</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border-2 border-white ${parcelStatus === "delivered" ? "bg-green-500" : "bg-gray-400"
                        }`}></div>
                    <span className="text-gray-700">Delivery</span>
                </div>
                {driverAssigned && (parcelStatus === "ongoing" || parcelStatus === "pending") && (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white"></div>
                        <span className="text-gray-700">Driver</span>
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