// Example: Driver Mobile App Component (React Native or Web)
// This would run on driver's device to send live GPS location

import { useEffect, useRef, useState } from 'react';

interface DriverLocationSenderProps {
    driverId: string;
    isActive: boolean;
}

export function DriverLocationSender({ driverId, isActive }: DriverLocationSenderProps) {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    useEffect(() => {
        if (!isActive) {
            wsRef.current?.close();
            return;
        }

        // Connect to WebSocket server
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
        const ws = new WebSocket(`${wsUrl}/driver/${driverId}`);

        ws.onopen = () => {
            // console.log('Connected to tracking server');
            setIsConnected(true);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
        };

        ws.onclose = () => {
            // console.log('Disconnected from tracking server');
            setIsConnected(false);
        };

        wsRef.current = ws;

        return () => {
            ws.close();
        };
    }, [driverId, isActive]);

    useEffect(() => {
        if (!isActive || !isConnected) return;

        let watchId: number;

        // Watch position changes (browser Geolocation API)
        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        speed: position.coords.speed || 0,
                        heading: position.coords.heading || 0,
                        timestamp: new Date().toISOString(),
                    };

                    // Send location to server
                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                        wsRef.current.send(JSON.stringify(locationData));
                        setLastUpdate(new Date());
                    }
                },
                (error) => {
                    console.error('Location error:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        }

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [isActive, isConnected]);

    // Alternative: HTTP fallback for sending location
    useEffect(() => {
        if (!isActive || isConnected) return;

        const sendLocationViaHTTP = async () => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            await fetch(`/api/drivers/${driverId}/location`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                    accuracy: position.coords.accuracy,
                                    speed: position.coords.speed || 0,
                                    heading: position.coords.heading || 0,
                                }),
                            });
                            setLastUpdate(new Date());
                        } catch (error) {
                            console.error('Error sending location:', error);
                        }
                    }
                );
            }
        };

        // Send location every 5 seconds via HTTP if WebSocket not connected
        const intervalId = setInterval(sendLocationViaHTTP, 5000);
        sendLocationViaHTTP(); // Initial call

        return () => clearInterval(intervalId);
    }, [driverId, isActive, isConnected]);

    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <div>
                    <p className="text-sm font-semibold">
                        Location Sharing: {isActive ? 'Active' : 'Inactive'}
                    </p>
                    <p className="text-xs text-gray-500">
                        {isConnected ? 'Live Tracking' : 'Using Fallback'}
                    </p>
                    {lastUpdate && (
                        <p className="text-xs text-gray-400">
                            Last: {lastUpdate.toLocaleTimeString()}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Usage in Driver App:
// <DriverLocationSender driverId="DRV001" isActive={true} />