"use client";

import { useEffect, useRef, useState } from "react";

interface ParcelMapProps {
    pickupLocation: { lat: number; lng: number };
    deliveryLocation: { lat: number; lng: number };
    currentLocation: { lat: number; lng: number };
    parcelStatus: string;
    driverAssigned: boolean;
    driverId?: string; // Driver ID for real-time tracking
}

export default function ParcelMap({
    pickupLocation,
    deliveryLocation,
    currentLocation,
    parcelStatus,
    driverAssigned,
    driverId,
}: ParcelMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
    const [driverMarker, setDriverMarker] = useState<google.maps.Marker | null>(null);
    const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // Real-time tracking state
    const [liveLocation, setLiveLocation] = useState(currentLocation);
    const [isTracking, setIsTracking] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const animationRef = useRef<number | null>(null);

    // Sync liveLocation with props initially or when props change explicitly
    useEffect(() => {
        setLiveLocation(currentLocation);
    }, [currentLocation]);

    // WebSocket connection for real-time tracking
    useEffect(() => {
        // Only connect if we have a driver ID and status is relevant
        const shouldTrack = driverAssigned && driverId && ["ongoing", "ONGOING", "assigned", "ASSIGNED"].includes(parcelStatus);
        
        if (!shouldTrack) {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
                setIsTracking(false);
            }
            return;
        }

        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8002/ws/driver-realtime-location/";
        console.log(`Connecting to WebSocket: ${wsUrl} for Driver: ${driverId}`);
        
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("✅ WebSocket Connected for Live Tracking");
            setIsTracking(true);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                // Check for driver update event
                if (data.type === 'driver_update' && data.driver && String(data.driver.id) === String(driverId)) {
                    const newLat = parseFloat(data.driver.lat);
                    const newLng = parseFloat(data.driver.lng);
                    
                    if (!isNaN(newLat) && !isNaN(newLng)) {
                        console.log("📍 Real-time Update Received:", newLat, newLng);
                        const newPos = { lat: newLat, lng: newLng };
                        
                        // Update state
                        setLiveLocation(newPos);
                        
                        // Animate marker if map exists
                        if (driverMarker) {
                            animateMarkerTo(driverMarker, newPos);
                        }
                    }
                }
            } catch (err) {
                console.error("WebSocket Message Error:", err);
            }
        };

        ws.onerror = (e) => {
            console.error("WebSocket Error:", e);
            setIsTracking(false);
        };

        ws.onclose = () => {
            console.log("WebSocket Disconnected");
            setIsTracking(false);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) ws.close();
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [driverId, driverAssigned, parcelStatus, driverMarker]);

    // Marker Animation Helper
    const animateMarkerTo = (marker: google.maps.Marker, targetPos: { lat: number, lng: number }) => {
        const startPos = marker.getPosition();
        if (!startPos) {
            marker.setPosition(targetPos);
            return;
        }

        const startLat = startPos.lat();
        const startLng = startPos.lng();
        const startTime = performance.now();
        const duration = 1000; // 1 second animation

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutQuad)
            const ease = 1 - (1 - progress) * (1 - progress);

            const currentLat = startLat + (targetPos.lat - startLat) * ease;
            const currentLng = startLng + (targetPos.lng - startLng) * ease;

            const newPos = new google.maps.LatLng(currentLat, currentLng);
            marker.setPosition(newPos);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                marker.setPosition(targetPos);
            }
        };

        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize Map
    useEffect(() => {
        const initMap = async () => {
            try {
                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
                if (!apiKey) {
                    throw new Error("Google Maps API Key is missing. Please check your .env file.");
                }

                if (typeof google !== 'undefined' && google.maps) {
                    renderMap();
                    return;
                }

                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
                script.async = true;
                script.defer = true;
                script.onload = () => renderMap();
                script.onerror = () => setError('Failed to load Google Maps script');

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
                    // Start center
                    const centerLat = (pickupLocation.lat + deliveryLocation.lat) / 2;
                    const centerLng = (pickupLocation.lng + deliveryLocation.lng) / 2;

                    const mapInstance = new google.maps.Map(mapRef.current, {
                        center: { lat: centerLat, lng: centerLng },
                        zoom: 13,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        streetViewControl: false,
                        styles: [
                            {
                                "featureType": "poi",
                                "stylers": [{ "visibility": "off" }]
                            }
                        ]
                    });

                    setMap(mapInstance);

                    // Markers
                    createMarker(mapInstance, pickupLocation, "Pickup", "#3B82F6");
                    createMarker(mapInstance, deliveryLocation, "Delivery", parcelStatus.toLowerCase().includes("delivered") ? "#10B981" : "#9CA3AF");

                    // Initial Driver Marker
                    const normalizeStatus = (s: string) => s.toLowerCase();
                    const status = normalizeStatus(parcelStatus);
                    if (driverAssigned && ["ongoing", "pending", "assigned"].includes(status)) {
                        const marker = createDriverMarker(mapInstance, liveLocation); // Use liveLocation
                        setDriverMarker(marker);
                    }

                    // Route
                    calculateRoute(mapInstance);
                }
            } catch (err: any) {
                console.error("Error rendering map:", err);
                setError(err.message || "Failed to render map");
            }
        };

        initMap();

        return () => {
            if (directionsRenderer) directionsRenderer.setMap(null);
            if (driverMarker) driverMarker.setMap(null);
        };
    }, []); // Run once on mount

    // Helper: Create Standard Marker
    const createMarker = (map: google.maps.Map, position: any, title: string, color: string) => {
        const marker = new google.maps.Marker({
            position,
            map,
            title,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: color,
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 3,
            },
        });
        
        const infoWindow = new google.maps.InfoWindow({
            content: `<div style="padding: 8px;"><strong>${title}</strong></div>`,
        });

        marker.addListener('mouseover', () => infoWindow.open(map, marker));
        marker.addListener('mouseout', () => infoWindow.close());
        return marker;
    };

    // Helper: Create Driver Marker
    const createDriverMarker = (map: google.maps.Map, position: any) => {
        const marker = new google.maps.Marker({
            position,
            map,
            title: "Driver Location",
            zIndex: 1000,
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

        const infoWindow = new google.maps.InfoWindow({
            content: '<div style="padding: 8px;"><strong>Driver Location</strong><br/><span style="font-size: 12px; color: #666;">Live Tracking</span></div>',
        });

        marker.addListener('mouseover', () => infoWindow.open(map, marker));
        marker.addListener('mouseout', () => infoWindow.close());
        return marker;
    };

    // Helper: Calculate Route
    const calculateRoute = (map: google.maps.Map) => {
        const directionsService = new google.maps.DirectionsService();
        const renderer = new google.maps.DirectionsRenderer({
            map,
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: "#3B82F6",
                strokeWeight: 6,
                strokeOpacity: 0.8,
            },
        });
        setDirectionsRenderer(renderer);

        directionsService.route(
            {
                origin: pickupLocation,
                destination: deliveryLocation,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                    renderer.setDirections(result);
                    const leg = result.routes[0]?.legs[0];
                    if (leg) {
                        setRouteInfo({
                            distance: leg.distance?.text || "N/A",
                            duration: leg.duration?.text || "N/A",
                        });
                    }
                }
            }
        );
    };

    // Handle Live Location Updates on the Map
    useEffect(() => {
        if (!map || !driverMarker) return;

        // If not tracking via WebSocket (e.g. static prop update via re-fetch), snap to position.
        // During tracking, animation handles the position update smoothly.
        if (!isTracking) {
            driverMarker.setPosition(liveLocation);
        }
    }, [liveLocation, map, driverMarker, isTracking]);

    // Re-center logic to follow driver
    useEffect(() => {
        if (map && liveLocation && ["ongoing", "ONGOING", "assigned", "ASSIGNED"].includes(parcelStatus)) {
             map.panTo(liveLocation); 
        }
    }, [liveLocation, map, parcelStatus]);


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
                <div className="hidden md:flex md:flex-col absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100 min-w-[140px] z-10">
                    <h4 className="font-semibold text-sm mb-2 text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Route Info
                    </h4>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline gap-4">
                            <span className="text-xs text-gray-500 font-medium">Distance</span>
                            <span className="text-sm font-bold text-gray-900">{routeInfo.distance}</span>
                        </div>
                        <div className="flex justify-between items-baseline gap-4">
                            <span className="text-xs text-gray-500 font-medium">Est. Time</span>
                            <span className="text-sm font-bold text-gray-900">{routeInfo.duration}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Live Indicator */}
            {isTracking && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-gray-200 z-10">
                    <div className="flex items-center gap-2">
                         <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <p className="text-sm font-bold text-gray-800">
                            Live Tracking
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}