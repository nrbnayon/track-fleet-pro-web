// server/websocket.js
// Run this separately: node server/websocket.js

const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store active driver connections
const driverConnections = new Map();
const trackingClients = new Map();

wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathParts = url.pathname.split('/');
    
    // Handle driver connections: /driver/:driverId
    if (pathParts[1] === 'driver') {
        const driverId = pathParts[2];
        console.log(`Driver ${driverId} connected`);
        
        driverConnections.set(driverId, ws);
        
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                
                // Validate location data
                if (data.latitude && data.longitude) {
                    // Broadcast to all clients tracking this driver
                    const clients = trackingClients.get(driverId) || new Set();
                    clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                driverId,
                                latitude: data.latitude,
                                longitude: data.longitude,
                                timestamp: new Date().toISOString(),
                                speed: data.speed || 0,
                                heading: data.heading || 0,
                            }));
                        }
                    });
                }
            } catch (error) {
                console.error('Error processing driver message:', error);
            }
        });
        
        ws.on('close', () => {
            console.log(`Driver ${driverId} disconnected`);
            driverConnections.delete(driverId);
        });
    }
    
    // Handle tracking connections: /track/:driverId
    if (pathParts[1] === 'track') {
        const driverId = pathParts[2];
        console.log(`Client tracking driver ${driverId}`);
        
        if (!trackingClients.has(driverId)) {
            trackingClients.set(driverId, new Set());
        }
        trackingClients.get(driverId).add(ws);
        
        // Send initial connection confirmation
        ws.send(JSON.stringify({
            type: 'connected',
            driverId,
            message: 'Connected to live tracking',
        }));
        
        ws.on('close', () => {
            console.log(`Client stopped tracking driver ${driverId}`);
            const clients = trackingClients.get(driverId);
            if (clients) {
                clients.delete(ws);
                if (clients.size === 0) {
                    trackingClients.delete(driverId);
                }
            }
        });
    }
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Simulate driver movement for demo purposes
// Remove this in production - real drivers will send actual GPS data
function simulateDriverMovement() {
    const driverIds = ['DRV001', 'DRV002', 'DRV003', 'DRV004'];
    
    setInterval(() => {
        driverIds.forEach(driverId => {
            const clients = trackingClients.get(driverId);
            if (clients && clients.size > 0) {
                // Simulate location update (small random movement)
                const baseLocation = {
                    'DRV001': { lat: 23.8103, lng: 90.4125 },
                    'DRV002': { lat: 23.8759, lng: 90.3795 },
                    'DRV003': { lat: 23.7808, lng: 90.4217 },
                    'DRV004': { lat: 23.7461, lng: 90.3742 },
                };
                
                const base = baseLocation[driverId];
                if (base) {
                    const latitude = base.lat + (Math.random() - 0.5) * 0.002;
                    const longitude = base.lng + (Math.random() - 0.5) * 0.002;
                    
                    clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                driverId,
                                latitude,
                                longitude,
                                timestamp: new Date().toISOString(),
                                speed: Math.random() * 60,
                                heading: Math.random() * 360,
                            }));
                        }
                    });
                }
            }
        });
    }, 3000); // Update every 3 seconds
}

// Start simulation (remove in production)
simulateDriverMovement();

const PORT = process.env.WS_PORT || 3001;
server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
    console.log(`Driver endpoint: ws://localhost:${PORT}/driver/:driverId`);
    console.log(`Tracking endpoint: ws://localhost:${PORT}/track/:driverId`);
});

module.exports = { wss };