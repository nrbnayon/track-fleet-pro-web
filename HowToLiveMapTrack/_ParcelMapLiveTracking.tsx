// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Loader } from "@googlemaps/js-api-loader";

// interface ParcelMapProps {
//     pickupLocation: { lat: number; lng: number };
//     deliveryLocation: { lat: number; lng: number };
//     currentLocation: { lat: number; lng: number };
//     parcelStatus: string;
//     driverAssigned: boolean;
//     trackingNo: string;
//     riderId?: string;
// }

// export default function ParcelMap({
//     pickupLocation,
//     deliveryLocation,
//     currentLocation,
//     parcelStatus,
//     driverAssigned,
//     trackingNo,
//     riderId,
// }: ParcelMapProps) {
//     const mapRef = useRef<HTMLDivElement>(null);
//     const [map, setMap] = useState<google.maps.Map | null>(null);
//     const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
//     const [driverMarker, setDriverMarker] = useState<google.maps.Marker | null>(null);
//     const [liveLocation, setLiveLocation] = useState(currentLocation);
//     const [isConnected, setIsConnected] = useState(false);
//     const wsRef = useRef<WebSocket | null>(null);

//     // WebSocket connection for live tracking
//     useEffect(() => {
//         if (!riderId || parcelStatus !== "ongoing") return;

//         const connectWebSocket = () => {
//             // Replace with your actual WebSocket URL
//             const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
//             const ws = new WebSocket(`${wsUrl}/track/${riderId}`);

//             ws.onopen = () => {
//                 console.log("WebSocket connected for driver:", riderId);
//                 setIsConnected(true);
//             };

//             ws.onmessage = (event) => {
//                 try {
//                     const data = JSON.parse(event.data);
//                     if (data.latitude && data.longitude) {
//                         setLiveLocation({
//                             lat: data.latitude,
//                             lng: data.longitude,
//                         });
//                     }
//                 } catch (error) {
//                     console.error("Error parsing WebSocket message:", error);
//                 }
//             };

//             ws.onerror = (error) => {
//                 console.error("WebSocket error:", error);
//                 setIsConnected(false);
//             };

//             ws.onclose = () => {
//                 console.log("WebSocket disconnected");
//                 setIsConnected(false);
//                 // Attempt to reconnect after 5 seconds
//                 setTimeout(connectWebSocket, 5000);
//             };

//             wsRef.current = ws;
//         };

//         connectWebSocket();

//         return () => {
//             if (wsRef.current) {
//                 wsRef.current.close();
//             }
//         };
//     }, [riderId, parcelStatus]);

//     // Poll location via HTTP as fallback
//     useEffect(() => {
//         if (!riderId || parcelStatus !== "ongoing" || isConnected) return;

//         const pollLocation = async () => {
//             try {
//                 const response = await fetch(`/api/drivers/${riderId}/location`);
//                 if (response.ok) {
//                     const data = await response.json();
//                     if (data.latitude && data.longitude) {
//                         setLiveLocation({
//                             lat: data.latitude,
//                             lng: data.longitude,
//                         });
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching location:", error);
//             }
//         };

//         // Poll every 5 seconds
//         const intervalId = setInterval(pollLocation, 5000);
//         pollLocation(); // Initial call

//         return () => clearInterval(intervalId);
//     }, [riderId, parcelStatus, isConnected]);

//     // Initialize map
//     useEffect(() => {
//         const initMap = async () => {
//             const loader = new Loader({
//                 apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
//                 version: "weekly",
//                 libraries: ["places", "geometry"],
//             });

//             const { Map } = await loader.importLibrary("maps");
//             const { Marker } = await loader.importLibrary("marker");
//             const { DirectionsService, DirectionsRenderer } = await loader.importLibrary("routes");

//             if (mapRef.current) {
//                 const centerLat = (pickupLocation.lat + deliveryLocation.lat) / 2;
//                 const centerLng = (pickupLocation.lng + deliveryLocation.lng) / 2;

//                 const mapInstance = new Map(mapRef.current, {
//                     center: { lat: centerLat, lng: centerLng },
//                     zoom: 13,
//                     mapTypeControl: true,
//                     fullscreenControl: true,
//                     streetViewControl: false,
//                     zoomControl: true,
//                 });

//                 setMap(mapInstance);

