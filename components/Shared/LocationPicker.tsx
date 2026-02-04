"use client";

import { useEffect, useRef, useState } from "react";
// import { Loader } from "@googlemaps/js-api-loader"; // Removed as per error
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Search, Navigation, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationValue {
    address: string;
    lat?: number;
    lng?: number;
}

interface LocationPickerProps {
    label: string;
    placeholder?: string;
    value?: LocationValue;
    onChange: (value: LocationValue) => void;
    className?: string;
    error?: string;
    required?: boolean;
}

export function LocationPicker({
    label,
    placeholder = "Search location...",
    value,
    onChange,
    className,
    error,
    required = false
}: LocationPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value?.address || "");
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    const [markerInstance, setMarkerInstance] = useState<google.maps.Marker | null>(null);
    const [autoComplete, setAutoComplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // Load Google Maps API using importLibrary
    useEffect(() => {
        if (!apiKey) return;

        const init = async () => {
            try {
                // Dynamically import the loader to access functional API
                const { setOptions, importLibrary } = await import("@googlemaps/js-api-loader");
                
                setOptions({
                    key: apiKey,
                    v: "weekly",
                });

                const { Autocomplete } = await importLibrary("places") as google.maps.PlacesLibrary;
                const { Geocoder } = await importLibrary("geocoding") as google.maps.GeocodingLibrary;

                if (inputRef.current && !autoComplete) {
                    const ac = new Autocomplete(inputRef.current, {
                        fields: ["formatted_address", "geometry", "name"],
                    });
                    
                    ac.addListener("place_changed", () => {
                        const place = ac.getPlace();
                        if (place.geometry && place.geometry.location) {
                            const newLocation = {
                                address: place.formatted_address || place.name || inputValue,
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng(),
                            };
                            setInputValue(newLocation.address);
                            onChange(newLocation);
                        }
                    });
                    setAutoComplete(ac);
                }

                if (!geocoder) {
                    setGeocoder(new Geocoder());
                }
            } catch (err: any) {
                console.error("Failed to load Google Maps libraries:", err);
            }
        };

        init();
    }, [apiKey, inputRef]);

    // Update input value if prop changes
    useEffect(() => {
        if (value?.address && value.address !== inputValue) {
            setInputValue(value.address);
        }
    }, [value]);

    const handleMapOpen = () => {
        setIsOpen(true);
        setTimeout(async () => {
            if (!apiKey) return;
            
            try {
                // Dynamically import the loader to access functional API
                const { importLibrary } = await import("@googlemaps/js-api-loader");
                // Note: options should already be set in strict mode, but we can call it again safely or skip if we assume useEffect ran.
                // We'll rely on global loading in useEffect for setOptions mostly, but calling importLibrary is fine.

                const { Map } = await importLibrary("maps") as google.maps.MapsLibrary;
                const { Marker } = await importLibrary("marker") as google.maps.MarkerLibrary;
                
                // Ensure Geocoder is loaded if not already
                if (!geocoder) {
                     const { Geocoder } = await importLibrary("geocoding") as google.maps.GeocodingLibrary;
                     setGeocoder(new Geocoder());
                }

                if (!mapInstance && mapRef.current) {
                    const defaultLocation = { lat: 23.8103, lng: 90.4125 }; // Dhaka center
                    const initialCenter = value?.lat && value?.lng 
                        ? { lat: value.lat, lng: value.lng } 
                        : defaultLocation;

                    const map = new Map(mapRef.current, {
                        center: initialCenter,
                        zoom: 13,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        streetViewControl: false,
                        mapId: "DEMO_MAP_ID", 
                    });

                    const marker = new Marker({
                        position: initialCenter,
                        map: map,
                        draggable: true,
                        animation: google.maps.Animation.DROP,
                    });

                    setMapInstance(map);
                    setMarkerInstance(marker);

                    // Handle map clicks
                    map.addListener("click", (e: google.maps.MapMouseEvent) => {
                        if (e.latLng) {
                            marker.setPosition(e.latLng);
                            updateFromLatLng(e.latLng);
                        }
                    });

                    // Handle marker drag (standard Marker)
                    marker.addListener("dragend", () => {
                        const position = marker.getPosition();
                        if (position) {
                            updateFromLatLng(position);
                        }
                    });
                    
                    // Try to get current user location if no value set
                    if ((!value?.lat || !value?.lng) && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                            const userPos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            map.setCenter(userPos);
                            marker.setPosition(userPos);
                            updateFromLatLng(new google.maps.LatLng(userPos));
                        });
                    }
                } else if (mapInstance && value?.lat && value?.lng) {
                     // Update existing map to new value if it changed outside
                     const pos = { lat: value.lat, lng: value.lng };
                     mapInstance.setCenter(pos);
                     markerInstance?.setPosition(pos);
                }
            } catch (err: any) {
                console.error("Error initializing map:", err);
            }
        }, 100);
    };

    const updateFromLatLng = (latLng: google.maps.LatLng) => {
        if (!geocoder) return;
        setIsLoading(true);
        geocoder.geocode({ location: latLng }, (results, status) => {
            setIsLoading(false);
            if (status === "OK" && results && results[0]) {
                const newLocation = {
                    address: results[0].formatted_address,
                    lat: latLng.lat(),
                    lng: latLng.lng(),
                };
                onChange(newLocation);
                setInputValue(newLocation.address);
            } else {
                // Fallback if geocoding fails
                const newLocation = {
                    address: `${latLng.lat().toFixed(6)}, ${latLng.lng().toFixed(6)}`,
                    lat: latLng.lat(),
                    lng: latLng.lng(),
                };
                onChange(newLocation);
                setInputValue(newLocation.address);
            }
        });
    };
    
    const handleUseCurrentLocation = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening map if clicked on a button inside (though currently separate)
        
        if (navigator.geolocation) {
             // For the input field "Locate Me" button
             if (!geocoder) return; // Wait for load
             
             navigator.geolocation.getCurrentPosition((position) => {
                 const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                 updateFromLatLng(latLng);
             });
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <Label className="text-sm font-semibold text-gray-700">{label}{required && <span className="text-red-500">*</span>}</Label>
            <div className="relative flex gap-2">
                <div className="relative flex-1">
                    <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            // Simple text update, coords lost until selected from list
                            onChange({ address: e.target.value }); 
                        }}
                        placeholder={placeholder}
                        className={cn("bg-white border-gray-100 rounded-lg h-11 pr-10", error && "border-red-500")}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search className="h-4 w-4" />
                    </div>
                </div>
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleMapOpen}
                    className="h-11 px-3 border-gray-200 bg-gray-50 hover:bg-gray-100 hover:text-gray-600"
                    title="Pick on Map"
                >
                    <MapPin className="h-5 w-5" />
                </Button>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[700px] p-0 rounded-xl overflow-hidden bg-white">
                    <DialogHeader className="p-4 bg-white z-10 shadow-sm relative"> {/* Added relative for absolute positioning if needed, though flex usually enough */}
                        <div className="flex justify-between items-center w-full">
                            <DialogTitle className="flex items-center gap-2">
                                <span>Select Location</span>
                                {isLoading && <span className="text-xs text-blue-500 font-normal">Getting address...</span>}
                            </DialogTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-gray-50 hover:text-red-500"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </DialogHeader>
                    
                    <div className="w-full h-[400px] relative">
                         <div ref={mapRef} className="w-full h-full bg-gray-100" />
                         
                         {/* Map overlay controls */}
                         <div className="absolute top-4 left-4 p-2">
                             <Button 
                                size="sm" 
                                className="bg-white text-black hover:bg-gray-100 shadow-md"
                                onClick={() => {
                                    if (navigator.geolocation && mapInstance && markerInstance) {
                                        navigator.geolocation.getCurrentPosition((position) => {
                                            const pos = {
                                                lat: position.coords.latitude,
                                                lng: position.coords.longitude
                                            };
                                            mapInstance.setCenter(pos);
                                            markerInstance.setPosition(pos);
                                            updateFromLatLng(new google.maps.LatLng(pos));
                                        });
                                    }
                                }}
                             >
                                <Navigation className="h-4 w-4 mr-2" /> Use My Location
                             </Button>
                         </div>
                    </div>
                    
                    <DialogFooter className="p-4 bg-gray-50 border-t items-center w-full sm:justify-between">
                         <div className="text-sm text-gray-600 truncate max-w-[300px] font-medium">
                             {inputValue || "No location selected"}
                         </div>
                         <Button onClick={() => setIsOpen(false)}>
                             Confirm Location
                         </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
