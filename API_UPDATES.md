# API Updates Summary

## Changes Made

### 1. Updated Parcel API Structure

#### Added Coordinate Fields to `ApiParcel` Type
**File:** `types/parcel.ts`

Added `pickup_coordinates` and `delivery_coordinates` to match the new API response:

```typescript
export interface ApiParcel {
    // ... existing fields
    pickup_coordinates: {
        lat: number;
        lng: number;
    };
    delivery_coordinates: {
        lat: number;
        lng: number;
    };
}
```

**Note:** Also fixed field name from `weight` to `parcel_weight` to match API response.

### 2. Changed Driver Endpoint from Admin Location to Parcel Location

#### Old Endpoint (Removed)
```
GET /api/admin/available-drivers/
```
- Required admin's browser geolocation
- Calculated distance from admin to drivers
- Not practical for parcel assignment

#### New Endpoint (Implemented)
```
GET /api/admin/available-nearest-drivers/?parcel_id={parcelId}
```
- Uses parcel's pickup location coordinates
- Calculates distance from parcel to drivers
- More accurate for finding nearest drivers to pickup location

### 3. Updated Redux API Service

**File:** `redux/services/parcelApi.ts`

#### Changes:
1. **Renamed endpoint:** `getAvailableDrivers` → `getNearestDrivers`
2. **Added parameter:** Now accepts `parcelId` (number | string)
3. **Updated query:** Uses new endpoint with parcel_id parameter
4. **Added distance mapping:** Maps `distance` field from API response
5. **Updated parcel mapping:** Added coordinate fields to parcel transformation

```typescript
// Old
getAvailableDrivers: builder.query<Driver[], void>({
  query: () => '/api/admin/available-drivers/',
  // ...
})

// New
getNearestDrivers: builder.query<Driver[], number | string>({
  query: (parcelId) => `/api/admin/available-nearest-drivers/?parcel_id=${parcelId}`,
  transformResponse: (response: ApiAvailableDriversResponse) => {
    return response.data.map((apiDriver) => ({
      // ... other fields
      distance: apiDriver.distance, // Distance from parcel location
    }));
  },
})
```

### 4. Updated AssignDriverModal Component

**File:** `components/SuperAdmin/ParcelsManagement/AssignDriverModal.tsx`

#### Changes:
1. **Updated import:** `useGetAvailableDriversQuery` → `useGetNearestDriversQuery`
2. **Added Driver type import** for TypeScript type safety
3. **Pass parcel ID:** Query now receives `parcel.id` parameter
4. **Added type annotations:** Fixed TypeScript lint errors

```typescript
// Old
const { data: drivers = [], isLoading } = useGetAvailableDriversQuery();

// New
const { data: drivers = [], isLoading } = useGetNearestDriversQuery(parcel.id);
```

## API Contract

### Get Nearest Drivers Request
```
GET /api/admin/available-nearest-drivers/?parcel_id=43
```

### Expected Response
```json
{
  "success": true,
  "status": 200,
  "message": "Available drivers retrieved successfully",
  "data": [
    {
      "id": "uuid-here",
      "full_name": "John Doe",
      "phone_number": "+1234567890",
      "vehicle_number": "ABC-123",
      "total_delivery": 45,
      "is_available": true,
      "is_online": true,
      "current_location": "123 Main St",
      "profile_image": "/path/to/image.jpg",
      "lat": 23.7850,
      "lng": 90.4100,
      "distance": "2.5"  // Distance in km from parcel pickup location
    }
  ]
}
```

### Get Parcels Response (Updated)
```json
{
  "success": true,
  "status": 200,
  "message": "Data retrieved successfully",
  "count": 12,
  "total_pages": 2,
  "current_page": 1,
  "next": "http://localhost:8002/api/parcel/parcels/?page=2",
  "previous": null,
  "data": [
    {
      "id": 42,
      "tracking_id": "TRK095696456",
      "title": "Docs",
      "parcel_type": "Docs",
      "customer_name": "bhai 5",
      "customer_phone": "0193436656",
      "pickup_location": "49 Bir Uttam AK Khandakar Road, Dhaka 1212, Bangladesh",
      "delivery_location": "QCXX+5V2, Dhaka, Bangladesh",
      "estimated_delivary_date": "2026-02-24T00:00:00Z",
      "parcel_weight": 20.0,
      "special_instructions": "Deliver carefully",
      "appoximate_distance": "15.2 km",
      "status": "PENDING",
      "Driver_name": " Unassigned",
      "Driver_phone": "Unassigned",
      "seller": {
        "Full_name": "Mahedi Hasan Noyon",
        "phone_number": "015254541122"
      },
      "pickup_coordinates": {
        "lat": 23.780664,
        "lng": 90.407492
      },
      "delivery_coordinates": {
        "lat": 24.797911,
        "lng": 90.449581
      }
    }
  ]
}
```

## Benefits of New Approach

### ✅ More Accurate Distance Calculation
- Distance calculated from **parcel pickup location** to driver
- No need for admin's browser location permission
- Works consistently across all devices and browsers

### ✅ Better User Experience
- No browser permission prompts
- Faster loading (no geolocation delay)
- More reliable (no location access errors)

### ✅ Logical Flow
- Shows drivers nearest to where the parcel needs to be picked up
- Makes sense for parcel assignment workflow
- Backend has access to precise coordinates

### ✅ Simplified Frontend
- Removed geolocation logic from modal
- No error handling for location permission
- Cleaner, simpler code

## Migration Notes

### Breaking Changes
- `useGetAvailableDriversQuery()` hook removed
- Replaced with `useGetNearestDriversQuery(parcelId)`
- All components using the old hook must be updated

### No UI Changes
- The modal UI remains exactly the same
- Distance is still displayed with truck icon
- No visual changes for end users

### Type Safety
- Added proper TypeScript types for all new fields
- Fixed lint errors with explicit type annotations
- Improved type safety throughout the codebase

## Files Modified

1. ✅ `types/parcel.ts` - Added coordinate fields
2. ✅ `types/driver.ts` - Distance field already present
3. ✅ `redux/services/parcelApi.ts` - Updated endpoint and mapping
4. ✅ `components/SuperAdmin/ParcelsManagement/AssignDriverModal.tsx` - Updated hook usage

## Testing Checklist

- [ ] Verify parcel list loads with coordinates
- [ ] Open AssignDriverModal for a parcel
- [ ] Verify drivers load with distances
- [ ] Verify distance is calculated from parcel location
- [ ] Test driver assignment functionality
- [ ] Verify no TypeScript errors
- [ ] Check network tab for correct API call format