//                 // Pickup marker
//                 new Marker({
//                     position: pickupLocation,
//                     map: mapInstance,
//                     title: "Pickup Location",
//                     label: {
//                         text: "P",
//                         color: "white",
//                         fontWeight: "bold",
//                     },
//                     icon: {
//                         path: google.maps.SymbolPath.CIRCLE,
//                         scale: 12,
//                         fillColor: "#3B82F6",
//                         fillOpacity: 1,
//                         strokeColor: "#ffffff",
//                         strokeWeight: 3,
//                     },
//                 });

//                 // Delivery marker
//                 const deliveryColor = parcelStatus === "delivered" ? "#10B981" : "#9CA3AF";
//                 new Marker({
//                     position: deliveryLocation,
//                     map: mapInstance,
//                     title: "Delivery Location",
//                     label: {
//                         text: "D",
//                         color: "white",
//                         fontWeight: "bold",
//                     },
//                     icon: {
//                         path: google.maps.SymbolPath.CIRCLE,
//                         scale: 12,
//                         fillColor: deliveryColor,
//                         fillOpacity: 1,
//                         strokeColor: "#ffffff",
//                         strokeWeight: 3,
//                     },
//                 });

//                 // Driver marker with custom SVG
//                 if (driverAssigned && (parcelStatus === "ongoing" || parcelStatus === "pending")) {
//                     const marker = new Marker({
//                         position: liveLocation,
//                         map: mapInstance,
//                         title: "Driver Location (Live)",
//                         animation: google.maps.Animation.DROP,
//                         icon: {
//                             url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
//                                 <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <circle cx="24" cy="24" r="22" fill="#EF4444" stroke="white" stroke-width="4"/>
//                                     <circle cx="24" cy="24" r="20" fill="#DC2626" opacity="0.3"/>
//                                     <path d="M24 14L28 20H25V30H23V20H20L24 14Z" fill="white"/>
//                                     <circle cx="24" cy="24" r="3" fill="white"/>
//                                 </svg>
//                             `),
//                             scaledSize: new google.maps.Size(48, 48),
//                             anchor: new google.maps.Point(24, 24),
//                         },
//                         zIndex: 1000,
//                     });

//                     // Add pulsing animation
//                     const pulseMarker = new Marker({
//                         position: liveLocation,
//                         map: mapInstance,
//                         icon: {
//                             path: google.maps.SymbolPath.CIRCLE,
//                             scale: 20,
//                             fillColor: "#EF4444",
//                             fillOpacity: 0.2,
//                             strokeColor: "#EF4444",
//                             strokeOpacity: 0.5,
//                             strokeWeight: 2,
//                         },
//                         zIndex: 999,
//                     });

//                     setDriverMarker(marker);
//                 }

//                 // Draw route
//                 const directionsService = new DirectionsService();
//                 const renderer = new DirectionsRenderer({
//                     map: mapInstance,
//                     suppressMarkers: true,
//                     polylineOptions: {
//                         strokeColor: "#3B82F6",
//                         strokeWeight: 5,
//                         strokeOpacity: 0.7,
//                     },
//                 });

//                 setDirectionsRenderer(renderer);

//                 directionsService.route(
//                     {
//                         origin: pickupLocation,
//                         destination: deliveryLocation,
//                         travelMode: google.maps.TravelMode.DRIVING,
//                     },
//                     (result, status) => {
//                         if (status === google.maps.DirectionsStatus.OK && result) {
//                             renderer.setDirections(result);
//                         }
//                     }
//                 );
//             }
//         };

//         initMap();

//         return () => {
//             if (directionsRenderer) {
//                 directionsRenderer.setMap(null);
//             }
//             if (driverMarker) {
//                 driverMarker.setMap(null);
//             }
//         };
//     }, [pickupLocation, deliveryLocation, parcelStatus, driverAssigned]);

//     // Update driver marker position with smooth animation
//     useEffect(() => {
//         if (driverMarker && map && parcelStatus === "ongoing") {
//             // Smooth animation to new position
//             const currentPos = driverMarker.getPosition();
//             if (currentPos) {
//                 const startLat = currentPos.lat();
//                 const startLng = currentPos.lng();
//                 const endLat = liveLocation.lat;
//                 const endLng = liveLocation.lng;

