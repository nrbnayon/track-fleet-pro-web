// app/(landing)/track-parcel/page.tsx
import type { Metadata } from "next";
import TrackParcelForm from "@/components/Landing/TrackParcelForm";
import TrackingFeatures from "@/components/Landing/TrackingFeatures";

export const metadata: Metadata = {
    title: "Track Your Parcel - Real-Time Shipment Updates",
    description:
        "Enter your tracking number to get real-time updates on your parcel. Track shipment status, current location, delivery progress, and estimated arrival time with TrackFleet Pro.",
    keywords: [
        "track parcel",
        "tracking number",
        "shipment status",
        "delivery tracking",
        "parcel location",
        "delivery updates",
        "courier tracking",
        "package tracking online",
    ],
    openGraph: {
        title: "Track Your Parcel - Real-Time Shipment Updates",
        description:
            "Enter your tracking number for instant parcel updates. Monitor your shipment location and delivery status in real-time.",
        url: "/track-parcel",
        images: ["/icons/logo.png"],
    },
    alternates: {
        canonical: "/track-parcel",
    },
};

export default function TrackParcelPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Section */}
            <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            Tracking Your Consignment
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                            Now you can easily track your consignment
                        </p>
                    </div>

                    {/* Tracking Form */}
                    <TrackParcelForm />
                </div>
            </section>

            {/* Features Section */}
            <TrackingFeatures />

            {/* Trust Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                            <p className="text-gray-600">Daily Deliveries</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">99.8%</div>
                            <p className="text-gray-600">On-Time Delivery</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                            <p className="text-gray-600">Customer Support</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// // app/(landing)/track-parcel/page.tsx
// 'use client';
// import { useState } from 'react';
// import { useTrackParcelQuery } from '@/lib/redux/services/parcelApi';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Loader2 } from 'lucide-react';

// export default function TrackParcelPage() {
//     const [trackingCode, setTrackingCode] = useState('');
//     const [searchCode, setSearchCode] = useState('');

//     // Only fetch when searchCode is set
//     const { data, error, isLoading, isFetching } = useTrackParcelQuery(searchCode, {
//         skip: !searchCode, // Skip query if no search code
//     });

//     const handleSearch = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (trackingCode.trim()) {
//             setSearchCode(trackingCode.trim());
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 py-12 px-4">
//             <div className="max-w-4xl mx-auto">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold text-gray-900 mb-2">
//                         Tracking Your Consignment
//                     </h1>
//                     <p className="text-gray-600">
//                         Now you can easily track your consignment
//                     </p>
//                 </div>

//                 {/* Search Form */}
//                 <form onSubmit={handleSearch} className="mb-8">
//                     <div className="flex gap-2">
//                         <Input
//                             type="text"
//                             placeholder="547683241JH9P8P98654"
//                             value={trackingCode}
//                             onChange={(e) => setTrackingCode(e.target.value)}
//                             className="flex-1"
//                         />
//                         <Button
//                             type="submit"
//                             disabled={isLoading || isFetching}
//                             className="bg-primary"
//                         >
//                             {(isLoading || isFetching) ? (
//                                 <>
//                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                     Searching...
//                                 </>
//                             ) : (
//                                 'Search'
//                             )}
//                         </Button>
//                     </div>
//                 </form>

//                 {/* Results */}
//                 {error && (
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
//                         <p className="font-semibold">Error</p>
//                         <p>Unable to find parcel with tracking code: {searchCode}</p>
//                     </div>
//                 )}

//                 {data && (
//                     <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
//                         {/* Parcel Info */}
//                         <div className="grid grid-cols-2 gap-4 pb-4 border-b">
//                             <div>
//                                 <p className="text-sm text-gray-600">Date</p>
//                                 <p className="font-semibold">{data.date}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-600">Parcel ID</p>
//                                 <p className="font-semibold">{data.parcelId}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-600">Weight</p>
//                                 <p className="font-semibold">{data.weight}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-600">COD</p>
//                                 <p className="font-semibold">{data.cod}</p>
//                             </div>
//                         </div>

//                         {/* Customer Info */}
//                         <div className="bg-blue-50 rounded-lg p-4">
//                             <h3 className="font-semibold text-blue-900 mb-2">Customer Info</h3>
//                             <p className="text-sm"><strong>Name:</strong> {data.customer.name}</p>
//                             <p className="text-sm"><strong>Address:</strong> {data.customer.address}</p>
//                             <p className="text-sm"><strong>Phone:</strong> {data.customer.phone}</p>
//                         </div>

//                         {/* Sender Info */}
//                         <div className="bg-blue-50 rounded-lg p-4">
//                             <h3 className="font-semibold text-blue-900 mb-2">Sender Info</h3>
//                             <p className="text-sm"><strong>Name:</strong> {data.sender.name}</p>
//                             <p className="text-sm"><strong>Address:</strong> {data.sender.address}</p>
//                             <p className="text-sm"><strong>Phone:</strong> {data.sender.phone}</p>
//                         </div>

//                         {/* Assigned To */}
//                         <div className="bg-blue-50 rounded-lg p-4">
//                             <h3 className="font-semibold text-blue-900 mb-2">Assigned to</h3>
//                             <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
//                                     {data.assignedTo.avatar ? (
//                                         <img src={data.assignedTo.avatar} alt={data.assignedTo.name} className="w-full h-full rounded-full" />
//                                     ) : (
//                                         <span className="text-lg font-semibold">{data.assignedTo.name[0]}</span>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <p className="font-semibold">{data.assignedTo.name}</p>
//                                     <p className="text-sm text-gray-600">{data.assignedTo.phone}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Tracking Updates */}
//                         <div>
//                             <h3 className="text-xl font-bold mb-4">Tracking Updates</h3>
//                             <div className="space-y-3">
//                                 {data.trackingUpdates.map((update) => (
//                                     <div key={update.id} className="flex gap-3 pb-3 border-b last:border-0">
//                                         <div className="flex-shrink-0">
//                                             <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
//                                                 <div className="w-3 h-3 bg-white rounded-full" />
//                                             </div>
//                                         </div>
//                                         <div className="flex-1">
//                                             <p className="text-sm text-primary font-semibold">{update.timestamp}</p>
//                                             <p className="text-sm text-gray-900">{update.description}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Dummy Data Note - Remove when connecting to real API */}
//                 {!searchCode && (
//                     <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
//                         <p className="font-semibold">Development Mode</p>
//                         <p className="text-sm">
//                             Currently using dummy data. Enter any tracking code to see the demo.
//                             When you connect to the real API, this will fetch actual parcel data.
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }