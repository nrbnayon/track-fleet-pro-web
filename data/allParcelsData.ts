// data/allParcelsData.ts
import { Parcel } from "@/types/parcel";

export const allParcelsData: Parcel[] = [
  {
    id: "1",
    parcel_id: "PCL001",
    tracking_no: "DHL2024001234",
    parcel_name: "Electronics Package",
    parcel_status: "ongoing",
    parcel_type: "electronics",
    parcel_weight: 2.5,
    parcel_dimensions: { length: 30, width: 20, height: 15 },
    parcel_value: 15000,
    parcel_image: "/parcels/electronics.jpg",
    pickup_location: "Gulshan 1, Dhaka",
    delivery_location: "Shyamoli, Dhaka",
    estimated_delivery: "2026-01-10T18:00:00Z",
    senderInfo: {
      id: "SND001",
      name: "Lisa Williams",
      email: "lisa@example.com",
      phone: "01712345678",
      address: "House 44, Road 2, Gulshan 1, Dhaka"
    },
    receiverInfo: {
      id: "RCV001",
      name: "John Smith",
      email: "john@example.com",
      phone: "01798765432",
      address: "Flat 5B, Shyamoli, Dhaka"
    },
    sellerInfo: {
      id: "SLR001",
      name: "Tech World",
      email: "info@techworld.com",
      phone: "01623456789",
      address: "Shop 12, Bashundhara City, Dhaka"
    },
    riderInfo: {
      rider_id: "DRV001",
      rider_name: "Sarah Johnson",
      rider_email: "sarah@trackfleet.com",
      rider_phone: "01534567890",
      rider_vehicle: "Bike-DH-1234"
    },
    trackingHistory: [
      {
        status: "pending",
        location: "Gulshan 1, Dhaka",
        timestamp: "2026-01-09T10:00:00Z",
        description: "Parcel received at origin"
      },
      {
        status: "ongoing",
        location: "Mohakhali, Dhaka",
        timestamp: "2026-01-09T14:30:00Z",
        description: "Out for delivery"
      }
    ],
    payment_status: "paid",
    delivery_fee: 120,
    special_instructions: "Handle with care - fragile items",
    createdAt: "2026-01-09T10:00:00Z",
    updatedAt: "2026-01-09T14:30:00Z"
  },
  {
    id: "2",
    parcel_id: "PCL002",
    tracking_no: "DHL2024001235",
    parcel_name: "Fashion Items",
    parcel_status: "pending",
    parcel_type: "package",
    parcel_weight: 1.2,
    parcel_dimensions: { length: 25, width: 18, height: 10 },
    parcel_value: 5000,
    pickup_location: "Dhanmondi, Dhaka",
    delivery_location: "Uttara, Dhaka",
    estimated_delivery: "2026-01-11T16:00:00Z",
    senderInfo: {
      id: "SND002",
      name: "Fashion Hub",
      email: "orders@fashionhub.com",
      phone: "01845678901",
      address: "Road 8, Dhanmondi, Dhaka"
    },
    receiverInfo: {
      id: "RCV002",
      name: "Maria Garcia",
      email: "maria@example.com",
      phone: "01656789012",
      address: "Sector 10, Uttara, Dhaka"
    },
    trackingHistory: [
      {
        status: "pending",
        location: "Dhanmondi, Dhaka",
        timestamp: "2026-01-09T09:00:00Z",
        description: "Awaiting pickup"
      }
    ],
    payment_status: "pending",
    delivery_fee: 80,
    createdAt: "2026-01-09T09:00:00Z",
    updatedAt: "2026-01-09T09:00:00Z"
  },
  {
    id: "3",
    parcel_id: "PCL003",
    tracking_no: "DHL2024001236",
    parcel_name: "Medical Supplies",
    parcel_status: "delivered",
    parcel_type: "package",
    parcel_weight: 0.8,
    parcel_value: 3000,
    pickup_location: "Mirpur 10, Dhaka",
    delivery_location: "Banani, Dhaka",
    estimated_delivery: "2026-01-08T15:00:00Z",
    actual_delivery: "2026-01-08T14:45:00Z",
    senderInfo: {
      id: "SND003",
      name: "MediCare Pharmacy",
      email: "orders@medicare.com",
      phone: "01767890123",
      address: "Mirpur 10, Dhaka"
    },
    receiverInfo: {
      id: "RCV003",
      name: "Ahmed Hassan",
      email: "ahmed@example.com",
      phone: "01578901234",
      address: "Road 11, Banani, Dhaka"
    },
    riderInfo: {
      rider_id: "DRV002",
      rider_name: "Michael Chen",
      rider_email: "michael@trackfleet.com",
      rider_phone: "01489012345",
      rider_vehicle: "Bike-DH-5678"
    },
    trackingHistory: [
      {
        status: "pending",
        location: "Mirpur 10, Dhaka",
        timestamp: "2026-01-08T10:00:00Z",
        description: "Order placed"
      },
      {
        status: "ongoing",
        location: "Mohammadpur, Dhaka",
        timestamp: "2026-01-08T12:30:00Z",
        description: "In transit"
      },
      {
        status: "delivered",
        location: "Banani, Dhaka",
        timestamp: "2026-01-08T14:45:00Z",
        description: "Successfully delivered"
      }
    ],
    payment_status: "paid",
    delivery_fee: 60,
    createdAt: "2026-01-08T10:00:00Z",
    updatedAt: "2026-01-08T14:45:00Z"
  },
  {
    id: "4",
    parcel_id: "PCL004",
    tracking_no: "DHL2024001237",
    parcel_name: "Food Delivery",
    parcel_status: "ongoing",
    parcel_type: "food",
    parcel_weight: 1.5,
    pickup_location: "Gulshan 2, Dhaka",
    delivery_location: "Bashundhara, Dhaka",
    estimated_delivery: "2026-01-09T13:30:00Z",
    senderInfo: {
      id: "SND004",
      name: "Foodie Restaurant",
      email: "orders@foodie.com",
      phone: "01690123456",
      address: "Gulshan 2, Dhaka"
    },
    receiverInfo: {
      id: "RCV004",
      name: "Sophia Lee",
      email: "sophia@example.com",
      phone: "01501234567",
      address: "Block C, Bashundhara R/A, Dhaka"
    },
    riderInfo: {
      rider_id: "DRV003",
      rider_name: "David Martinez",
      rider_email: "david@trackfleet.com",
      rider_phone: "01412345678",
      rider_vehicle: "Bike-DH-9012"
    },
    trackingHistory: [
      {
        status: "pending",
        location: "Gulshan 2, Dhaka",
        timestamp: "2026-01-09T12:00:00Z",
        description: "Food prepared"
      },
      {
        status: "ongoing",
        location: "Badda, Dhaka",
        timestamp: "2026-01-09T12:45:00Z",
        description: "On the way"
      }
    ],
    payment_status: "cod",
    delivery_fee: 50,
    special_instructions: "Ring doorbell twice",
    createdAt: "2026-01-09T12:00:00Z",
    updatedAt: "2026-01-09T12:45:00Z"
  },
  {
    id: "5",
    parcel_id: "PCL005",
    tracking_no: "DHL2024001238",
    parcel_name: "Documents",
    parcel_status: "pending",
    parcel_type: "document",
    parcel_weight: 0.3,
    pickup_location: "Motijheel, Dhaka",
    delivery_location: "Karwan Bazar, Dhaka",
    estimated_delivery: "2026-01-10T11:00:00Z",
    senderInfo: {
      id: "SND005",
      name: "Legal Associates",
      email: "info@legal.com",
      phone: "01723456789",
      address: "Motijheel C/A, Dhaka"
    },
    receiverInfo: {
      id: "RCV005",
      name: "Robert Brown",
      email: "robert@example.com",
      phone: "01634567890",
      address: "Karwan Bazar, Dhaka"
    },
    trackingHistory: [
      {
        status: "pending",
        location: "Motijheel, Dhaka",
        timestamp: "2026-01-09T16:00:00Z",
        description: "Awaiting courier assignment"
      }
    ],
    payment_status: "paid",
    delivery_fee: 40,
    createdAt: "2026-01-09T16:00:00Z",
    updatedAt: "2026-01-09T16:00:00Z"
  },
  {
    id: "6",
    parcel_id: "PCL006",
    tracking_no: "DHL2024001239",
    parcel_name: "Grocery Items",
    parcel_status: "delivered",
    parcel_type: "package",
    parcel_weight: 5.0,
    parcel_value: 2500,
    pickup_location: "Mohammadpur, Dhaka",
    delivery_location: "Lalmatia, Dhaka",
    estimated_delivery: "2026-01-07T19:00:00Z",
    actual_delivery: "2026-01-07T18:30:00Z",
    senderInfo: {
      id: "SND006",
      name: "Fresh Mart",
      email: "orders@freshmart.com",
      phone: "01545678901",
      address: "Mohammadpur, Dhaka"
    },
    receiverInfo: {
      id: "RCV006",
      name: "Emma Wilson",
      email: "emma@example.com",
      phone: "01456789012",
      address: "Lalmatia, Dhaka"
    },
    riderInfo: {
      rider_id: "DRV004",
      rider_name: "Emily Rodriguez",
      rider_email: "emily@trackfleet.com",
      rider_phone: "01367890123",
      rider_vehicle: "Van-DH-3456"
    },
    trackingHistory: [
      {
        status: "pending",
        location: "Mohammadpur, Dhaka",
        timestamp: "2026-01-07T17:00:00Z",
        description: "Picked up from store"
      },
      {
        status: "delivered",
        location: "Lalmatia, Dhaka",
        timestamp: "2026-01-07T18:30:00Z",
        description: "Delivered successfully"
      }
    ],
    payment_status: "paid",
    delivery_fee: 70,
    createdAt: "2026-01-07T17:00:00Z",
    updatedAt: "2026-01-07T18:30:00Z"
  },
  {
    id: "7",
    parcel_id: "PCL007",
    tracking_no: "DHL2024001240",
    parcel_name: "Laptop",
    parcel_status: "return",
    parcel_type: "electronics",
    parcel_weight: 3.0,
    parcel_value: 85000,
    pickup_location: "Dhanmondi, Dhaka",
    delivery_location: "Mirpur, Dhaka",
    senderInfo: {
      id: "SND007",
      name: "Tech Solutions",
      email: "support@techsol.com",
      phone: "01278901234",
      address: "Dhanmondi 32, Dhaka"
    },
    receiverInfo: {
      id: "RCV007",
      name: "James Anderson",
      email: "james@example.com",
      phone: "01189012345",
      address: "Mirpur 2, Dhaka"
    },
    trackingHistory: [
      {
        status: "ongoing",
        location: "Dhanmondi, Dhaka",
        timestamp: "2026-01-06T10:00:00Z",
        description: "Out for delivery"
      },
      {
        status: "return",
        location: "Mirpur, Dhaka",
        timestamp: "2026-01-06T15:00:00Z",
        description: "Customer refused delivery - returning to sender"
      }
    ],
    payment_status: "pending",
    delivery_fee: 150,
    createdAt: "2026-01-06T10:00:00Z",
    updatedAt: "2026-01-06T15:00:00Z"
  },
  {
    id: "8",
    parcel_id: "PCL008",
    tracking_no: "DHL2024001241",
    parcel_name: "Books",
    parcel_status: "ongoing",
    parcel_type: "package",
    parcel_weight: 2.0,
    parcel_value: 1500,
    pickup_location: "Nilkhet, Dhaka",
    delivery_location: "Azimpur, Dhaka",
    estimated_delivery: "2026-01-09T17:00:00Z",
    senderInfo: {
      id: "SND008",
      name: "Book Store",
      email: "orders@bookstore.com",
      phone: "01990123456",
      address: "Nilkhet, Dhaka"
    },
    receiverInfo: {
      id: "RCV008",
      name: "Olivia Taylor",
      email: "olivia@example.com",
      phone: "01801234567",
      address: "Azimpur, Dhaka"
    },
    riderInfo: {
      rider_id: "DRV001",
      rider_name: "Sarah Johnson",
      rider_email: "sarah@trackfleet.com",
      rider_phone: "01534567890",
      rider_vehicle: "Bike-DH-1234"
    },
    trackingHistory: [
      {
        status: "pending",
        location: "Nilkhet, Dhaka",
        timestamp: "2026-01-09T13:00:00Z",
        description: "Package ready"
      },
      {
        status: "ongoing",
        location: "New Market, Dhaka",
        timestamp: "2026-01-09T15:30:00Z",
        description: "In transit"
      }
    ],
    payment_status: "cod",
    delivery_fee: 45,
    createdAt: "2026-01-09T13:00:00Z",
    updatedAt: "2026-01-09T15:30:00Z"
  },
  {
    id: "9",
    parcel_id: "PCL009",
    tracking_no: "DHL2024001242",
    parcel_name: "Fragile Glassware",
    parcel_status: "cancelled",
    parcel_type: "fragile",
    parcel_weight: 4.0,
    parcel_value: 8000,
    pickup_location: "Gulshan, Dhaka",
    delivery_location: "Baridhara, Dhaka",
    senderInfo: {
      id: "SND009",
      name: "Home Decor",
      email: "orders@homedecor.com",
      phone: "01712345098",
      address: "Gulshan Avenue, Dhaka"
    },
    receiverInfo: {
      id: "RCV009",
      name: "William Davis",
      email: "william@example.com",
      phone: "01623456109",
      address: "Baridhara DOHS, Dhaka"
    },
    trackingHistory: [
      {
        status: "pending",
        location: "Gulshan, Dhaka",
        timestamp: "2026-01-08T11:00:00Z",
        description: "Order received"
      },
      {
        status: "cancelled",
        location: "Gulshan, Dhaka",
        timestamp: "2026-01-08T13:00:00Z",
        description: "Cancelled by customer"
      }
    ],
    payment_status: "pending",
    delivery_fee: 100,
    special_instructions: "Extremely fragile - handle with extra care",
    createdAt: "2026-01-08T11:00:00Z",
    updatedAt: "2026-01-08T13:00:00Z"
  },
  {
    id: "10",
    parcel_id: "PCL010",
    tracking_no: "DHL2024001243",
    parcel_name: "Mobile Phone",
    parcel_status: "pending",
    parcel_type: "electronics",
    parcel_weight: 0.5,
    parcel_value: 45000,
    pickup_location: "Banani, Dhaka",
    delivery_location: "Uttara, Dhaka",
    estimated_delivery: "2026-01-10T14:00:00Z",
    senderInfo: {
      id: "SND010",
      name: "Mobile World",
      email: "sales@mobileworld.com",
      phone: "01534567210",
      address: "Banani 11, Dhaka"
    },
    receiverInfo: {
      id: "RCV010",
      name: "Isabella Martinez",
      email: "isabella@example.com",
      phone: "01445678321",
      address: "Sector 7, Uttara, Dhaka"
    },
    trackingHistory: [
      {
        status: "pending",
        location: "Banani, Dhaka",
        timestamp: "2026-01-09T18:00:00Z",
        description: "Order confirmed - awaiting pickup"
      }
    ],
    payment_status: "paid",
    delivery_fee: 80,
    special_instructions: "Require signature on delivery",
    createdAt: "2026-01-09T18:00:00Z",
    updatedAt: "2026-01-09T18:00:00Z"
  }
];