//                 let step = 0;
//                 const steps = 50;
//                 const animationInterval = setInterval(() => {
//                     step++;
//                     const progress = step / steps;
//                     const newLat = startLat + (endLat - startLat) * progress;
//                     const newLng = startLng + (endLng - startLng) * progress;

//                     driverMarker.setPosition({ lat: newLat, lng: newLng });

//                     if (step >= steps) {
//                         clearInterval(animationInterval);
//                     }
//                 }, 20);

//                 // Auto-center on driver if active
//                 const bounds = new google.maps.LatLngBounds();
//                 bounds.extend(liveLocation);
//                 bounds.extend(deliveryLocation);
//                 map.fitBounds(bounds, { padding: 100 });
//             }
//         }
//     }, [liveLocation, driverMarker, map, parcelStatus, deliveryLocation]);

//     // Calculate distance and ETA
//     const [distance, setDistance] = useState<string>("");
//     const [duration, setDuration] = useState<string>("");

//     useEffect(() => {
//         if (!map || parcelStatus !== "ongoing") return;

//         const service = new google.maps.DistanceMatrixService();
//         service.getDistanceMatrix(
//             {
//                 origins: [liveLocation],
//                 destinations: [deliveryLocation],
//                 travelMode: google.maps.TravelMode.DRIVING,
//             },
//             (response, status) => {
//                 if (status === "OK" && response) {
//                     const result = response.rows[0]?.elements[0];
//                     if (result?.status === "OK") {
//                         setDistance(result.distance?.text || "");
//                         setDuration(result.duration?.text || "");
//                     }
//                 }
//             }
//         );
//     }, [liveLocation, deliveryLocation, map, parcelStatus]);

//     return (
//         <div className="w-full h-full relative">
//             <div ref={mapRef} className="w-full h-full" />

//             {/* Live Status Indicator */}
//             {parcelStatus === "ongoing" && driverAssigned && (
//                 <>
//                     <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-gray-200">
//                         <div className="flex items-center gap-3">
//                             <div className="relative">
//                                 <span className="w-3 h-3 rounded-full bg-green-500 block"></span>
//                                 <span className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping"></span>
//                             </div>
//                             <div>
//                                 <p className="text-sm font-semibold text-foreground">
//                                     {isConnected ? "Live Tracking Active" : "Updating..."}
//                                 </p>
//                                 {distance && duration && (
//                                     <p className="text-xs text-gray-500">{distance} • {duration}</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Speed indicator */}
//                     <div className="absolute top-20 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-gray-200">
//                         <p className="text-xs text-gray-500">Last Update</p>
//                         <p className="text-sm font-semibold text-foreground">
//                             {new Date().toLocaleTimeString()}
//                         </p>
//                     </div>
//                 </>
//             )}

//             {/* Legend */}
//             <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur p-3 rounded-lg shadow-lg border border-gray-200 text-xs space-y-2">
//                 <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
//                     <span className="font-medium">Pickup</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <div className={`w-3 h-3 rounded-full border-2 border-white ${parcelStatus === "delivered" ? "bg-green-500" : "bg-gray-400"
//                         }`}></div>
//                     <span className="font-medium">Delivery</span>
//                 </div>
//                 {driverAssigned && parcelStatus === "ongoing" && (
//                     <div className="flex items-center gap-2">
//                         <div className="relative w-3 h-3">
//                             <div className="absolute inset-0 w-3 h-3 rounded-full bg-red-500 border-2 border-white"></div>
//                             <div className="absolute inset-0 w-3 h-3 rounded-full bg-red-500 animate-ping opacity-75"></div>
//                         </div>
//                         <span className="font-medium">Driver (Live)</span>
//                     </div>
//                 )}
//             </div>

//             {/* Recenter button */}
//             {parcelStatus === "ongoing" && (
//                 <button
//                     onClick={() => {
//                         if (map) {
//                             const bounds = new google.maps.LatLngBounds();
//                             bounds.extend(liveLocation);
//                             bounds.extend(deliveryLocation);
//                             map.fitBounds(bounds, { padding: 100 });
//                         }
//                     }}
//                     className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 p-3 rounded-lg shadow-lg border border-gray-200 transition-colors"
//                     title="Recenter Map"
//                 >
//                     <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                 </button>
//             )}
//         </div>
//     );
// }