// components/Landing/CoverageMap.tsx
"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Navigation, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

// Custom red marker icon
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to update map center
function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

interface Location {
    id: number;
    name: string;
    address: string;
    phone: string;
    lat: number;
    lng: number;
}

interface CoverageMapProps {
    searchQuery?: string;
    onLocationFound?: (found: boolean) => void;
}

export default function CoverageMap({ searchQuery, onLocationFound }: CoverageMapProps) {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([29.7604, -95.3698]);
    const [mapZoom, setMapZoom] = useState(11);
    const [searchedLocation, setSearchedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);

    // Location data with real coordinates for Houston area
    const locations: Location[] = [
        {
            id: 1,
            name: "Track Fleet - Jacinto city",
            address: "House 44, Road 2, Jacinto city, Houston",
            phone: "000-0000-000",
            lat: 29.7654,
            lng: -95.2269
        },
        {
            id: 2,
            name: "Track Fleet - Jacinto city",
            address: "House 44, Road 2, Jacinto city, Houston",
            phone: "000-0000-000",
            lat: 29.8154,
            lng: -95.3769
        },
        {
            id: 3,
            name: "Track Fleet - Jacinto city",
            address: "House 44, Road 2, Jacinto city, Houston",
            phone: "000-0000-000",
            lat: 29.7204,
            lng: -95.4269
        },
        {
            id: 4,
            name: "Track Fleet - Jacinto city",
            address: "House 44, Road 2, Jacinto city, Houston",
            phone: "000-0000-000",
            lat: 29.6604,
            lng: -95.2869
        },
        {
            id: 5,
            name: "Track Fleet - Jacinto city",
            address: "House 44, Road 2, Jacinto city, Houston",
            phone: "000-0000-000",
            lat: 29.8404,
            lng: -95.2069
        }
    ];

    // Handle search query changes with geocoding
    useEffect(() => {
        const geocodeLocation = async () => {
            if (searchQuery && searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                
                // First, try to find in existing locations
                const foundLocation = locations.find(
                    (loc) =>
                        loc.name.toLowerCase().includes(query) ||
                        loc.address.toLowerCase().includes(query) ||
                        loc.phone.includes(query)
                );

                if (foundLocation) {
                    setMapCenter([foundLocation.lat, foundLocation.lng]);
                    setMapZoom(13);
                    setSelectedLocation(foundLocation);
                    setSearchedLocation(null);
                    onLocationFound?.(true);
                    toast.success("Location found!", {
                        description: `Showing ${foundLocation.name}`,
                    });
                } else {
                    // If not found in predefined locations, use geocoding
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
                        );
                        const data = await response.json();

                        if (data && data.length > 0) {
                            const result = data[0];
                            const lat = parseFloat(result.lat);
                            const lng = parseFloat(result.lon);
                            
                            setMapCenter([lat, lng]);
                            setMapZoom(13);
                            setSearchedLocation({
                                lat,
                                lng,
                                name: result.display_name
                            });
                            setSelectedLocation(null);
                            onLocationFound?.(true);
                            toast.success("Location found!", {
                                description: result.display_name.split(',').slice(0, 3).join(','),
                            });
                        } else {
                            onLocationFound?.(false);
                            toast.error("Location not found", {
                                description: `Could not find "${searchQuery}". Please try a different search.`,
                            });
                        }
                    } catch (error) {
                        console.error('Geocoding error:', error);
                        onLocationFound?.(false);
                        toast.error("Search failed", {
                            description: "Unable to search for location. Please try again.",
                        });
                    }
                }
            }
        };

        geocodeLocation();
    }, [searchQuery]);

    const handleDirectionClick = (location: Location) => {
        setSelectedLocation(location);
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
        window.open(googleMapsUrl, '_blank');
    };

    const handleLocationCardClick = (location: Location) => {
        setMapCenter([location.lat, location.lng]);
        setMapZoom(14);
        setSelectedLocation(location);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-border rounded-xl mb-6 md:mb-24 overflow-hidden">
            {/* Location List */}
            <div className="space-y-4 lg:order-1 order-2 p-4 bg-gray-50 max-h-[600px] overflow-y-auto">
                {locations.map((location) => (
                    <div
                        key={location.id}
                        onClick={() => handleLocationCardClick(location)}
                        className={`bg-white rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer border flex justify-between items-start ${selectedLocation?.id === location.id
                            ? 'border-primary ring-1 ring-primary/20'
                            : 'border-border'
                            }`}
                    >
                        <div className="flex-1 pr-4">
                            <h4 className="font-bold text-base text-foreground mb-2">
                                {location.name}
                            </h4>
                            <p className="text-sm text-secondary mb-1 leading-snug">{location.address}</p>
                            <p className="text-sm text-secondary">{location.phone}</p>
                        </div>

                        <div
                            className="flex flex-col items-center gap-1 min-w-[70px] pt-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDirectionClick(location);
                            }}
                        >
                            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" className="hover:scale-110 transition-transform duration-200">
                                <path d="M11.8995 0.585787C12.6805 -0.195262 13.9469 -0.195262 14.7279 0.585786L26.0416 11.8995C26.8227 12.6805 26.8227 13.9469 26.0416 14.7279L14.7279 26.0416C13.9469 26.8227 12.6805 26.8227 11.8995 26.0416L0.585787 14.7279C-0.195262 13.9469 -0.195262 12.6805 0.585786 11.8995L11.8995 0.585787Z" fill="#1D92ED" />
                                <path d="M9.31348 18.1715V14.1715C9.31348 13.6411 9.52419 13.1324 9.89926 12.7573C10.2743 12.3823 10.783 12.1715 11.3135 12.1715H17.9801M17.9801 12.1715L15.3135 9.50488M17.9801 12.1715L15.3135 14.8382" stroke="#E8F4FD" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-primary text-sm font-medium">Direction</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Map */}
            <div className="lg:order-2 order-1 col-span-2 h-[400px] lg:h-full lg:min-h-[600px] relative">
                <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ height: '100%', width: '100%', borderRadius: '0 0.75rem 0.75rem 0' }}
                    scrollWheelZoom={true}
                >
                    <ChangeMapView center={mapCenter} zoom={mapZoom} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locations.map((location) => (
                        <Marker
                            key={location.id}
                            position={[location.lat, location.lng]}
                            icon={redIcon}
                            eventHandlers={{
                                click: () => handleLocationCardClick(location),
                            }}
                        >
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <h4 className="font-semibold text-foreground mb-1">
                                        {location.name}
                                    </h4>
                                    <p className="text-sm text-secondary mb-1">{location.address}</p>
                                    <p className="text-sm text-secondary mb-2">{location.phone}</p>
                                    <button
                                        onClick={() => handleDirectionClick(location)}
                                        className="text-primary text-sm hover:underline flex items-center gap-1"
                                    >
                                        <Navigation className="h-3 w-3" />
                                        Get Directions
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                    
                    {/* Searched Location Marker */}
                    {searchedLocation && (
                        <Marker
                            position={[searchedLocation.lat, searchedLocation.lng]}
                            eventHandlers={{
                                click: () => {},
                            }}
                        >
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <h4 className="font-semibold text-foreground mb-1">
                                        Searched Location
                                    </h4>
                                    <p className="text-sm text-secondary mb-2">{searchedLocation.name}</p>
                                    <button
                                        onClick={() => {
                                            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${searchedLocation.lat},${searchedLocation.lng}`;
                                            window.open(googleMapsUrl, '_blank');
                                        }}
                                        className="text-primary text-sm hover:underline flex items-center gap-1"
                                    >
                                        <Navigation className="h-3 w-3" />
                                        Get Directions
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}